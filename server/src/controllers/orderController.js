import Order from '../models/Order.js';
import Guide from '../models/Guide.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createOrder } from '../services/orderService.js';
import { sendEmail } from '../services/emailService.js';

const emailWrapper = (content) => `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:#c41e3a;color:white;padding:24px;text-align:center;">
      <h1 style="margin:0;font-size:28px;letter-spacing:1px;">ChinaTravel</h1>
      <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">Descubre China con nosotros</p>
    </div>
    <div style="padding:30px 24px;background:#f9f9f9;">
      ${content}
    </div>
    <div style="padding:16px 24px;text-align:center;background:#1a1a2e;color:rgba(255,255,255,0.5);font-size:11px;">
      <p style="margin:0;">ChinaTravel &copy; ${new Date().getFullYear()} — Todos los derechos reservados</p>
      <p style="margin:4px 0 0;">Este es un email automatico, por favor no respondas.</p>
    </div>
  </div>
`;

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

  // Send cancellation email
  const usuario = await User.findById(order.usuario);
  if (usuario?.email) {
    const orderGuide = await Guide.findById(order.guia).populate('ciudad');
    const guideName = orderGuide?.titulo || 'tu circuito';
    const fecha = new Date(order.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    const precio = order.precioTotal ? `${order.precioTotal}\u20AC` : '';

    await sendEmail({
      to: usuario.email,
      subject: reembolsoCompleto
        ? 'Pedido cancelado - Reembolso procesado - ChinaTravel'
        : 'Pedido cancelado - ChinaTravel',
      html: emailWrapper(reembolsoCompleto
        ? `
          <div style="text-align:center;margin-bottom:24px;">
            <div style="width:64px;height:64px;background:#f0fdf4;color:#16a34a;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;">&#10003;</div>
          </div>
          <h2 style="color:#1a1a2e;margin-top:0;text-align:center;">Pedido cancelado y reembolsado</h2>
          <p>Hola <strong>${usuario.nombre}</strong>,</p>
          <p>Tu pedido ha sido cancelado correctamente. Al haberse realizado dentro de las primeras <strong>48 horas</strong>, se ha procesado el reembolso completo.</p>
          <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:20px 0;">
            <table style="width:100%;font-size:14px;color:#374151;">
              <tr><td style="padding:6px 0;color:#6b7280;">Circuito</td><td style="padding:6px 0;text-align:right;font-weight:600;">${guideName}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Fecha de compra</td><td style="padding:6px 0;text-align:right;">${fecha}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Importe reembolsado</td><td style="padding:6px 0;text-align:right;font-weight:700;color:#16a34a;">${precio}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Estado</td><td style="padding:6px 0;text-align:right;"><span style="background:#f0fdf4;color:#16a34a;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:600;">REEMBOLSADO</span></td></tr>
            </table>
          </div>
          <p style="color:#666;font-size:13px;">El reembolso se reflejara en tu cuenta en los proximos dias habiles.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" style="background:#c41e3a;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Ver mis pedidos</a>
          </div>
        `
        : `
          <div style="text-align:center;margin-bottom:24px;">
            <div style="width:64px;height:64px;background:#fffbeb;color:#d97706;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;">!</div>
          </div>
          <h2 style="color:#1a1a2e;margin-top:0;text-align:center;">Pedido cancelado</h2>
          <p>Hola <strong>${usuario.nombre}</strong>,</p>
          <p>Tu pedido ha sido cancelado. Segun nuestra politica de cancelacion, al haber transcurrido mas de <strong>48 horas</strong> desde la compra, <strong>no se aplica reembolso</strong>.</p>
          <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:20px 0;">
            <table style="width:100%;font-size:14px;color:#374151;">
              <tr><td style="padding:6px 0;color:#6b7280;">Circuito</td><td style="padding:6px 0;text-align:right;font-weight:600;">${guideName}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Fecha de compra</td><td style="padding:6px 0;text-align:right;">${fecha}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Importe</td><td style="padding:6px 0;text-align:right;font-weight:600;">${precio}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;">Estado</td><td style="padding:6px 0;text-align:right;"><span style="background:#fffbeb;color:#d97706;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:600;">CANCELADO</span></td></tr>
            </table>
          </div>
          <p style="color:#666;font-size:13px;">Si tienes alguna duda, no dudes en contactarnos.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/politica-cancelacion" style="background:#c41e3a;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Ver politica de cancelacion</a>
          </div>
        `
      ),
    });
  }

  res.json({
    ok: true,
    data: order,
    reembolso: reembolsoCompleto,
    mensaje: reembolsoCompleto
      ? 'Pedido cancelado con reembolso completo (dentro de 48h)'
      : 'Pedido cancelado. No se aplica reembolso (más de 48h desde la compra)',
  });
});

// Batch order - purchase multiple guides at once
export const placeBatchOrder = asyncHandler(async (req, res) => {
  const { items, hotelId, vueloId, cupon } = req.body;
  // items: [{ guiaId, actividadesPersonalizadas }]
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Debes incluir al menos un circuito');
  }

  // Validate coupon once if provided
  let couponData = null;
  if (cupon) {
    const couponDoc = await Coupon.findOne({ codigo: cupon, activo: true });
    if (couponDoc && couponDoc.usosActuales < couponDoc.usosMaximos) {
      couponData = couponDoc;
    }
  }

  const orders = [];
  for (const item of items) {
    const orderData = {
      guiaId: item.guiaId,
      actividadesPersonalizadas: item.actividadesPersonalizadas || {},
      hotelId: item.hotelId || hotelId || undefined,
      vueloId: item.vueloId || vueloId || undefined,
      precioTotal: item.precioTotal,
      descuento: 0,
      cupon: undefined,
    };
    const order = await createOrder(req.user, orderData);
    orders.push(order);
  }

  // Apply coupon discount to last order if valid
  if (couponData) {
    const totalBeforeDiscount = orders.reduce((s, o) => s + o.precioTotal, 0);
    let descuento = 0;
    if (couponData.tipo === 'PORCENTAJE') {
      descuento = Math.round(totalBeforeDiscount * couponData.valor / 100);
    } else {
      descuento = Math.min(couponData.valor, totalBeforeDiscount);
    }
    if (descuento > 0) {
      const lastOrder = orders[orders.length - 1];
      lastOrder.descuento = descuento;
      lastOrder.cupon = cupon;
      lastOrder.precioTotal = Math.max(0, lastOrder.precioTotal - descuento);
      await lastOrder.save();
      couponData.usosActuales += 1;
      await couponData.save();
    }
  }

  res.status(201).json({ ok: true, data: orders });
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
