import {
  placeOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  approveCancellation,
  rejectCancellation,
  deleteOrder,
  placeBatchOrder
} from '../controllers/order.controller.js';

import Order from '../models/Order.js';
import User from '../models/User.js';
import Guide from '../models/Guide.js';
import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import { createOrder } from '../services/orderService.js';
import { sendEmail } from '../services/emailService.js';

// 🔹 mocks
jest.mock('../models/Order.js');
jest.mock('../models/User.js');
jest.mock('../models/Guide.js');
jest.mock('../models/Coupon.js');
jest.mock('../models/Notification.js');
jest.mock('../services/orderService.js');
jest.mock('../services/emailService.js');

const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('Order Controller', () => {

  afterEach(() => jest.clearAllMocks());

  // 🔹 placeOrder
  it('should create order', async () => {
    const req = {
      user: { _id: 'user1' },
      body: { guiaId: 'g1' }
    };
    const res = mockRes();

    const mockOrder = { _id: 'order1' };
    createOrder.mockResolvedValue(mockOrder);

    await placeOrder(req, res);

    expect(createOrder).toHaveBeenCalledWith(req.user, req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: mockOrder
    });
  });

  // 🔹 getMyOrders
  it('should return user orders', async () => {
    const req = { user: { _id: 'user1' } };
    const res = mockRes();

    const mockOrders = [{ _id: 'o1' }];

    Order.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(mockOrders)
    });

    await getMyOrders(req, res);

    expect(Order.find).toHaveBeenCalledWith({ usuario: 'user1' });
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: mockOrders
    });
  });

  // 🔹 getOrder
  describe('getOrder', () => {

    it('should return order if owner', async () => {
      const req = {
        params: { id: '1' },
        user: { _id: 'user1', role: 'USER' }
      };
      const res = mockRes();

      const mockOrder = {
        usuario: { _id: 'user1' }
      };

      Order.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockOrder)
      });

      await getOrder(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    it('should throw 403 if not owner', async () => {
      const req = {
        params: { id: '1' },
        user: { _id: 'user2', role: 'USER' }
      };
      const res = mockRes();

      const mockOrder = {
        usuario: { _id: 'user1' }
      };

      Order.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockOrder)
      });

      await expect(getOrder(req, res)).rejects.toThrow(ApiError);
    });

  });

  // 🔹 cancelOrder
  describe('cancelOrder', () => {

    it('should request cancellation', async () => {
      const req = {
        params: { id: '1' },
        user: { _id: 'user1' },
        body: { motivo: 'test' }
      };
      const res = mockRes();

      const saveMock = jest.fn();

      Order.findById.mockResolvedValue({
        usuario: 'user1',
        estado: 'CONFIRMADO',
        save: saveMock,
        createdAt: new Date()
      });

      User.find.mockResolvedValue([]);
      User.findById.mockResolvedValue({ nombre: 'Test' });
      Guide.findById.mockResolvedValue({ titulo: 'Guía' });

      await cancelOrder(req, res);

      expect(saveMock).toHaveBeenCalled();
      expect(Notification.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('should throw if not confirmed', async () => {
      const req = {
        params: { id: '1' },
        user: { _id: 'user1' },
        body: {}
      };
      const res = mockRes();

      Order.findById.mockResolvedValue({
        usuario: 'user1',
        estado: 'PENDIENTE'
      });

      await expect(cancelOrder(req, res)).rejects.toThrow(ApiError);
    });

  });

  // 🔹 approveCancellation
  describe('approveCancellation', () => {

    it('should approve cancellation', async () => {
      const req = { params: { id: '1' } };
      const res = mockRes();

      const saveMock = jest.fn();

      Order.findById.mockResolvedValue({
        estado: 'PENDIENTE_CANCELACION',
        save: saveMock,
        usuario: 'user1'
      });

      User.findById.mockResolvedValue({ email: 'test@test.com', nombre: 'Test' });
      Guide.findById.mockResolvedValue({ titulo: 'Guía' });

      await approveCancellation(req, res);

      expect(saveMock).toHaveBeenCalled();
      expect(Notification.create).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalled();
    });

  });

  // 🔹 rejectCancellation
  describe('rejectCancellation', () => {

    it('should reject cancellation', async () => {
      const req = {
        params: { id: '1' },
        body: { motivo: 'No permitido' }
      };
      const res = mockRes();

      const saveMock = jest.fn();

      Order.findById.mockResolvedValue({
        estado: 'PENDIENTE_CANCELACION',
        save: saveMock,
        usuario: 'user1'
      });

      User.findById.mockResolvedValue({ email: 'test@test.com', nombre: 'Test' });
      Guide.findById.mockResolvedValue({ titulo: 'Guía' });

      await rejectCancellation(req, res);

      expect(saveMock).toHaveBeenCalled();
      expect(Notification.create).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalled();
    });

  });

  // 🔹 deleteOrder
  it('should delete order', async () => {
    const req = { params: { id: '1' } };
    const res = mockRes();

    const deleteMock = jest.fn();

    Order.findById.mockResolvedValue({
      deleteOne: deleteMock
    });

    await deleteOrder(req, res);

    expect(deleteMock).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      message: 'Pedido eliminado'
    });
  });

  // 🔹 placeBatchOrder
  describe('placeBatchOrder', () => {

    it('should create multiple orders', async () => {
      const req = {
        user: { _id: 'user1' },
        body: {
          items: [{ guiaId: 'g1', precioTotal: 100 }]
        }
      };
      const res = mockRes();

      createOrder.mockResolvedValue({ precioTotal: 100 });

      await placeBatchOrder(req, res);

      expect(createOrder).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should throw if no items', async () => {
      const req = {
        user: { _id: 'user1' },
        body: { items: [] }
      };
      const res = mockRes();

      await expect(placeBatchOrder(req, res)).rejects.toThrow(ApiError);
    });

  });

});
