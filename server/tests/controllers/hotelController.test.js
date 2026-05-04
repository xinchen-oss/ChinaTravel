import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { chainable, mockRes } from '../helpers/chain.js';

jest.unstable_mockModule('../../src/models/Hotel.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
  },
}));

const { default: Hotel } = await import('../../src/models/Hotel.js');
const { default: ApiError } = await import('../../src/utils/ApiError.js');
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
} = await import('../../src/controllers/hotelController.js');

beforeEach(() => jest.clearAllMocks());

describe('hotelController.getHotels', () => {
  it('filtra por ciudad', async () => {
    const data = [{ nombre: 'Hotel 1' }];
    Hotel.find.mockReturnValue(chainable(data));
    const res = mockRes();
    await getHotels({ query: { ciudad: '123' } }, res);
    expect(Hotel.find).toHaveBeenCalledWith({ isApproved: true, ciudad: '123' });
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('sin filtro de ciudad', async () => {
    Hotel.find.mockReturnValue(chainable([]));
    await getHotels({ query: {} }, mockRes());
    expect(Hotel.find).toHaveBeenCalledWith({ isApproved: true });
  });
});

describe('hotelController.getHotel', () => {
  it('devuelve un hotel', async () => {
    const data = { nombre: 'H1' };
    Hotel.findById.mockReturnValue(chainable(data));
    const res = mockRes();
    await getHotel({ params: { id: '1' } }, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('lanza 404 si no existe', async () => {
    Hotel.findById.mockReturnValue(chainable(null));
    await expect(getHotel({ params: { id: '1' } }, mockRes())).rejects.toThrow(ApiError);
  });
});

describe('hotelController.createHotel', () => {
  it('crea un hotel', async () => {
    const data = { nombre: 'Nuevo' };
    Hotel.create.mockResolvedValue(data);
    const res = mockRes();
    await createHotel({ body: data }, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });
});

describe('hotelController.updateHotel', () => {
  it('actualiza un hotel', async () => {
    const data = { nombre: 'U' };
    Hotel.findByIdAndUpdate.mockResolvedValue(data);
    const res = mockRes();
    await updateHotel({ params: { id: '1' }, body: data }, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('lanza 404 si no existe', async () => {
    Hotel.findByIdAndUpdate.mockResolvedValue(null);
    await expect(
      updateHotel({ params: { id: '1' }, body: {} }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});

describe('hotelController.deleteHotel', () => {
  it('elimina hotel', async () => {
    const deleteOne = jest.fn().mockResolvedValue();
    Hotel.findById.mockResolvedValue({ deleteOne });
    const res = mockRes();
    await deleteHotel({ params: { id: '1' } }, res);
    expect(deleteOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true, message: 'Hotel eliminado' });
  });

  it('lanza 404 si no existe', async () => {
    Hotel.findById.mockResolvedValue(null);
    await expect(deleteHotel({ params: { id: '1' } }, mockRes())).rejects.toThrow(ApiError);
  });
});
