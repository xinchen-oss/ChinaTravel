import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { chainable, mockRes } from '../helpers/chain.js';

jest.unstable_mockModule('../../src/models/Order.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
  },
}));
jest.unstable_mockModule('../../src/models/User.js', () => ({
  default: { find: jest.fn(), findById: jest.fn() },
}));
jest.unstable_mockModule('../../src/models/Guide.js', () => ({
  default: { findById: jest.fn() },
}));
jest.unstable_mockModule('../../src/models/Coupon.js', () => ({
  default: { findOne: jest.fn(), findOneAndUpdate: jest.fn() },
}));
jest.unstable_mockModule('../../src/models/Notification.js', () => ({
  default: { create: jest.fn() },
}));
jest.unstable_mockModule('../../src/services/orderService.js', () => ({
  createOrder: jest.fn(),
}));
jest.unstable_mockModule('../../src/services/emailService.js', () => ({
  sendEmail: jest.fn(),
}));

const { default: Order } = await import('../../src/models/Order.js');
const { default: User } = await import('../../src/models/User.js');
const { default: Guide } = await import('../../src/models/Guide.js');
const { default: Notification } = await import('../../src/models/Notification.js');
const { createOrder } = await import('../../src/services/orderService.js');
const { default: ApiError } = await import('../../src/utils/ApiError.js');
const {
  placeOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  approveCancellation,
  deleteOrder,
  placeBatchOrder,
} = await import('../../src/controllers/orderController.js');

beforeEach(() => jest.clearAllMocks());

describe('orderController.placeOrder', () => {
  it('crea un pedido y devuelve 201', async () => {
    const order = { _id: 'o1' };
    createOrder.mockResolvedValue(order);
    const res = mockRes();
    await placeOrder({ user: { _id: 'u1' }, body: { guiaId: 'g1' } }, res);
    expect(createOrder).toHaveBeenCalledWith({ _id: 'u1' }, { guiaId: 'g1' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data: order });
  });
});

describe('orderController.getMyOrders', () => {
  it('devuelve los pedidos del usuario', async () => {
    const data = [{ _id: 'o1' }];
    Order.find.mockReturnValue(chainable(data));
    const res = mockRes();
    await getMyOrders({ user: { _id: 'u1' } }, res);
    expect(Order.find).toHaveBeenCalledWith({ usuario: 'u1' });
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });
});

describe('orderController.getOrder', () => {
  it('devuelve el pedido si el usuario es el dueño', async () => {
    const order = { usuario: { _id: 'u1' } };
    Order.findById.mockReturnValue(chainable(order));
    const res = mockRes();
    await getOrder({ params: { id: '1' }, user: { _id: 'u1', role: 'USER' } }, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data: order });
  });

  it('lanza 403 si no es el dueño y no es ADMIN', async () => {
    const order = { usuario: { _id: 'u1' } };
    Order.findById.mockReturnValue(chainable(order));
    await expect(
      getOrder({ params: { id: '1' }, user: { _id: 'u2', role: 'USER' } }, mockRes())
    ).rejects.toThrow(ApiError);
  });

  it('lanza 404 si no existe', async () => {
    Order.findById.mockReturnValue(chainable(null));
    await expect(
      getOrder({ params: { id: '1' }, user: { _id: 'u1', role: 'USER' } }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});

describe('orderController.cancelOrder', () => {
  it('marca PENDIENTE_CANCELACION cuando el pedido está CONFIRMADO', async () => {
    const order = {
      usuario: { toString: () => 'u1' },
      estado: 'CONFIRMADO',
      createdAt: new Date(),
      save: jest.fn().mockResolvedValue(),
    };
    Order.findById.mockResolvedValue(order);
    User.find.mockResolvedValue([]);
    User.findById.mockResolvedValue({ nombre: 'T' });
    Guide.findById.mockReturnValue(chainable({ titulo: 'G' }));

    const res = mockRes();
    await cancelOrder(
      { params: { id: '1' }, user: { _id: { toString: () => 'u1' } }, body: { motivo: 'x' } },
      res
    );
    expect(order.estado).toBe('PENDIENTE_CANCELACION');
    expect(order.save).toHaveBeenCalled();
    expect(Notification.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  it('lanza ApiError si el pedido no está CONFIRMADO', async () => {
    const order = { usuario: { toString: () => 'u1' }, estado: 'PENDIENTE' };
    Order.findById.mockResolvedValue(order);
    await expect(
      cancelOrder(
        { params: { id: '1' }, user: { _id: { toString: () => 'u1' } }, body: {} },
        mockRes()
      )
    ).rejects.toThrow(ApiError);
  });
});

describe('orderController.approveCancellation', () => {
  it('aprueba una cancelación pendiente', async () => {
    const order = {
      estado: 'PENDIENTE_CANCELACION',
      usuario: 'u1',
      save: jest.fn().mockResolvedValue(),
    };
    Order.findById.mockResolvedValue(order);
    User.findById.mockResolvedValue({ email: 'u@t.com', nombre: 'T' });
    Guide.findById.mockReturnValue(chainable({ titulo: 'G' }));
    const res = mockRes();
    await approveCancellation({ params: { id: '1' } }, res);
    expect(order.estado).toBe('REEMBOLSADO');
    expect(order.save).toHaveBeenCalled();
    expect(Notification.create).toHaveBeenCalled();
  });

  it('lanza si el pedido no está PENDIENTE_CANCELACION', async () => {
    Order.findById.mockResolvedValue({ estado: 'CONFIRMADO' });
    await expect(
      approveCancellation({ params: { id: '1' } }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});

describe('orderController.deleteOrder', () => {
  it('elimina pedido', async () => {
    const deleteOne = jest.fn().mockResolvedValue();
    Order.findById.mockResolvedValue({ deleteOne });
    const res = mockRes();
    await deleteOrder({ params: { id: '1' } }, res);
    expect(deleteOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true, message: 'Pedido eliminado' });
  });

  it('lanza 404 si no existe', async () => {
    Order.findById.mockResolvedValue(null);
    await expect(deleteOrder({ params: { id: '1' } }, mockRes())).rejects.toThrow(ApiError);
  });
});

describe('orderController.placeBatchOrder', () => {
  it('crea múltiples pedidos sin cupón', async () => {
    createOrder.mockResolvedValue({ precioTotal: 100, save: jest.fn(), descuento: 0 });
    const res = mockRes();
    await placeBatchOrder(
      { user: { _id: 'u1' }, body: { items: [{ guiaId: 'g1', precioTotal: 100 }] } },
      res
    );
    expect(createOrder).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('lanza si no hay items', async () => {
    await expect(
      placeBatchOrder({ user: { _id: 'u1' }, body: { items: [] } }, mockRes())
    ).rejects.toThrow(ApiError);
  });
});
