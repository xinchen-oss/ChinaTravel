import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { chainable, mockRes } from '../helpers/chain.js';

jest.unstable_mockModule('../../src/models/Ruta.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
  },
}));
jest.unstable_mockModule('../../src/models/Activity.js', () => ({
  default: { find: jest.fn() },
}));
jest.unstable_mockModule('../../src/models/Order.js', () => ({
  default: { find: jest.fn() },
}));
jest.unstable_mockModule('../../src/models/Review.js', () => ({
  default: { find: jest.fn() },
}));

const { default: Ruta } = await import('../../src/models/Ruta.js');
const { default: Activity } = await import('../../src/models/Activity.js');
const { default: Order } = await import('../../src/models/Order.js');
const { default: Review } = await import('../../src/models/Review.js');
const { default: ApiError } = await import('../../src/utils/ApiError.js');
const {
  getRutas,
  getRuta,
  getMyRutas,
  getMyRouteStats,
  getAlternativeActivities,
  createRuta,
  updateRuta,
  deleteRuta,
} = await import('../../src/controllers/rutaController.js');

beforeEach(() => jest.clearAllMocks());

describe('rutaController.getRutas', () => {
  it('filtra por ciudad', async () => {
    const data = [{ titulo: 'R' }];
    Ruta.find.mockReturnValue(chainable(data));
    const res = mockRes();
    await getRutas({ query: { ciudad: '123' } }, res);
    expect(Ruta.find).toHaveBeenCalledWith({ isActive: true, ciudad: '123' });
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('sin filtro', async () => {
    Ruta.find.mockReturnValue(chainable([]));
    await getRutas({ query: {} }, mockRes());
    expect(Ruta.find).toHaveBeenCalledWith({ isActive: true });
  });
});

describe('rutaController.getRuta', () => {
  it('devuelve ruta', async () => {
    const data = { titulo: 'R' };
    Ruta.findById.mockReturnValue(chainable(data));
    const res = mockRes();
    await getRuta({ params: { id: '1' } }, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('devuelve las rutas del comercial autenticado', async () => {
    const data = [{ titulo: 'R' }];
    Ruta.find.mockReturnValue(chainable(data));
    const res = mockRes();
    await getMyRutas({ user: { _id: 'u1', role: 'COMERCIAL' } }, res);
    expect(Ruta.find).toHaveBeenCalledWith({ creadoPor: 'u1' });
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('lanza 404 si no existe', async () => {
    Ruta.findById.mockReturnValue(chainable(null));
    await expect(getRuta({ params: { id: '1' } }, mockRes())).rejects.toThrow(ApiError);
  });
});

describe('rutaController.getMyRouteStats', () => {
  it('devuelve estadísticas agregadas para las rutas del comercial', async () => {
    Ruta.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue([{ _id: 'r1', titulo: 'Ruta 1', ciudad: { nombre: 'Pekín' } }]),
      }),
    });
    Order.find.mockReturnValue({ select: jest.fn().mockResolvedValue([{ ruta: 'r1', precioTotal: 40 }, { ruta: 'r1', precioTotal: 20 }]) });
    Review.find.mockReturnValue({ select: jest.fn().mockResolvedValue([{ referencia: 'r1', puntuacion: 5 }, { referencia: 'r1', puntuacion: 4 }]) });

    const res = mockRes();
    await getMyRouteStats({ user: { _id: 'u1' } }, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      ok: true,
      data: expect.objectContaining({
        summary: expect.objectContaining({ totalOrders: 2, totalIncome: 60, averageRating: 4.5 }),
        routes: expect.any(Array),
      }),
    }));
  });
});

describe('rutaController.getAlternativeActivities', () => {
  it('devuelve actividades alternativas con filtros', async () => {
    Ruta.findById.mockReturnValue(chainable({ ciudad: { _id: 'city1' } }));
    const data = [{ nombre: 'A' }];
    Activity.find.mockResolvedValue(data);
    const res = mockRes();
    await getAlternativeActivities(
      { params: { id: '1' }, query: { categoria: 'CULTURAL', exclude: '1,2' } },
      res
    );
    expect(Activity.find).toHaveBeenCalledWith({
      ciudad: 'city1',
      isApproved: true,
      categoria: 'CULTURAL',
      _id: { $nin: ['1', '2'] },
    });
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('lanza 404 si la ruta no existe', async () => {
    Ruta.findById.mockReturnValue(chainable(null));
    await expect(
      getAlternativeActivities({ params: { id: '1' }, query: {} }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});

describe('rutaController.createRuta', () => {
  it('crea ruta y recalcula su precio', async () => {
    Ruta.create.mockResolvedValue({ _id: '1' });
    Ruta.findById.mockReturnValue(chainable({ dias: [], precio: 0, save: jest.fn().mockResolvedValue() }));
    const res = mockRes();
    await createRuta({ body: { titulo: 'X', dias: [] } }, res);
    expect(Ruta.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });
});

describe('rutaController.updateRuta', () => {
  it('actualiza ruta', async () => {
    Ruta.findByIdAndUpdate.mockResolvedValue({ _id: '1' });
    Ruta.findById.mockReturnValue(chainable({ dias: [], precio: 0, save: jest.fn().mockResolvedValue() }));
    const res = mockRes();
    await updateRuta({ params: { id: '1' }, body: { titulo: 'U' } }, res);
    expect(res.json).toHaveBeenCalled();
  });

  it('lanza 404 si no existe', async () => {
    Ruta.findByIdAndUpdate.mockResolvedValue(null);
    await expect(
      updateRuta({ params: { id: '1' }, body: {} }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});

describe('rutaController.deleteRuta', () => {
  it('elimina ruta', async () => {
    const deleteOne = jest.fn().mockResolvedValue();
    Ruta.findById.mockResolvedValue({ deleteOne });
    const res = mockRes();
    await deleteRuta({ params: { id: '1' } }, res);
    expect(deleteOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true, message: 'Ruta eliminada' });
  });

  it('lanza 404 si no existe', async () => {
    Ruta.findById.mockResolvedValue(null);
    await expect(deleteRuta({ params: { id: '1' } }, mockRes())).rejects.toThrow(ApiError);
  });
});
