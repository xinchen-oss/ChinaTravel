import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { chainable, mockRes } from '../helpers/chain.js';

jest.unstable_mockModule('../../src/models/City.js', () => ({
  default: {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
  },
}));

const { default: City } = await import('../../src/models/City.js');
const { default: ApiError } = await import('../../src/utils/ApiError.js');
const {
  getCities,
  getFeaturedCities,
  getCityBySlug,
  createCity,
  updateCity,
  deleteCity,
} = await import('../../src/controllers/cityController.js');

beforeEach(() => jest.clearAllMocks());

describe('cityController.getCities', () => {
  it('devuelve todas las ciudades ordenadas', async () => {
    const data = [{ nombre: 'Madrid' }];
    City.find.mockReturnValue(chainable(data));
    const res = mockRes();
    await getCities({}, res);
    expect(City.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });
});

describe('cityController.getFeaturedCities', () => {
  it('filtra por destacada=true', async () => {
    const data = [{ nombre: 'Beijing', destacada: true }];
    City.find.mockReturnValue(chainable(data));
    const res = mockRes();
    await getFeaturedCities({}, res);
    expect(City.find).toHaveBeenCalledWith({ destacada: true });
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });
});

describe('cityController.getCityBySlug', () => {
  it('devuelve la ciudad por slug', async () => {
    const data = { nombre: 'Madrid' };
    City.findOne.mockResolvedValue(data);
    const res = mockRes();
    await getCityBySlug({ params: { slug: 'madrid' } }, res);
    expect(City.findOne).toHaveBeenCalledWith({ slug: 'madrid' });
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('lanza 404 si no existe', async () => {
    City.findOne.mockResolvedValue(null);
    await expect(getCityBySlug({ params: { slug: 'x' } }, mockRes())).rejects.toThrow(ApiError);
  });
});

describe('cityController.createCity', () => {
  it('crea una ciudad con status 201', async () => {
    const data = { nombre: 'Shanghai' };
    City.create.mockResolvedValue(data);
    const res = mockRes();
    await createCity({ body: data }, res);
    expect(City.create).toHaveBeenCalledWith(data);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });
});

describe('cityController.updateCity', () => {
  it('actualiza una ciudad', async () => {
    const data = { nombre: 'Updated' };
    City.findByIdAndUpdate.mockResolvedValue(data);
    const res = mockRes();
    await updateCity({ params: { id: '1' }, body: data }, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('lanza 404 si no existe', async () => {
    City.findByIdAndUpdate.mockResolvedValue(null);
    await expect(
      updateCity({ params: { id: '1' }, body: {} }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});

describe('cityController.deleteCity', () => {
  it('elimina la ciudad', async () => {
    const deleteOne = jest.fn().mockResolvedValue();
    City.findById.mockResolvedValue({ deleteOne });
    const res = mockRes();
    await deleteCity({ params: { id: '1' } }, res);
    expect(deleteOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true, message: 'Ciudad eliminada' });
  });

  it('lanza 404 si no existe', async () => {
    City.findById.mockResolvedValue(null);
    await expect(deleteCity({ params: { id: '1' } }, mockRes())).rejects.toThrow(ApiError);
  });
});
