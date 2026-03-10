import Order from '../models/Order.js';
import Guide from '../models/Guide.js';
import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createOrder } from '../services/orderService.js';

export const placeOrder = asyncHandler(async (req, res) => {
  const order = await createOrder(req.user, req.body);
  res.status(201).json({ ok: true, data: order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ usuario: req.user._id })
    .populate({
      path: 'guia',
      select: 'titulo ciudad duracionDias precio imagen dias',
      populate: [
        { path: 'ciudad', select: 'nombre' },
        { path: 'dias.actividades.actividad', select: 'nombre descripcion categoria duracionHoras' },
      ],
    })
    .populate('hotel', 'nombre estrellas precioPorNoche')
    .populate('vuelo', 'aerolinea origen destino precio')
    .sort('-createdAt');
  res.json({ ok: true, data: orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: 'guia',
      populate: [
        { path: 'ciudad', select: 'nombre' },
        { path: 'dias.actividades.actividad' },
      ],
    })
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

// Cancel order
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Pedido no encontrado');
  if (order.usuario.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'No autorizado');
  }
  if (order.estado === 'CANCELADO' || order.estado === 'REEMBOLSADO') {
    throw new ApiError(400, 'Este pedido ya está cancelado');
  }

  // Check if within 48h for free cancellation
  const hoursElapsed = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60);
  const reembolsoCompleto = hoursElapsed <= 48;

  order.estado = reembolsoCompleto ? 'REEMBOLSADO' : 'CANCELADO';
  order.motivoCancelacion = req.body.motivo || 'Cancelado por el usuario';
  order.fechaCancelacion = new Date();
  await order.save();

  // If coupon was used, decrement usage
  if (order.cupon) {
    await Coupon.findOneAndUpdate({ codigo: order.cupon }, { $inc: { usosActuales: -1 } });
  }

  await Notification.create({
    usuario: order.usuario,
    tipo: 'PEDIDO',
    titulo: reembolsoCompleto ? 'Pedido reembolsado' : 'Pedido cancelado',
    mensaje: reembolsoCompleto
      ? 'Tu pedido ha sido cancelado y se ha procesado el reembolso completo.'
      : 'Tu pedido ha sido cancelado. Según nuestra política, no se aplica reembolso pasadas las 48h.',
    enlace: '/dashboard',
  });

  res.json({
    ok: true,
    data: order,
    reembolso: reembolsoCompleto,
    mensaje: reembolsoCompleto
      ? 'Pedido cancelado con reembolso completo (dentro de 48h)'
      : 'Pedido cancelado. No se aplica reembolso (más de 48h desde la compra)',
  });
});

// Recommendations based on user history
export const getRecommendations = asyncHandler(async (req, res) => {
  // Get user's ordered cities
  const userOrders = await Order.find({ usuario: req.user._id }).populate('guia', 'ciudad');
  const orderedGuideIds = userOrders.map((o) => o.guia?._id?.toString()).filter(Boolean);
  const orderedCityIds = userOrders.map((o) => o.guia?.ciudad?.toString()).filter(Boolean);

  let recommended;
  if (orderedCityIds.length > 0) {
    // Recommend guides from same cities (not already ordered) + other popular guides
    recommended = await Guide.find({
      _id: { $nin: orderedGuideIds },
    })
      .populate('ciudad', 'nombre')
      .sort('-createdAt')
      .limit(6);
  } else {
    // No history - return popular guides
    recommended = await Guide.find()
      .populate('ciudad', 'nombre')
      .sort('-createdAt')
      .limit(6);
  }

  res.json({ ok: true, data: recommended });
});
