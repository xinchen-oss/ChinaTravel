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

const { default: Activity } = await import('../../src/models/Activity.js');
const { default: ApiError } = await import('../../src/utils/ApiError.js');
const {
  getActivities,
  getActivity,
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
      ciudad: 'Madrid',
      categoria: 'Ocio',
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
    Activity.findByIdAndUpdate.mockReturnValue(chainable(data));
    const res = mockRes();
    await updateActivity({ params: { id: '1' }, body: data }, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('lanza 404 si no existe', async () => {
    Activity.findByIdAndUpdate.mockReturnValue(chainable(null));
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
