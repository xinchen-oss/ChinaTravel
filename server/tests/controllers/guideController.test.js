import {
  getGuides,
  getGuide,
  getAlternativeActivities,
  createGuide,
  updateGuide,
  deleteGuide
} from '../controllers/guide.controller.js';

import Guide from '../models/Guide.js';
import Activity from '../models/Activity.js';
import ApiError from '../utils/ApiError.js';

// 🔹 Mocks
jest.mock('../models/Guide.js');
jest.mock('../models/Activity.js');

const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('Guide Controller', () => {

  afterEach(() => jest.clearAllMocks());

  // 🔹 getGuides
  describe('getGuides', () => {

    it('should return guides with filter', async () => {
      const req = { query: { ciudad: '123' } };
      const res = mockRes();

      const mockGuides = [{ nombre: 'Guía 1' }];

      const selectMock = jest.fn().mockResolvedValue(mockGuides);
      const populateMock = jest.fn().mockReturnValue({ select: selectMock });

      Guide.find.mockReturnValue({
        populate: populateMock
      });

      await getGuides(req, res);

      expect(Guide.find).toHaveBeenCalledWith({ ciudad: '123' });

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockGuides
      });
    });

    it('should return all guides without filter', async () => {
      const req = { query: {} };
      const res = mockRes();

      const selectMock = jest.fn().mockResolvedValue([]);

      Guide.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({ select: selectMock })
      });

      await getGuides(req, res);

      expect(Guide.find).toHaveBeenCalledWith({});
    });

  });

  // 🔹 getGuide
  describe('getGuide', () => {

    it('should return one guide with nested populate', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      const mockGuide = { nombre: 'Guía completa' };

      const populateDeepMock = jest.fn().mockResolvedValue(mockGuide);
      const populateCiudadMock = jest.fn().mockReturnValue({
        populate: populateDeepMock
      });

      Guide.findById.mockReturnValue({
        populate: populateCiudadMock
      });

      await getGuide(req, res);

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockGuide
      });
    });

    it('should throw error if not found', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      Guide.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null)
        })
      });

      await expect(getGuide(req, res)).rejects.toThrow(ApiError);
    });

  });

  // 🔹 getAlternativeActivities
  describe('getAlternativeActivities', () => {

    it('should return alternative activities with filters', async () => {
      const req = {
        params: { id: '123' },
        query: {
          categoria: 'ocio',
          exclude: '1,2,3'
        }
      };
      const res = mockRes();

      const mockGuide = {
        ciudad: { _id: 'city123' }
      };

      const mockActivities = [{ nombre: 'Actividad' }];

      Guide.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockGuide)
      });

      Activity.find.mockResolvedValue(mockActivities);

      await getAlternativeActivities(req, res);

      expect(Activity.find).toHaveBeenCalledWith({
        ciudad: 'city123',
        isApproved: true,
        categoria: 'ocio',
        _id: { $nin: ['1', '2', '3'] }
      });

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockActivities
      });
    });

    it('should throw error if guide not found', async () => {
      const req = { params: { id: '123' }, query: {} };
      const res = mockRes();

      Guide.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await expect(getAlternativeActivities(req, res)).rejects.toThrow(ApiError);
    });

  });

  // 🔹 createGuide
  describe('createGuide', () => {

    it('should create guide', async () => {
      const req = { body: { nombre: 'Nueva guía' } };
      const res = mockRes();

      const mockGuide = { nombre: 'Nueva guía' };

      Guide.create.mockResolvedValue(mockGuide);

      await createGuide(req, res);

      expect(Guide.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockGuide
      });
    });

  });

  // 🔹 updateGuide
  describe('updateGuide', () => {

    it('should update guide', async () => {
      const req = {
        params: { id: '123' },
        body: { nombre: 'Updated' }
      };
      const res = mockRes();

      const mockGuide = { nombre: 'Updated' };

      Guide.findByIdAndUpdate.mockResolvedValue(mockGuide);

      await updateGuide(req, res);

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockGuide
      });
    });

    it('should throw error if not found', async () => {
      const req = { params: { id: '123' }, body: {} };
      const res = mockRes();

      Guide.findByIdAndUpdate.mockResolvedValue(null);

      await expect(updateGuide(req, res)).rejects.toThrow(ApiError);
    });

  });

  // 🔹 deleteGuide
  describe('deleteGuide', () => {

    it('should delete guide', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      const deleteOneMock = jest.fn().mockResolvedValue();

      Guide.findById.mockResolvedValue({
        deleteOne: deleteOneMock
      });

      await deleteGuide(req, res);

      expect(deleteOneMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        message: 'Guía eliminada'
      });
    });

    it('should throw error if not found', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      Guide.findById.mockResolvedValue(null);

      await expect(deleteGuide(req, res)).rejects.toThrow(ApiError);
    });

  });

});
