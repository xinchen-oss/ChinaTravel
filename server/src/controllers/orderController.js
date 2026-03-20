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
  if (order.usuario?._id?.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
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

// User requests cancellation — goes to admin for review
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Pedido no encontrado');
  if (order.usuario.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'No autorizado');
  }
  if (order.estado !== 'CONFIRMADO') {
    throw new ApiError(400, 'Solo se pueden cancelar pedidos confirmados');
  }

  order.estado = 'PENDIENTE_CANCELACION';
  order.motivoCancelacion = req.body.motivo || 'Cancelado por el usuario';
  await order.save();

  await Notification.create({
    usuario: order.usuario,
    tipo: 'PEDIDO',
    titulo: 'Solicitud de cancelación enviada',
    mensaje: 'Tu solicitud de cancelación ha sido enviada al administrador. Te notificaremos cuando sea revisada.',
    enlace: '/dashboard',
  });

  // Send email to all admins
  const admins = await User.find({ role: 'ADMIN' });
  const usuario = await User.findById(order.usuario);
  const orderGuide = await Guide.findById(order.guia).populate('ciudad');
  const guideName = orderGuide?.titulo || 'Circuito';
  const precio = order.precioTotal ? `${order.precioTotal}\u20AC` : '';

  const fecha = new Date(order.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  const horasDesdeCompra = Math.round((Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60));
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  for (const admin of admins) {
    if (admin.email) {
      await sendEmail({
        to: admin.email,
        subject: `⚠️ Solicitud de cancelación — ${usuario?.nombre || 'Usuario'} — ChinaTravel`,
        html: emailWrapper(`
          <div style="text-align:center;margin-bottom:28px;">
            <div style="width:72px;height:72px;background:linear-gradient(135deg,#fef3c7,#fde68a);color:#b45309;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:2.2rem;font-weight:700;box-shadow:0 4px 12px rgba(180,83,9,0.15);">⚠</div>
          </div>
          <h2 style="color:#1a1a2e;margin:0 0 8px;text-align:center;font-size:22px;">Nueva solicitud de cancelación</h2>
          <p style="text-align:center;color:#6b7280;margin:0 0 24px;font-size:14px;">Un usuario ha solicitado cancelar su pedido y necesita tu aprobación</p>

          <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin:0 0 20px;">
            <div style="background:#f8fafc;padding:14px 20px;border-bottom:1px solid #e5e7eb;">
              <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Datos del cliente</span>
            </div>
            <div style="padding:16px 20px;">
              <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#6b7280;width:40%;">Nombre</td>
                  <td style="padding:8px 0;text-align:right;font-weight:600;">${usuario?.nombre || 'Desconocido'} ${usuario?.apellidos || ''}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;border-top:1px solid #f3f4f6;">Email</td>
                  <td style="padding:8px 0;text-align:right;border-top:1px solid #f3f4f6;">
                    <a href="mailto:${usuario?.email}" style="color:#c41e3a;text-decoration:none;">${usuario?.email || '—'}</a>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin:0 0 20px;">
            <div style="background:#f8fafc;padding:14px 20px;border-bottom:1px solid #e5e7eb;">
              <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Detalles del pedido</span>
            </div>
            <div style="padding:16px 20px;">
              <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#6b7280;width:40%;">Circuito</td>
                  <td style="padding:8px 0;text-align:right;font-weight:600;">${guideName}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;border-top:1px solid #f3f4f6;">Ciudad</td>
                  <td style="padding:8px 0;text-align:right;border-top:1px solid #f3f4f6;">${orderGuide?.ciudad?.nombre || '—'}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;border-top:1px solid #f3f4f6;">Fecha de compra</td>
                  <td style="padding:8px 0;text-align:right;border-top:1px solid #f3f4f6;">${fecha}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;border-top:1px solid #f3f4f6;">Tiempo transcurrido</td>
                  <td style="padding:8px 0;text-align:right;border-top:1px solid #f3f4f6;">${horasDesdeCompra}h desde la compra</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;border-top:1px solid #f3f4f6;">Importe</td>
                  <td style="padding:8px 0;text-align:right;font-weight:700;font-size:18px;color:#1a1a2e;border-top:1px solid #f3f4f6;">${precio}</td>
                </tr>
              </table>
            </div>
          </div>

          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
            <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#92400e;">Motivo de cancelación</p>
            <p style="margin:0;font-size:14px;color:#78350f;line-height:1.5;">${order.motivoCancelacion}</p>
          </div>

          <div style="text-align:center;margin:28px 0 8px;">
            <a href="${clientUrl}/admin/pedidos" style="background:linear-gradient(135deg,#c41e3a,#a01830);color:white;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;box-shadow:0 4px 12px rgba(196,30,58,0.3);">Revisar y gestionar pedido</a>
          </div>
          <p style="text-align:center;color:#9ca3af;font-size:12px;margin:12px 0 0;">Accede al panel de administración para aprobar o rechazar esta solicitud</p>
        `),
      });
    }
  }

  res.json({
    ok: true,
    data: order,
    mensaje: 'Solicitud de cancelación enviada. El administrador revisará tu petición.',
  });
});

// Admin approves cancellation → refund
export const approveCancellation = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Pedido no encontrado');
  if (order.estado !== 'PENDIENTE_CANCELACION') {
    throw new ApiError(400, 'Este pedido no tiene una solicitud de cancelación pendiente');
  }

  order.estado = 'REEMBOLSADO';
  order.fechaCancelacion = new Date();
  await order.save();

  // If coupon was used, decrement usage
  if (order.cupon) {
    await Coupon.findOneAndUpdate({ codigo: order.cupon }, { $inc: { usosActuales: -1 } });
  }

  await Notification.create({
    usuario: order.usuario,
    tipo: 'PEDIDO',
    titulo: 'Cancelación aprobada — Reembolso procesado',
    mensaje: 'Tu solicitud de cancelación ha sido aprobada y se ha procesado el reembolso completo.',
    enlace: '/dashboard',
  });

  const usuario = await User.findById(order.usuario);
  const orderGuide = await Guide.findById(order.guia).populate('ciudad');
  const guideName = orderGuide?.titulo || 'tu circuito';
  const fecha = new Date(order.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  const precio = order.precioTotal ? `${order.precioTotal}\u20AC` : '';

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  if (usuario?.email) {
    await sendEmail({
      to: usuario.email,
      subject: '✅ Cancelación aprobada — Reembolso procesado - ChinaTravel',
      html: emailWrapper(`
        <div style="text-align:center;margin-bottom:28px;">
          <div style="width:72px;height:72px;background:linear-gradient(135deg,#d1fae5,#a7f3d0);color:#059669;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:2.2rem;font-weight:700;box-shadow:0 4px 12px rgba(5,150,105,0.15);">✓</div>
        </div>
        <h2 style="color:#1a1a2e;margin:0 0 8px;text-align:center;font-size:22px;">¡Cancelación aprobada!</h2>
        <p style="text-align:center;color:#6b7280;margin:0 0 28px;font-size:14px;">Tu reembolso ha sido procesado correctamente</p>

        <p style="font-size:15px;line-height:1.6;">Hola <strong>${usuario.nombre}</strong>,</p>
        <p style="font-size:15px;line-height:1.6;">Nos complace informarte de que tu solicitud de cancelación ha sido <strong style="color:#059669;">aprobada</strong>. Hemos procesado el reembolso completo del importe.</p>

        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin:24px 0;">
          <div style="background:#f0fdf4;padding:14px 20px;border-bottom:1px solid #d1fae5;">
            <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#065f46;">Resumen del reembolso</span>
          </div>
          <div style="padding:16px 20px;">
            <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;color:#6b7280;">Circuito</td>
                <td style="padding:10px 0;text-align:right;font-weight:600;">${guideName}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#6b7280;border-top:1px solid #f3f4f6;">Fecha de compra</td>
                <td style="padding:10px 0;text-align:right;border-top:1px solid #f3f4f6;">${fecha}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#6b7280;border-top:1px solid #f3f4f6;">Estado</td>
                <td style="padding:10px 0;text-align:right;border-top:1px solid #f3f4f6;">
                  <span style="background:#d1fae5;color:#059669;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;">REEMBOLSADO</span>
                </td>
              </tr>
              <tr style="border-top:2px solid #e5e7eb;">
                <td style="padding:14px 0;color:#374151;font-weight:700;font-size:16px;">Importe reembolsado</td>
                <td style="padding:14px 0;text-align:right;font-weight:800;font-size:22px;color:#059669;">${precio}</td>
              </tr>
            </table>
          </div>
        </div>

        <div style="background:#f0fdf4;border-left:4px solid #059669;border-radius:0 8px 8px 0;padding:14px 18px;margin:0 0 24px;">
          <p style="margin:0;font-size:13px;color:#065f46;line-height:1.5;">💰 El reembolso se reflejará en tu cuenta en los próximos <strong>3-5 días hábiles</strong>, dependiendo de tu entidad bancaria.</p>
        </div>

        <div style="text-align:center;margin:28px 0 8px;">
          <a href="${clientUrl}/dashboard" style="background:linear-gradient(135deg,#c41e3a,#a01830);color:white;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;box-shadow:0 4px 12px rgba(196,30,58,0.3);">Ver mis pedidos</a>
        </div>
        <p style="text-align:center;color:#9ca3af;font-size:12px;margin:12px 0 0;">¿Tienes alguna duda? Responde a este email y te ayudaremos</p>
      `),
    });
  }

  res.json({ ok: true, data: order });
});

// Admin rejects cancellation → back to confirmed
export const rejectCancellation = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Pedido no encontrado');
  if (order.estado !== 'PENDIENTE_CANCELACION') {
    throw new ApiError(400, 'Este pedido no tiene una solicitud de cancelación pendiente');
  }

  order.estado = 'CONFIRMADO';
  order.motivoCancelacion = '';
  await order.save();

  await Notification.create({
    usuario: order.usuario,
    tipo: 'PEDIDO',
    titulo: 'Solicitud de cancelación rechazada',
    mensaje: req.body.motivo || 'Tu solicitud de cancelación ha sido rechazada por el administrador.',
    enlace: '/dashboard',
  });

  const usuario = await User.findById(order.usuario);
  const orderGuide = await Guide.findById(order.guia).populate('ciudad');
  const guideName = orderGuide?.titulo || 'tu circuito';

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  if (usuario?.email) {
    await sendEmail({
      to: usuario.email,
      subject: 'Solicitud de cancelación rechazada - ChinaTravel',
      html: emailWrapper(`
        <div style="text-align:center;margin-bottom:28px;">
          <div style="width:72px;height:72px;background:linear-gradient(135deg,#fee2e2,#fecaca);color:#dc2626;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:2.2rem;font-weight:700;box-shadow:0 4px 12px rgba(220,38,38,0.15);">✗</div>
        </div>
        <h2 style="color:#1a1a2e;margin:0 0 8px;text-align:center;font-size:22px;">Solicitud de cancelación rechazada</h2>
        <p style="text-align:center;color:#6b7280;margin:0 0 28px;font-size:14px;">Tu pedido continúa activo</p>

        <p style="font-size:15px;line-height:1.6;">Hola <strong>${usuario.nombre}</strong>,</p>
        <p style="font-size:15px;line-height:1.6;">Lamentamos informarte de que tu solicitud de cancelación para el circuito <strong>${guideName}</strong> ha sido <strong style="color:#dc2626;">rechazada</strong> por nuestro equipo.</p>

        ${req.body.motivo ? `
        <div style="background:#fef2f2;border-left:4px solid #dc2626;border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#991b1b;">Motivo del rechazo</p>
          <p style="margin:0;font-size:14px;color:#7f1d1d;line-height:1.5;">${req.body.motivo}</p>
        </div>
        ` : ''}

        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin:24px 0;">
          <div style="background:#f8fafc;padding:14px 20px;border-bottom:1px solid #e5e7eb;">
            <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Estado de tu pedido</span>
          </div>
          <div style="padding:16px 20px;">
            <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;color:#6b7280;">Circuito</td>
                <td style="padding:10px 0;text-align:right;font-weight:600;">${guideName}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#6b7280;border-top:1px solid #f3f4f6;">Estado actual</td>
                <td style="padding:10px 0;text-align:right;border-top:1px solid #f3f4f6;">
                  <span style="background:#d1fae5;color:#059669;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;">CONFIRMADO</span>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;padding:14px 18px;margin:0 0 24px;">
          <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.5;">ℹ️ Tu pedido sigue activo y podrás disfrutar de tu viaje con normalidad. Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>

        <div style="text-align:center;margin:28px 0 8px;">
          <a href="${clientUrl}/dashboard" style="background:linear-gradient(135deg,#c41e3a,#a01830);color:white;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;box-shadow:0 4px 12px rgba(196,30,58,0.3);">Ver mis pedidos</a>
        </div>
        <p style="text-align:center;color:#9ca3af;font-size:12px;margin:12px 0 0;">¿Tienes alguna duda? Responde a este email y te ayudaremos</p>
      `),
    });
  }

  res.json({ ok: true, data: order });
});

// Admin: delete order
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Pedido no encontrado');
  await order.deleteOne();
  res.json({ ok: true, message: 'Pedido eliminado' });
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

// Recommendations based on user history, reviews, and preferences
export const getRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Get user's order history
  const userOrders = await Order.find({ usuario: userId }).populate('guia', 'ciudad duracionDias precio');
  const orderedGuideIds = userOrders.map((o) => o.guia?._id?.toString()).filter(Boolean);
  const orderedCityIds = [...new Set(userOrders.map((o) => o.guia?.ciudad?.toString()).filter(Boolean))];

  // 2. Get user's reviews to understand preferences
  const Review = (await import('../models/Review.js')).default;
  const userReviews = await Review.find({ usuario: userId, tipo: 'GUIA', estado: 'APROBADO' })
    .populate({ path: 'referencia', select: 'ciudad duracionDias precio', model: 'Guide' });

  // Build preference profile from high-rated guides (4-5 stars)
  const likedCityIds = [];
  let avgDuration = 0;
  let avgPrice = 0;
  let profileCount = 0;

  userReviews.forEach((r) => {
    if (r.puntuacion >= 4 && r.referencia) {
      likedCityIds.push(r.referencia.ciudad?.toString());
      avgDuration += r.referencia.duracionDias || 0;
      avgPrice += r.referencia.precio || 0;
      profileCount++;
    }
  });

  // Also factor in ordered guides for preference profile
  userOrders.forEach((o) => {
    if (o.guia) {
      avgDuration += o.guia.duracionDias || 0;
      avgPrice += o.guia.precio || 0;
      profileCount++;
    }
  });

  if (profileCount > 0) {
    avgDuration = Math.round(avgDuration / profileCount);
    avgPrice = Math.round(avgPrice / profileCount);
  }

  // 3. Get all available guides (exclude already ordered)
  const allGuides = await Guide.find({ _id: { $nin: orderedGuideIds } })
    .populate('ciudad', 'nombre');

  if (allGuides.length === 0) {
    return res.json({ ok: true, data: [] });
  }

  // 4. If user has history, score each guide by relevance
  if (profileCount > 0) {
    const favCities = [...new Set([...orderedCityIds, ...likedCityIds.filter(Boolean)])];

    const scored = allGuides.map((guide) => {
      let score = 0;
      const guideCityId = guide.ciudad?._id?.toString();

      // +3 points if same city as a liked/ordered guide (explore more of cities they love)
      if (favCities.includes(guideCityId)) score += 3;

      // +2 points if similar duration (within ±1 day)
      if (avgDuration > 0 && Math.abs(guide.duracionDias - avgDuration) <= 1) score += 2;

      // +1 point if similar price range (within ±30%)
      if (avgPrice > 0) {
        const priceDiff = Math.abs(guide.precio - avgPrice) / avgPrice;
        if (priceDiff <= 0.3) score += 1;
      }

      // +1 point for guides in NEW cities (discovery factor)
      if (!favCities.includes(guideCityId)) score += 1;

      // Small random factor to add variety between sessions
      score += Math.random() * 0.5;

      return { guide, score };
    });

    // Sort by score descending, take top 6
    scored.sort((a, b) => b.score - a.score);
    const recommended = scored.slice(0, 6).map((s) => s.guide);
    return res.json({ ok: true, data: recommended });
  }

  // 5. No history: recommend a diverse mix of popular cities
  // Pick one guide per city, shuffled, to maximize diversity
  const cityMap = {};
  allGuides.forEach((g) => {
    const cityId = g.ciudad?._id?.toString() || 'unknown';
    if (!cityMap[cityId]) cityMap[cityId] = [];
    cityMap[cityId].push(g);
  });

  const diverse = [];
  const cityKeys = Object.keys(cityMap).sort(() => Math.random() - 0.5);
  for (const cityId of cityKeys) {
    if (diverse.length >= 6) break;
    // Pick a random guide from this city
    const cityGuides = cityMap[cityId];
    diverse.push(cityGuides[Math.floor(Math.random() * cityGuides.length)]);
  }

  res.json({ ok: true, data: diverse });
});
