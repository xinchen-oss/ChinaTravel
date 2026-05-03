import {
  getCities,
  getFeaturedCities,
  getCityBySlug,
  createCity,
  updateCity,
  deleteCity
} from '../controllers/city.controller.js';

import City from '../models/City.js';
import ApiError from '../utils/ApiError.js';

// 🔹 Mock del modelo
jest.mock('../models/City.js');

const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('City Controller', () => {

  afterEach(() => jest.clearAllMocks());

  // 🔹 getCities
  describe('getCities', () => {
    it('should return all cities sorted', async () => {
      const req = {};
      const res = mockRes();

      const mockCities = [{ nombre: 'Madrid' }];

      City.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockCities)
      });

      await getCities(req, res);

      expect(City.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockCities
      });
    });
  });

  // 🔹 getFeaturedCities
  describe('getFeaturedCities', () => {
    it('should return featured cities', async () => {
      const req = {};
      const res = mockRes();

      const mockCities = [{ nombre: 'Beijing', destacada: true }];

      City.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockCities)
      });

      await getFeaturedCities(req, res);

      expect(City.find).toHaveBeenCalledWith({ destacada: true });
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockCities
      });
    });
  });

  // 🔹 getCityBySlug
  describe('getCityBySlug', () => {
    it('should return a city by slug', async () => {
      const req = { params: { slug: 'madrid' } };
      const res = mockRes();

      const mockCity = { nombre: 'Madrid' };

      City.findOne.mockResolvedValue(mockCity);

      await getCityBySlug(req, res);

      expect(City.findOne).toHaveBeenCalledWith({ slug: 'madrid' });
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockCity
      });
    });

    it('should throw error if city not found', async () => {
      const req = { params: { slug: 'unknown' } };
      const res = mockRes();

      City.findOne.mockResolvedValue(null);

      await expect(getCityBySlug(req, res)).rejects.toThrow(ApiError);
    });
  });

  // 🔹 createCity
  describe('createCity', () => {
    it('should create a city', async () => {
      const req = { body: { nombre: 'Shanghai' } };
      const res = mockRes();

      const mockCity = { nombre: 'Shanghai' };

      City.create.mockResolvedValue(mockCity);

      await createCity(req, res);

      expect(City.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockCity
      });
    });
  });

  // 🔹 updateCity
  describe('updateCity', () => {
    it('should update a city', async () => {
      const req = {
        params: { id: '123' },
        body: { nombre: 'Updated' }
      };
      const res = mockRes();

      const mockCity = { nombre: 'Updated' };

      City.findByIdAndUpdate.mockResolvedValue(mockCity);

      await updateCity(req, res);

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockCity
      });
    });

    it('should throw error if city not found', async () => {
      const req = {
        params: { id: '123' },
        body: {}
      };
      const res = mockRes();

      City.findByIdAndUpdate.mockResolvedValue(null);

      await expect(updateCity(req, res)).rejects.toThrow(ApiError);
    });
  });

  // 🔹 deleteCity
  describe('deleteCity', () => {
    it('should delete a city', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      const deleteOneMock = jest.fn().mockResolvedValue();

      City.findById.mockResolvedValue({
        deleteOne: deleteOneMock
      });

      await deleteCity(req, res);

      expect(deleteOneMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        message: 'Ciudad eliminada'
      });
    });

    it('should throw error if city not found', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      City.findById.mockResolvedValue(null);

      await expect(deleteCity(req, res)).rejects.toThrow(ApiError);
    });
  });

});
