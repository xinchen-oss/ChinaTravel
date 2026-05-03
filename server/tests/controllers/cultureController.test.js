import {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle
} from '../controllers/cultureArticle.controller.js';

import CultureArticle from '../models/CultureArticle.js';
import ApiError from '../utils/ApiError.js';

// 🔹 Mock
jest.mock('../models/CultureArticle.js');

const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('CultureArticle Controller', () => {

  afterEach(() => jest.clearAllMocks());

  // 🔹 getArticles
  describe('getArticles', () => {
    it('should return filtered articles', async () => {
      const req = {
        query: { ciudad: '123', categoria: 'historia' }
      };
      const res = mockRes();

      const mockArticles = [{ titulo: 'Articulo 1' }];

      const sortMock = jest.fn().mockResolvedValue(mockArticles);
      const selectMock = jest.fn().mockReturnValue({ sort: sortMock });
      const populateMock = jest.fn().mockReturnValue({ select: selectMock });

      CultureArticle.find.mockReturnValue({
        populate: populateMock
      });

      await getArticles(req, res);

      expect(CultureArticle.find).toHaveBeenCalledWith({
        ciudad: '123',
        categoria: 'historia'
      });

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockArticles
      });
    });

    it('should return all articles without filters', async () => {
      const req = { query: {} };
      const res = mockRes();

      const mockArticles = [];

      const sortMock = jest.fn().mockResolvedValue(mockArticles);
      const selectMock = jest.fn().mockReturnValue({ sort: sortMock });
      const populateMock = jest.fn().mockReturnValue({ select: selectMock });

      CultureArticle.find.mockReturnValue({
        populate: populateMock
      });

      await getArticles(req, res);

      expect(CultureArticle.find).toHaveBeenCalledWith({});
    });
  });

  // 🔹 getArticle
  describe('getArticle', () => {
    it('should return one article', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      const mockArticle = { titulo: 'Articulo' };

      CultureArticle.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockArticle)
      });

      await getArticle(req, res);

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockArticle
      });
    });

    it('should throw error if not found', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      CultureArticle.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await expect(getArticle(req, res)).rejects.toThrow(ApiError);
    });
  });

  // 🔹 createArticle
  describe('createArticle', () => {
    it('should create article', async () => {
      const req = { body: { titulo: 'Nuevo' } };
      const res = mockRes();

      const mockArticle = { titulo: 'Nuevo' };

      CultureArticle.create.mockResolvedValue(mockArticle);

      await createArticle(req, res);

      expect(CultureArticle.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockArticle
      });
    });
  });

  // 🔹 updateArticle
  describe('updateArticle', () => {
    it('should update article', async () => {
      const req = {
        params: { id: '123' },
        body: { titulo: 'Updated' }
      };
      const res = mockRes();

      const mockArticle = { titulo: 'Updated' };

      CultureArticle.findByIdAndUpdate.mockResolvedValue(mockArticle);

      await updateArticle(req, res);

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockArticle
      });
    });

    it('should throw error if not found', async () => {
      const req = {
        params: { id: '123' },
        body: {}
      };
      const res = mockRes();

      CultureArticle.findByIdAndUpdate.mockResolvedValue(null);

      await expect(updateArticle(req, res)).rejects.toThrow(ApiError);
    });
  });

  // 🔹 deleteArticle
  describe('deleteArticle', () => {
    it('should delete article', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      const deleteOneMock = jest.fn().mockResolvedValue();

      CultureArticle.findById.mockResolvedValue({
        deleteOne: deleteOneMock
      });

      await deleteArticle(req, res);

      expect(deleteOneMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        message: 'Artículo eliminado'
      });
    });

    it('should throw error if not found', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      CultureArticle.findById.mockResolvedValue(null);

      await expect(deleteArticle(req, res)).rejects.toThrow(ApiError);
    });
  });

});
