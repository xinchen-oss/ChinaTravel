import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { chainable, mockRes } from '../helpers/chain.js';

jest.unstable_mockModule('../../src/models/Guide.js', () => ({
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

const { default: Guide } = await import('../../src/models/Guide.js');
const { default: Activity } = await import('../../src/models/Activity.js');
const { default: ApiError } = await import('../../src/utils/ApiError.js');
const {
  getGuides,
  getGuide,
  getAlternativeActivities,
  createGuide,
  updateGuide,
  deleteGuide,
} = await import('../../src/controllers/guideController.js');

beforeEach(() => jest.clearAllMocks());

describe('guideController.getGuides', () => {
  it('filtra por ciudad', async () => {
    const data = [{ titulo: 'G' }];
    Guide.find.mockReturnValue(chainable(data));
    const res = mockRes();
    await getGuides({ query: { ciudad: '123' } }, res);
    expect(Guide.find).toHaveBeenCalledWith({ ciudad: '123' });
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('sin filtro', async () => {
    Guide.find.mockReturnValue(chainable([]));
    await getGuides({ query: {} }, mockRes());
    expect(Guide.find).toHaveBeenCalledWith({});
  });
});

describe('guideController.getGuide', () => {
  it('devuelve guía', async () => {
    const data = { titulo: 'G' };
    Guide.findById.mockReturnValue(chainable(data));
    const res = mockRes();
    await getGuide({ params: { id: '1' } }, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('lanza 404 si no existe', async () => {
    Guide.findById.mockReturnValue(chainable(null));
    await expect(getGuide({ params: { id: '1' } }, mockRes())).rejects.toThrow(ApiError);
  });
});

describe('guideController.getAlternativeActivities', () => {
  it('devuelve actividades alternativas con filtros', async () => {
    Guide.findById.mockReturnValue(chainable({ ciudad: { _id: 'city1' } }));
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

  it('lanza 404 si la guía no existe', async () => {
    Guide.findById.mockReturnValue(chainable(null));
    await expect(
      getAlternativeActivities({ params: { id: '1' }, query: {} }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});

describe('guideController.createGuide', () => {
  it('crea guía', async () => {
    const data = { titulo: 'X' };
    Guide.create.mockResolvedValue(data);
    const res = mockRes();
    await createGuide({ body: data }, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });
});

describe('guideController.updateGuide', () => {
  it('actualiza guía', async () => {
    const data = { titulo: 'U' };
    Guide.findByIdAndUpdate.mockResolvedValue(data);
    const res = mockRes();
    await updateGuide({ params: { id: '1' }, body: data }, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('lanza 404 si no existe', async () => {
    Guide.findByIdAndUpdate.mockResolvedValue(null);
    await expect(
      updateGuide({ params: { id: '1' }, body: {} }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});

describe('guideController.deleteGuide', () => {
  it('elimina guía', async () => {
    const deleteOne = jest.fn().mockResolvedValue();
    Guide.findById.mockResolvedValue({ deleteOne });
    const res = mockRes();
    await deleteGuide({ params: { id: '1' } }, res);
    expect(deleteOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true, message: 'Guía eliminada' });
  });

  it('lanza 404 si no existe', async () => {
    Guide.findById.mockResolvedValue(null);
    await expect(deleteGuide({ params: { id: '1' } }, mockRes())).rejects.toThrow(ApiError);
  });
});
