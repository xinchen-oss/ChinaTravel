import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { mockRes } from '../helpers/chain.js';

jest.unstable_mockModule('../../src/models/User.js', () => ({
  default: { findById: jest.fn() },
}));
jest.unstable_mockModule('../../src/models/Notification.js', () => ({
  default: { create: jest.fn() },
}));
jest.unstable_mockModule('../../src/services/emailService.js', () => ({
  sendEmail: jest.fn(),
}));

const { default: User } = await import('../../src/models/User.js');
const { default: Notification } = await import('../../src/models/Notification.js');
const { sendEmail } = await import('../../src/services/emailService.js');
const { default: ApiError } = await import('../../src/utils/ApiError.js');
const { approveComercial } = await import('../../src/controllers/userController.js');

beforeEach(() => jest.clearAllMocks());

describe('userController.approveComercial', () => {
  it('aprueba comercial: guarda, notifica y envía email', async () => {
    const user = {
      _id: '123',
      nombre: 'Juan',
      email: 'juan@test.com',
      role: 'COMERCIAL',
      isApproved: false,
      save: jest.fn().mockResolvedValue(),
    };
    User.findById.mockResolvedValue(user);

    const res = mockRes();
    await approveComercial({ params: { id: '123' }, body: { approved: true } }, res);

    expect(User.findById).toHaveBeenCalledWith('123');
    expect(user.isApproved).toBe(true);
    expect(user.save).toHaveBeenCalled();
    expect(Notification.create).toHaveBeenCalledWith(
      expect.objectContaining({ usuario: '123', tipo: 'SISTEMA' })
    );
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'juan@test.com', subject: expect.stringContaining('aprobada') })
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ ok: true, message: 'Cuenta Comercial aprobada' })
    );
  });

  it('rechaza comercial: elimina el usuario y avisa', async () => {
    const user = {
      _id: '123',
      nombre: 'Juan',
      email: 'juan@test.com',
      role: 'COMERCIAL',
      deleteOne: jest.fn().mockResolvedValue(),
    };
    User.findById.mockResolvedValue(user);

    const res = mockRes();
    await approveComercial({ params: { id: '123' }, body: { approved: false } }, res);

    expect(user.deleteOne).toHaveBeenCalled();
    expect(Notification.create).toHaveBeenCalledWith(
      expect.objectContaining({ usuario: '123', tipo: 'SISTEMA' })
    );
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'juan@test.com', subject: expect.stringContaining('rechazada') })
    );
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
  });

  it('lanza 404 si el usuario no existe', async () => {
    User.findById.mockResolvedValue(null);
    await expect(
      approveComercial({ params: { id: '999' }, body: { approved: true } }, mockRes())
    ).rejects.toThrow(ApiError);
  });

  it('lanza 400 si el usuario no es COMERCIAL', async () => {
    User.findById.mockResolvedValue({ _id: '1', role: 'USER' });
    await expect(
      approveComercial({ params: { id: '1' }, body: { approved: true } }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});
