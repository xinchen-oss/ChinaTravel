import {
  getFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight
} from '../controllers/flight.controller.js';

import Flight from '../models/Flight.js';
import ApiError from '../utils/ApiError.js';

// 🔹 Mock
jest.mock('../models/Flight.js');

const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('Flight Controller', () => {

  afterEach(() => jest.clearAllMocks());

  // 🔹 getFlights
  describe('getFlights', () => {

    it('should return flights with filter', async () => {
      const req = {
        query: { ciudad: '123' }
      };
      const res = mockRes();

      const mockFlights = [{ name: 'Vuelo 1' }];

      Flight.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockFlights)
      });

      await getFlights(req, res);

      expect(Flight.find).toHaveBeenCalledWith({
        isApproved: true,
        ciudadDestino: '123'
      });

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockFlights
      });
    });

    it('should return all approved flights without city filter', async () => {
      const req = { query: {} };
      const res = mockRes();

      const mockFlights = [];

      Flight.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockFlights)
      });

      await getFlights(req, res);

      expect(Flight.find).toHaveBeenCalledWith({
        isApproved: true
      });
    });

  });

  // 🔹 getFlight
  describe('getFlight', () => {

    it('should return one flight', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      const mockFlight = { name: 'Vuelo 1' };

      Flight.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockFlight)
      });

      await getFlight(req, res);

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockFlight
      });
    });

    it('should throw error if not found', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      Flight.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await expect(getFlight(req, res)).rejects.toThrow(ApiError);
    });

  });

  // 🔹 createFlight
  describe('createFlight', () => {

    it('should create flight', async () => {
      const req = { body: { name: 'Vuelo nuevo' } };
      const res = mockRes();

      const mockFlight = { name: 'Vuelo nuevo' };

      Flight.create.mockResolvedValue(mockFlight);

      await createFlight(req, res);

      expect(Flight.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockFlight
      });
    });

  });

  // 🔹 updateFlight
  describe('updateFlight', () => {

    it('should update flight', async () => {
      const req = {
        params: { id: '123' },
        body: { name: 'Updated' }
      };
      const res = mockRes();

      const mockFlight = { name: 'Updated' };

      Flight.findByIdAndUpdate.mockResolvedValue(mockFlight);

      await updateFlight(req, res);

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockFlight
      });
    });

    it('should throw error if not found', async () => {
      const req = {
        params: { id: '123' },
        body: {}
      };
      const res = mockRes();

      Flight.findByIdAndUpdate.mockResolvedValue(null);

      await expect(updateFlight(req, res)).rejects.toThrow(ApiError);
    });

  });

  // 🔹 deleteFlight
  describe('deleteFlight', () => {

    it('should delete flight', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      const deleteOneMock = jest.fn().mockResolvedValue();

      Flight.findById.mockResolvedValue({
        deleteOne: deleteOneMock
      });

      await deleteFlight(req, res);

      expect(deleteOneMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        message: 'Vuelo eliminado'
      });
    });

    it('should throw error if not found', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      Flight.findById.mockResolvedValue(null);

      await expect(deleteFlight(req, res)).rejects.toThrow(ApiError);
    });

  });

});
