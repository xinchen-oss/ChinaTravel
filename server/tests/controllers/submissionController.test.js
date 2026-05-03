import {
  createSubmission,
  getSubmissions,
  getMySubmissions,
  approveSubmission,
  rejectSubmission
} from '../controllers/submission.controller.js';

import Submission from '../models/Submission.js';
import Activity from '../models/Activity.js';
import Hotel from '../models/Hotel.js';
import Flight from '../models/Flight.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { SUBMISSION_STATUS } from '../utils/constants.js';
import { sendEmail } from '../services/emailService.js';

// 🔹 mocks
jest.mock('../models/Submission.js');
jest.mock('../models/Activity.js');
jest.mock('../models/Hotel.js');
jest.mock('../models/Flight.js');
jest.mock('../models/User.js');
jest.mock('../services/emailService.js');

const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('Submission Controller', () => {

  afterEach(() => jest.clearAllMocks());

  // 🔹 createSubmission
  describe('createSubmission', () => {

    it('should create submission and notify admins', async () => {
      const req = {
        user: { _id: 'user1', nombre: 'Test', email: 'test@test.com' },
        body: {
          tipoContenido: 'ACTIVIDAD',
          contenido: { nombre: 'Actividad 1' }
        }
      };
      const res = mockRes();

      const mockSubmission = { _id: 'sub1' };

      Submission.create.mockResolvedValue(mockSubmission);
      User.find.mockResolvedValue([{ email: 'admin@test.com' }]);

      await createSubmission(req, res);

      expect(Submission.create).toHaveBeenCalled();
      expect(User.find).toHaveBeenCalledWith({ role: 'ADMIN' });
      expect(sendEmail).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should parse contenido if string', async () => {
      const req = {
        user: { _id: 'user1' },
        body: {
          tipoContenido: 'HOTEL',
          contenido: JSON.stringify({ nombre: 'Hotel 1' })
        }
      };
      const res = mockRes();

      Submission.create.mockResolvedValue({});
      User.find.mockResolvedValue([]);

      await createSubmission(req, res);

      expect(Submission.create).toHaveBeenCalled();
    });

  });

  // 🔹 getSubmissions
  it('should return submissions with filter', async () => {
    const req = { query: { estado: 'PENDIENTE' } };
    const res = mockRes();

    const mockData = [{ _id: '1' }];

    Submission.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(mockData)
    });

    await getSubmissions(req, res);

    expect(Submission.find).toHaveBeenCalledWith({ estado: 'PENDIENTE' });
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: mockData
    });
  });

  // 🔹 getMySubmissions
  it('should return user submissions', async () => {
    const req = { user: { _id: 'user1' } };
    const res = mockRes();

    const mockData = [];

    Submission.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockData)
    });

    await getMySubmissions(req, res);

    expect(Submission.find).toHaveBeenCalledWith({ comercial: 'user1' });
  });

  // 🔹 approveSubmission
  describe('approveSubmission', () => {

    it('should approve and create ACTIVITY', async () => {
      const req = {
        params: { id: '1' },
        body: {}
      };
      const res = mockRes();

      const saveMock = jest.fn();

      Submission.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          estado: SUBMISSION_STATUS.PENDIENTE,
          tipoContenido: 'ACTIVIDAD',
          contenido: {},
          comercial: { _id: 'user1', email: 'test@test.com', nombre: 'Test' },
          save: saveMock
        })
      });

      await approveSubmission(req, res);

      expect(Activity.create).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalled();
      expect(saveMock).toHaveBeenCalled();
    });

    it('should approve and create HOTEL', async () => {
      const req = { params: { id: '1' }, body: {} };
      const res = mockRes();

      Submission.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          estado: SUBMISSION_STATUS.PENDIENTE,
          tipoContenido: 'HOTEL',
          contenido: {},
          comercial: { _id: 'user1', email: 'test@test.com', nombre: 'Test' },
          save: jest.fn()
        })
      });

      await approveSubmission(req, res);

      expect(Hotel.create).toHaveBeenCalled();
    });

    it('should throw if not pending', async () => {
      const req = { params: { id: '1' }, body: {} };
      const res = mockRes();

      Submission.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          estado: SUBMISSION_STATUS.APROBADO
        })
      });

      await expect(approveSubmission(req, res)).rejects.toThrow(ApiError);
    });

  });

  // 🔹 rejectSubmission
  describe('rejectSubmission', () => {

    it('should reject submission', async () => {
      const req = {
        params: { id: '1' },
        body: { comentario: 'Error' }
      };
      const res = mockRes();

      const saveMock = jest.fn();

      Submission.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          estado: SUBMISSION_STATUS.PENDIENTE,
          contenido: {},
          tipoContenido: 'HOTEL',
          comentarioAdmin: '',
          comercial: { email: 'test@test.com', nombre: 'Test' },
          save: saveMock
        })
      });

      await rejectSubmission(req, res);

      expect(saveMock).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalled();
    });

    it('should throw if not pending', async () => {
      const req = { params: { id: '1' }, body: {} };
      const res = mockRes();

      Submission.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          estado: SUBMISSION_STATUS.RECHAZADO
        })
      });

      await expect(rejectSubmission(req, res)).rejects.toThrow(ApiError);
    });

  });

});
