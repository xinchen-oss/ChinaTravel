import {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity
} from '../controllers/activity.controller.js';

import Activity from '../models/Activity.js';
import ApiError from '../utils/ApiError.js';

// Mock del modelo
jest.mock('../models/Activity.js');

const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('Activity Controller', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 🔹 getActivities
  describe('getActivities', () => {
    it('should return activities with filters', async () => {
      const req = {
        query: { ciudad: 'Madrid', categoria: 'Ocio' }
      };
      const res = mockRes();

      const mockActivities = [{ name: 'Act1' }];

      Activity.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockActivities)
      });

      await getActivities(req, res);

      expect(Activity.find).toHaveBeenCalledWith({
        isApproved: true,
        ciudad: 'Madrid',
        categoria: 'Ocio'
      });

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockActivities
      });
    });
  });

  // 🔹 getActivity
  describe('getActivity', () => {
    it('should return one activity', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      const mockActivity = { name: 'Act1' };

      Activity.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockActivity)
      });

      await getActivity(req, res);

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockActivity
      });
    });

    it('should throw error if activity not found', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      Activity.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await expect(getActivity(req, res)).rejects.toThrow(ApiError);
    });
  });

  // 🔹 createActivity
  describe('createActivity', () => {
    it('should create an activity', async () => {
      const req = { body: { name: 'New Activity' } };
      const res = mockRes();

      const mockActivity = { name: 'New Activity' };

      Activity.create.mockResolvedValue(mockActivity);

      await createActivity(req, res);

      expect(Activity.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockActivity
      });
    });
  });

  // 🔹 updateActivity
  describe('updateActivity', () => {
    it('should update an activity', async () => {
      const req = {
        params: { id: '123' },
        body: { name: 'Updated' }
      };
      const res = mockRes();

      const mockActivity = { name: 'Updated' };

      Activity.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockActivity)
      });

      await updateActivity(req, res);

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockActivity
      });
    });

    it('should throw error if activity not found', async () => {
      const req = {
        params: { id: '123' },
        body: {}
      };
      const res = mockRes();

      Activity.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await expect(updateActivity(req, res)).rejects.toThrow(ApiError);
    });
  });

  // 🔹 deleteActivity
  describe('deleteActivity', () => {
    it('should delete an activity', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      const deleteOneMock = jest.fn().mockResolvedValue();

      Activity.findById.mockResolvedValue({
        deleteOne: deleteOneMock
      });

      await deleteActivity(req, res);

      expect(deleteOneMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        message: 'Actividad eliminada'
      });
    });

    it('should throw error if activity not found', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      Activity.findById.mockResolvedValue(null);

      await expect(deleteActivity(req, res)).rejects.toThrow(ApiError);
    });
  });

});
