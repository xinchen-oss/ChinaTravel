import {
  register,
  login,
  getMe,
  updateProfile,
 solicitarCambioEmail,
  confirmarCambioEmail,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller.js';

import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { sendEmail } from '../services/emailService.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// 🔹 Mocks
jest.mock('../models/User.js');
jest.mock('../services/emailService.js');
jest.mock('jsonwebtoken');

const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Controller', () => {

  afterEach(() => jest.clearAllMocks());

  // 🔹 REGISTER
  describe('register', () => {

    it('should register normal user', async () => {
      const req = {
        body: {
          nombre: 'Ella',
          email: 'test@test.com',
          password: 'Password1!',
          role: 'USER'
        }
      };
      const res = mockRes();

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ _id: '123', ...req.body });

      jwt.sign.mockReturnValue('token123');

      await register(req, res);

      expect(sendEmail).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ok: true,
        token: 'token123'
      }));
    });

    it('should fail if email exists', async () => {
      const req = { body: { email: 'test@test.com' } };
      const res = mockRes();

      User.findOne.mockResolvedValue({ email: 'test@test.com' });

      await expect(register(req, res)).rejects.toThrow(ApiError);
    });

    it('should register comercial user (pending approval)', async () => {
      const req = {
        body: {
          nombre: 'Ella',
          email: 'test@test.com',
          password: 'Password1!',
          role: 'COMERCIAL'
        }
      };
      const res = mockRes();

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ _id: '123', ...req.body });

      await register(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        pendingApproval: true
      }));
    });

  });

  // 🔹 LOGIN
  describe('login', () => {

    it('should login successfully', async () => {
      const req = {
        body: { email: 'test@test.com', password: 'Password1!' }
      };
      const res = mockRes();

      const mockUser = {
        _id: '123',
        isActive: true,
        isApproved: true,
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      jwt.sign.mockReturnValue('token123');

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ok: true,
        token: 'token123'
      }));
    });

    it('should fail with wrong password', async () => {
      const req = { body: { email: 'a', password: 'b' } };
      const res = mockRes();

      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await expect(login(req, res)).rejects.toThrow(ApiError);
    });

  });

  // 🔹 GET ME
  describe('getMe', () => {
    it('should return current user', async () => {
      const req = { user: { _id: '123', nombre: 'Ella' } };
      const res = mockRes();

      await getMe(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ok: true
      }));
    });
  });

  // 🔹 UPDATE PROFILE
  describe('updateProfile', () => {

    it('should update user profile', async () => {
      const req = {
        user: { _id: '123' },
        body: { nombre: 'Nuevo' }
      };
      const res = mockRes();

      const saveMock = jest.fn();

      const mockUser = {
        nombre: 'Viejo',
        save: saveMock
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await updateProfile(req, res);

      expect(saveMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('should fail if user not found', async () => {
      const req = { user: { _id: '123' }, body: {} };
      const res = mockRes();

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await expect(updateProfile(req, res)).rejects.toThrow(ApiError);
    });

  });

  // 🔹 SOLICITAR CAMBIO EMAIL
  describe('solicitarCambioEmail', () => {

    it('should send email change request', async () => {
      const req = {
        user: { _id: '123' },
        body: { nuevoEmail: 'new@test.com' }
      };
      const res = mockRes();

      const saveMock = jest.fn();

      const mockUser = {
        email: 'old@test.com',
        nombre: 'Ella',
        save: saveMock
      };

      User.findById.mockResolvedValue(mockUser);
      User.findOne.mockResolvedValue(null);

      await solicitarCambioEmail(req, res);

      expect(sendEmail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

  });

  // 🔹 CONFIRMAR CAMBIO EMAIL
  describe('confirmarCambioEmail', () => {

    it('should confirm email change', async () => {
      const req = { params: { token: 'token' } };
      const res = mockRes();

      const saveMock = jest.fn();

      const mockUser = {
        pendingEmail: 'new@test.com',
        save: saveMock
      };

      jest.spyOn(crypto, 'createHash').mockReturnValue({
        update: () => ({
          digest: () => 'hashed'
        })
      });

      User.findOne.mockResolvedValue(mockUser);

      await confirmarCambioEmail(req, res);

      expect(saveMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

  });

  // 🔹 FORGOT PASSWORD
  describe('forgotPassword', () => {

    it('should send reset email', async () => {
      const req = { body: { email: 'test@test.com' } };
      const res = mockRes();

      const saveMock = jest.fn();

      const mockUser = {
        nombre: 'Ella',
        save: saveMock
      };

      User.findOne.mockResolvedValue(mockUser);

      await forgotPassword(req, res);

      expect(sendEmail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

  });

  // 🔹 RESET PASSWORD
  describe('resetPassword', () => {

    it('should reset password successfully', async () => {
      const req = {
        params: { token: 'token' },
        body: { password: 'Password1!' }
      };
      const res = mockRes();

      const saveMock = jest.fn();

      const mockUser = {
        _id: '123',
        nombre: 'Ella',
        email: 'test@test.com',
        save: saveMock
      };

      jest.spyOn(crypto, 'createHash').mockReturnValue({
        update: () => ({
          digest: () => 'hashed'
        })
      });

      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('token123');

      await resetPassword(req, res);

      expect(saveMock).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ok: true,
        token: 'token123'
      }));
    });

  });

});
