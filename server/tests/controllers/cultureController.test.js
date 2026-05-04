import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { chainable, mockRes } from '../helpers/chain.js';

jest.unstable_mockModule('../../src/models/CultureArticle.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
  },
}));

const { default: CultureArticle } = await import('../../src/models/CultureArticle.js');
const { default: ApiError } = await import('../../src/utils/ApiError.js');
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} = await import('../../src/controllers/cultureController.js');

beforeEach(() => jest.clearAllMocks());

describe('cultureController.getArticles', () => {
  it('aplica filtros ciudad y categoria', async () => {
    const data = [{ titulo: 'A' }];
    CultureArticle.find.mockReturnValue(chainable(data));
    const res = mockRes();
    await getArticles({ query: { ciudad: '123', categoria: 'HISTORIA' } }, res);
    expect(CultureArticle.find).toHaveBeenCalledWith({ ciudad: '123', categoria: 'HISTORIA' });
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('sin filtros', async () => {
    CultureArticle.find.mockReturnValue(chainable([]));
    await getArticles({ query: {} }, mockRes());
    expect(CultureArticle.find).toHaveBeenCalledWith({});
  });
});

describe('cultureController.getArticle', () => {
  it('devuelve un artículo', async () => {
    const data = { titulo: 'A' };
    CultureArticle.findById.mockReturnValue(chainable(data));
    const res = mockRes();
    await getArticle({ params: { id: '1' } }, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('lanza 404 si no existe', async () => {
    CultureArticle.findById.mockReturnValue(chainable(null));
    await expect(getArticle({ params: { id: '1' } }, mockRes())).rejects.toThrow(ApiError);
  });
});

describe('cultureController.createArticle', () => {
  it('crea artículo', async () => {
    const data = { titulo: 'N' };
    CultureArticle.create.mockResolvedValue(data);
    const res = mockRes();
    await createArticle({ body: data }, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });
});

describe('cultureController.updateArticle', () => {
  it('actualiza artículo', async () => {
    const data = { titulo: 'U' };
    CultureArticle.findByIdAndUpdate.mockResolvedValue(data);
    const res = mockRes();
    await updateArticle({ params: { id: '1' }, body: data }, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('lanza 404 si no existe', async () => {
    CultureArticle.findByIdAndUpdate.mockResolvedValue(null);
    await expect(
      updateArticle({ params: { id: '1' }, body: {} }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});

describe('cultureController.deleteArticle', () => {
  it('elimina artículo', async () => {
    const deleteOne = jest.fn().mockResolvedValue();
    CultureArticle.findById.mockResolvedValue({ deleteOne });
    const res = mockRes();
    await deleteArticle({ params: { id: '1' } }, res);
    expect(deleteOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true, message: 'Artículo eliminado' });
  });

  it('lanza 404 si no existe', async () => {
    CultureArticle.findById.mockResolvedValue(null);
    await expect(deleteArticle({ params: { id: '1' } }, mockRes())).rejects.toThrow(ApiError);
  });
});
