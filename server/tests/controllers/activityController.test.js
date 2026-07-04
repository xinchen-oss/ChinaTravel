import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { chainable, mockRes } from '../helpers/chain.js';

jest.unstable_mockModule('../../src/models/Activity.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
  },
}));
jest.unstable_mockModule('../../src/models/Order.js', () => ({
  default: {
    find: jest.fn(),
    updateMany: jest.fn(),
  },
}));
jest.unstable_mockModule('../../src/models/Notification.js', () => ({
  default: {
    create: jest.fn(),
  },
}));

const { default: Activity } = await import('../../src/models/Activity.js');
const { default: Order } = await import('../../src/models/Order.js');
const { default: Notification } = await import('../../src/models/Notification.js');
const { default: ApiError } = await import('../../src/utils/ApiError.js');
const {
  getActivities,
  getActivity,
  getMyActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} = await import('../../src/controllers/activityController.js');

beforeEach(() => jest.clearAllMocks());

describe('activityController.getActivities', () => {
  it('aplica filtros ciudad y categoria', async () => {
    const data = [{ nombre: 'Act1' }];
    Activity.find.mockReturnValue(chainable(data));
    const res = mockRes();
    await getActivities({ query: { ciudad: 'Madrid', categoria: 'Ocio' } }, res);
    expect(Activity.find).toHaveBeenCalledWith({
      isApproved: true,
      isActive: true,
      ciudad: 'Madrid',
      categoria: 'Ocio',
    });
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('filtra actividades accesibles cuando se solicita', async () => {
    const data = [{ nombre: 'Act1' }];
    Activity.find.mockReturnValue(chainable(data));
    const res = mockRes();
    await getActivities({ query: { accesible: 'true' } }, res);
    expect(Activity.find).toHaveBeenCalledWith({
      isApproved: true,
      isActive: true,
      accesible: true,
    });
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });
});

describe('activityController.getActivity', () => {
  it('devuelve una actividad', async () => {
    const data = { nombre: 'Act1' };
    Activity.findById.mockReturnValue(chainable(data));
    const res = mockRes();
    await getActivity({ params: { id: '1' } }, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('devuelve las actividades del comercial autenticado', async () => {
    const data = [{ nombre: 'Act1' }];
    Activity.find.mockReturnValue(chainable(data));
    const res = mockRes();
    await getMyActivities({ user: { _id: 'u1', role: 'COMERCIAL' } }, res);
    expect(Activity.find).toHaveBeenCalledWith({ creadoPor: 'u1' });
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('lanza 404 si no existe', async () => {
    Activity.findById.mockReturnValue(chainable(null));
    await expect(getActivity({ params: { id: '1' } }, mockRes())).rejects.toThrow(ApiError);
  });
});

describe('activityController.createActivity', () => {
  it('crea una actividad', async () => {
    const data = { nombre: 'Nueva' };
    Activity.create.mockResolvedValue(data);
    const res = mockRes();
    await createActivity({ body: data }, res);
    expect(Activity.create).toHaveBeenCalledWith(data);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });
});

describe('activityController.updateActivity', () => {
  it('actualiza una actividad', async () => {
    const data = { nombre: 'Updated' };
    Activity.findById.mockResolvedValue({ creadoPor: 'u1' });
    Activity.findByIdAndUpdate.mockReturnValue(chainable(data));
    const res = mockRes();
    await updateActivity({ params: { id: '1' }, body: data, user: { role: 'ADMIN' } }, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('cancela pedidos automáticamente cuando la actividad se desactiva', async () => {
    Activity.findById.mockResolvedValueOnce({ _id: '1', creadoPor: 'u1', isActive: true, isApproved: true });
    Activity.findByIdAndUpdate.mockReturnValue(chainable({ _id: '1', isActive: false, isApproved: true }));
    Order.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([{ _id: 'o1', tipo: 'ACTIVIDAD', actividad: '1', estado: 'CONFIRMADO' }]),
    });
    Order.updateMany.mockResolvedValue({ modifiedCount: 1 });
    const res = mockRes();

    await updateActivity({ params: { id: '1' }, body: { isActive: false }, user: { role: 'ADMIN' } }, res);

    expect(Order.updateMany).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true, data: { _id: '1', isActive: false, isApproved: true } });
  });

  it('envía una notificación al creador cuando se desactiva la actividad', async () => {
    Activity.findById.mockResolvedValueOnce({ _id: '1', creadoPor: 'u1', isActive: true, isApproved: true });
    Activity.findByIdAndUpdate.mockReturnValue(chainable({ _id: '1', creadoPor: 'u1', isActive: false, isApproved: true }));
    Order.find.mockReturnValue({ select: jest.fn().mockResolvedValue([]) });
    const res = mockRes();

    await updateActivity({ params: { id: '1' }, body: { isActive: false }, user: { role: 'ADMIN' } }, res);

    expect(Notification.create).toHaveBeenCalledWith(expect.objectContaining({
      usuario: 'u1',
      tipo: 'SISTEMA',
      titulo: 'Actividad desactivada',
    }));
  });

  it('lanza 404 si no existe', async () => {
    Activity.findById.mockResolvedValue(null);
    await expect(
      updateActivity({ params: { id: '1' }, body: {} }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});

describe('activityController.deleteActivity', () => {
  it('elimina la actividad', async () => {
    const deleteOne = jest.fn().mockResolvedValue();
    Activity.findById.mockResolvedValue({ deleteOne });
    const res = mockRes();
    await deleteActivity({ params: { id: '1' } }, res);
    expect(deleteOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true, message: 'Actividad eliminada' });
  });

  it('lanza 404 si no existe', async () => {
    Activity.findById.mockResolvedValue(null);
    await expect(deleteActivity({ params: { id: '1' } }, mockRes())).rejects.toThrow(ApiError);
  });
});
