import { approveComercial } from '../controllers/user.controller.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendEmail } from '../services/emailService.js';

jest.mock('../models/User.js');
jest.mock('../models/Notification.js');
jest.mock('../services/emailService.js');

describe('approveComercial controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  
  it('should approve commercial user, save changes, send notification and email', async () => {
    const mockUser = {
      _id: '123',
      nombre: 'Juan',
      email: 'juan@test.com',
      role: 'COMERCIAL',
      isApproved: false,
      save: jest.fn(),
    };

    User.findById.mockResolvedValue(mockUser);
    Notification.create.mockResolvedValue({});
    sendEmail.mockResolvedValue({});

    const req = {
      params: { id: '123' },
      body: { approved: true },
    };

    const res = {
      json: jest.fn(),
    };

    await approveComercial(req, res);

    expect(User.findById).toHaveBeenCalledWith('123');

    expect(mockUser.isApproved).toBe(true);
    expect(mockUser.save).toHaveBeenCalled();

    expect(Notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        usuario: '123',
        tipo: 'SISTEMA',
      })
    );

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'juan@test.com',
        subject: expect.stringContaining('aprobada'),
      })
    );

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        ok: true,
        message: 'Cuenta Comercial aprobada',
      })
    );
  });

  
  it('should delete user if commercial is rejected', async () => {
    const mockUser = {
      _id: '123',
      nombre: 'Juan',
      email: 'juan@test.com',
      role: 'COMERCIAL',
      deleteOne: jest.fn(),
    };

    User.findById.mockResolvedValue(mockUser);
    Notification.create.mockResolvedValue({});
    sendEmail.mockResolvedValue({});

    const req = {
      params: { id: '123' },
      body: { approved: false },
    };

    const res = {
      json: jest.fn(),
    };

    await approveComercial(req, res);

    expect(User.findById).toHaveBeenCalledWith('123');
    expect(mockUser.deleteOne).toHaveBeenCalled();

    expect(Notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        usuario: '123',
        tipo: 'SISTEMA',
      })
    );

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'juan@test.com',
        subject: expect.stringContaining('rechazada'),
      })
    );

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        ok: true,
      })
    );
  });

  
  it('should throw error if user does not exist', async () => {
    User.findById.mockResolvedValue(null);

    const req = {
      params: { id: '999' },
      body: { approved: true },
    };

    const res = {
      json: jest.fn(),
    };

    await expect(approveComercial(req, res)).rejects.toThrow();
  });
});
