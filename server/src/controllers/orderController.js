import Order from '../models/Order.js';
import Guide from '../models/Guide.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createOrder } from '../services/orderService.js';

export const placeOrder = asyncHandler(async (req, res) => {
  const order = await createOrder(req.user, req.body);
  res.status(201).json({ ok: true, data: order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ usuario: req.user._id })
    .populate('guia', 'titulo ciudad duracionDias precio imagen')
    .populate('hotel', 'nombre estrellas precioPorNoche')
    .populate('vuelo', 'aerolinea origen destino precio')
    .sort('-createdAt');
  res.json({ ok: true, data: orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('guia')
    .populate('hotel')
    .populate('vuelo')
    .populate('usuario', 'nombre email');

  if (!order) throw new ApiError(404, 'Pedido no encontrado');
  if (order.usuario._id.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'No autorizado');
  }
  res.json({ ok: true, data: order });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('usuario', 'nombre email')
    .populate('guia', 'titulo precio')
    .sort('-createdAt');
  res.json({ ok: true, data: orders });
});

export const getTipsPdf = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Pedido no encontrado');
  if (order.usuario.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'No autorizado');
  }
  if (!order.tipsPdfUrl) throw new ApiError(404, 'PDF de tips no disponible');
  res.json({ ok: true, data: { url: order.tipsPdfUrl } });
});
