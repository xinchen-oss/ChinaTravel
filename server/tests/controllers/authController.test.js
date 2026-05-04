import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { mockRes } from '../helpers/chain.js';

jest.unstable_mockModule('../../src/models/User.js', () => ({
  default: {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}));
jest.unstable_mockModule('../../src/services/emailService.js', () => ({
  sendEmail: jest.fn(),
}));
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { sign: jest.fn() },
}));

const { default: User } = await import('../../src/models/User.js');
const { sendEmail } = await import('../../src/services/emailService.js');
const { default: jwt } = await import('jsonwebtoken');
const { default: ApiError } = await import('../../src/utils/ApiError.js');
const {
  register,
  login,
  getMe,
} = await import('../../src/controllers/authController.js');

beforeEach(() => jest.clearAllMocks());

const validBody = {
  nombre: 'Ana',
  email: 'ana@test.com',
  password: 'Abcdefg1!',
  role: 'USER',
};

describe('authController.register', () => {
  it('registra un usuario USER y devuelve token', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: '1', ...validBody });
    jwt.sign.mockReturnValue('TKN');
    const res = mockRes();

    await register({ body: validBody }, res);

    expect(sendEmail).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ ok: true, token: 'TKN' })
    );
  });

  it('lanza ApiError si el email ya existe', async () => {
    User.findOne.mockResolvedValue({ email: validBody.email });
    await expect(register({ body: validBody }, mockRes())).rejects.toThrow(ApiError);
  });

  it('un comercial queda pendiente de aprobación (sin token)', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: '1', ...validBody, role: 'COMERCIAL' });
    const res = mockRes();

    await register(
      { body: { ...validBody, role: 'COMERCIAL', empresaNombre: 'X', empresaCIF: 'B1' } },
      res
    );

    expect(sendEmail).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ pendingApproval: true })
    );
  });

  it('lanza ApiError si la password es débil', async () => {
    await expect(
      register({ body: { ...validBody, password: '123' } }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});

describe('authController.login', () => {
  it('inicia sesión con credenciales correctas', async () => {
    const user = {
      _id: '1',
      isActive: true,
      isApproved: true,
      comparePassword: jest.fn().mockResolvedValue(true),
    };
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(user) });
    jwt.sign.mockReturnValue('TKN');
    const res = mockRes();

    await login({ body: { email: 'a@b.com', password: 'x' } }, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ ok: true, token: 'TKN' })
    );
  });

  it('rechaza con password incorrecta', async () => {
    const user = { comparePassword: jest.fn().mockResolvedValue(false) };
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(user) });
    await expect(
      login({ body: { email: 'a@b.com', password: 'x' } }, mockRes())
    ).rejects.toThrow(ApiError);
  });

  it('rechaza si la cuenta comercial no está aprobada', async () => {
    const user = {
      isActive: true,
      isApproved: false,
      comparePassword: jest.fn().mockResolvedValue(true),
    };
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(user) });
    await expect(
      login({ body: { email: 'a@b.com', password: 'x' } }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});

describe('authController.getMe', () => {
  it('devuelve el usuario actual', async () => {
    const res = mockRes();
    await getMe({ user: { _id: '1', nombre: 'Ana', email: 'a@b.com' } }, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ ok: true, user: expect.objectContaining({ nombre: 'Ana' }) })
    );
  });
});
