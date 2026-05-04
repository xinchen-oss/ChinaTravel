import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { chainable, mockRes } from '../helpers/chain.js';

jest.unstable_mockModule('../../src/models/Flight.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
  },
}));

const { default: Flight } = await import('../../src/models/Flight.js');
const { default: ApiError } = await import('../../src/utils/ApiError.js');
const {
  getFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
} = await import('../../src/controllers/flightController.js');

beforeEach(() => jest.clearAllMocks());

describe('flightController.getFlights', () => {
  it('filtra por ciudad destino', async () => {
    const data = [{ aerolinea: 'X' }];
    Flight.find.mockReturnValue(chainable(data));
    const res = mockRes();
    await getFlights({ query: { ciudad: 'PEK' } }, res);
    expect(Flight.find).toHaveBeenCalledWith({ isApproved: true, ciudadDestino: 'PEK' });
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('sin filtro', async () => {
    Flight.find.mockReturnValue(chainable([]));
    await getFlights({ query: {} }, mockRes());
    expect(Flight.find).toHaveBeenCalledWith({ isApproved: true });
  });
});

describe('flightController.getFlight', () => {
  it('devuelve un vuelo', async () => {
    const data = { aerolinea: 'X' };
    Flight.findById.mockReturnValue(chainable(data));
    const res = mockRes();
    await getFlight({ params: { id: '1' } }, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('lanza 404 si no existe', async () => {
    Flight.findById.mockReturnValue(chainable(null));
    await expect(getFlight({ params: { id: '1' } }, mockRes())).rejects.toThrow(ApiError);
  });
});

describe('flightController.createFlight', () => {
  it('crea un vuelo', async () => {
    const data = { aerolinea: 'X' };
    Flight.create.mockResolvedValue(data);
    const res = mockRes();
    await createFlight({ body: data }, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });
});

describe('flightController.updateFlight', () => {
  it('actualiza un vuelo', async () => {
    const data = { aerolinea: 'U' };
    Flight.findByIdAndUpdate.mockResolvedValue(data);
    const res = mockRes();
    await updateFlight({ params: { id: '1' }, body: data }, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('lanza 404 si no existe', async () => {
    Flight.findByIdAndUpdate.mockResolvedValue(null);
    await expect(
      updateFlight({ params: { id: '1' }, body: {} }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});

describe('flightController.deleteFlight', () => {
  it('elimina vuelo', async () => {
    const deleteOne = jest.fn().mockResolvedValue();
    Flight.findById.mockResolvedValue({ deleteOne });
    const res = mockRes();
    await deleteFlight({ params: { id: '1' } }, res);
    expect(deleteOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true, message: 'Vuelo eliminado' });
  });

  it('lanza 404 si no existe', async () => {
    Flight.findById.mockResolvedValue(null);
    await expect(deleteFlight({ params: { id: '1' } }, mockRes())).rejects.toThrow(ApiError);
  });
});
