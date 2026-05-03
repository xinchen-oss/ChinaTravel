import {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel
} from '../controllers/hotel.controller.js';

import Hotel from '../models/Hotel.js';
import ApiError from '../utils/ApiError.js';

// 🔹 Mock
jest.mock('../models/Hotel.js');

const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('Hotel Controller', () => {

  afterEach(() => jest.clearAllMocks());

  // 🔹 getHotels
  describe('getHotels', () => {

    it('should return hotels with filter', async () => {
      const req = {
        query: { ciudad: '123' }
      };
      const res = mockRes();

      const mockHotels = [{ nombre: 'Hotel 1' }];

      Hotel.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockHotels)
      });

      await getHotels(req, res);

      expect(Hotel.find).toHaveBeenCalledWith({
        isApproved: true,
        ciudad: '123'
      });

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockHotels
      });
    });

    it('should return all approved hotels without city filter', async () => {
      const req = { query: {} };
      const res = mockRes();

      const mockHotels = [];

      Hotel.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockHotels)
      });

      await getHotels(req, res);

      expect(Hotel.find).toHaveBeenCalledWith({
        isApproved: true
      });
    });

  });

  // 🔹 getHotel
  describe('getHotel', () => {

    it('should return one hotel', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      const mockHotel = { nombre: 'Hotel 1' };

      Hotel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockHotel)
      });

      await getHotel(req, res);

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockHotel
      });
    });

    it('should throw error if not found', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      Hotel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await expect(getHotel(req, res)).rejects.toThrow(ApiError);
    });

  });

  // 🔹 createHotel
  describe('createHotel', () => {

    it('should create hotel', async () => {
      const req = { body: { nombre: 'Nuevo Hotel' } };
      const res = mockRes();

      const mockHotel = { nombre: 'Nuevo Hotel' };

      Hotel.create.mockResolvedValue(mockHotel);

      await createHotel(req, res);

      expect(Hotel.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockHotel
      });
    });

  });

  // 🔹 updateHotel
  describe('updateHotel', () => {

    it('should update hotel', async () => {
      const req = {
        params: { id: '123' },
        body: { nombre: 'Updated' }
      };
      const res = mockRes();

      const mockHotel = { nombre: 'Updated' };

      Hotel.findByIdAndUpdate.mockResolvedValue(mockHotel);

      await updateHotel(req, res);

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockHotel
      });
    });

    it('should throw error if not found', async () => {
      const req = {
        params: { id: '123' },
        body: {}
      };
      const res = mockRes();

      Hotel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(updateHotel(req, res)).rejects.toThrow(ApiError);
    });

  });

  // 🔹 deleteHotel
  describe('deleteHotel', () => {

    it('should delete hotel', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      const deleteOneMock = jest.fn().mockResolvedValue();

      Hotel.findById.mockResolvedValue({
        deleteOne: deleteOneMock
      });

      await deleteHotel(req, res);

      expect(deleteOneMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        message: 'Hotel eliminado'
      });
    });

    it('should throw error if not found', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      Hotel.findById.mockResolvedValue(null);

      await expect(deleteHotel(req, res)).rejects.toThrow(ApiError);
    });

  });

});
