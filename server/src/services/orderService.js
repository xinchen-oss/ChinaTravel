import Order from '../models/Order.js';
import Ruta from '../models/Ruta.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import { sendEmail, readFileAsBase64 } from './emailService.js';
import { generateTipsPdf, generateFacturaPdf } from './pdfService.js';
import { computeRutaPrice } from '../utils/helpers.js';
import config from '../config/env.js';
import path from 'path';

const hasStock = (activity) => Number(activity?.stock ?? 0) > 0;

const consumeStock = async (activityId, activityName = 'Actividad') => {
  const updated = await Activity.findOneAndUpdate(
    { _id: activityId, isActive: true, isApproved: true, stock: { $gt: 0 } },
    { $inc: { stock: -1 } },
    { new: true }
  );

  if (!updated) {
    throw new ApiError(400, `${activityName} esta agotada y no se puede comprar`);
  }

  return updated;
};

const notifyCommercialFreeSlot = async (ruta, activity) => {
  if (!ruta.creadoPor) return;

  await Notification.create({
    usuario: ruta.creadoPor,
    tipo: 'SISTEMA',
    titulo: 'Actividad agotada en una ruta',
    mensaje: `La actividad "${activity.nombre}" esta agotada. En la ruta "${ruta.titulo}" se dejara ese horario como tiempo libre.`,
    enlace: '/comercial/mis-publicaciones',
  });
};

const isAdminRuta = async (ruta) => {
  if (!ruta.creadoPor) return true;
  const creator = await User.findById(ruta.creadoPor).select('role');
  return creator?.role === 'ADMIN';
};

// Cualquier actividad con stock en la misma ciudad, sin filtrar por categoría.
const findReplacementActivity = async (activity, excludedIds = []) => {
  return Activity.findOne({
    _id: { $nin: [activity._id, ...excludedIds].filter(Boolean) },
    ciudad: activity.ciudad,
    isActive: true,
    isApproved: true,
    stock: { $gt: 0 },
  }).sort('-stock precio');
};

const POR_LIBRE = { esPorLibre: true, nombre: 'Actividad por libre', descripcion: 'Tiempo libre — organiza tu propia actividad.', precio: 0 };

const emailShell = (titulo, subtitulo, inner) => `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:#c41e3a;color:white;padding:24px;text-align:center;">
      <h1 style="margin:0;font-size:28px;letter-spacing:1px;">🇨🇳 ChinaTravel</h1>
      <p style="margin:6px 0 0;font-size:14px;opacity:0.9;">${subtitulo}</p>
    </div>
    <div style="padding:30px 24px;background:#f9f9f9;">
      ${inner}
    </div>
    <div style="padding:16px 24px;text-align:center;background:#1a1a2e;color:rgba(255,255,255,0.5);font-size:11px;">
      <p style="margin:0;">ChinaTravel &copy; ${new Date().getFullYear()} — Todos los derechos reservados</p>
      <p style="margin:4px 0 0;">Este email es tu comprobante de compra.</p>
    </div>
  </div>
`;

// ── Single activity ticket order ─────────────────────────────────────────────
const createActivityOrder = async (user, orderData) => {
  const { actividadId, fechaVisita, horaVisita } = orderData;
  const activity = await Activity.findById(actividadId).populate('ciudad', 'nombre');
  if (!activity) throw new ApiError(404, 'Actividad no encontrada');
  if (!activity.isActive || !activity.isApproved) throw new ApiError(400, 'Actividad no disponible');
  if (!hasStock(activity)) throw new ApiError(400, 'Actividad agotada');

  const precioTotal = orderData.precioTotal ?? activity.precio ?? 0;
  await consumeStock(activity._id, activity.nombre);

  const order = await Order.create({
    usuario: user._id,
    tipo: 'ACTIVIDAD',
    actividad: activity._id,
    fechaVisita: fechaVisita || undefined,
    horaVisita: horaVisita || undefined,
    precioTotal,
  });

  // Factura PDF (reuse the generic invoice with the activity as the concept).
  let facturaPdfPath = null;
  try {
    const facturaUrl = await generateFacturaPdf(order, {
      titulo: activity.nombre,
      ciudad: activity.ciudad,
      precio: activity.precio,
      duracionDias: null,
      dias: [],
    }, user);
    facturaPdfPath = path.join(process.cwd(), facturaUrl);
  } catch (err) {
    console.error('Error generando Factura PDF:', err.message);
  }

  const attachments = [];
  if (facturaPdfPath) {
    const base64 = readFileAsBase64(facturaPdfPath);
    if (base64) {
      attachments.push({
        content: base64,
        filename: `ChinaTravel-Factura-${order._id.toString().slice(-8).toUpperCase()}.pdf`,
        type: 'application/pdf',
      });
    }
  }

  const fechaCompra = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  const fechaVisitaStr = fechaVisita
    ? new Date(fechaVisita).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  await sendEmail({
    to: user.email,
    subject: '🎫 Confirmación de tu entrada - ChinaTravel',
    html: emailShell('Entrada confirmada', 'Confirmación de entrada', `
      <h2 style="color:#1a1a2e;margin-top:0;">¡Gracias por tu compra, ${user.nombre}! 🎫</h2>
      <p style="color:#444;">Tu entrada para <strong>${activity.nombre}</strong> está confirmada.</p>
      <div style="background:#ffffff;border-radius:10px;padding:20px;margin:20px 0;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px;">N° Pedido</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;text-align:right;">${order._id.toString().slice(-8).toUpperCase()}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px;">Atracción</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;text-align:right;">${activity.nombre}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px;">Ciudad</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${activity.ciudad?.nombre || ''}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px;">Fecha de visita</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${fechaVisitaStr}${horaVisita ? ` · ${horaVisita}` : ''}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px;">Fecha de compra</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${fechaCompra}</td></tr>
          <tr style="background:#c41e3a;"><td style="padding:12px 8px;color:white;font-weight:700;font-size:15px;border-radius:0 0 0 6px;">TOTAL</td><td style="padding:12px 8px;color:white;font-weight:700;font-size:18px;text-align:right;border-radius:0 0 6px 0;">${precioTotal}€</td></tr>
        </table>
      </div>
      <div style="text-align:center;margin:24px 0;">
        <a href="${config.clientUrl}/dashboard" style="background:#c41e3a;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Ver mi pedido</a>
      </div>
    `),
    attachments,
  });

  return order;
};

// ── Whole-ruta order ─────────────────────────────────────────────────────────
const createRutaOrder = async (user, orderData) => {
  const { rutaId, actividadesPersonalizadas } = orderData;

  const ruta = await Ruta.findById(rutaId)
    .populate('ciudad', 'nombre')
    .populate('dias.actividades.actividad');
  if (!ruta) throw new ApiError(404, 'Ruta no encontrada');
  const routeWasCreatedByAdmin = await isAdminRuta(ruta);

  // Build customized ruta snapshot (swaps + "actividad por libre").
  let rutaPersonalizada = null;
  let allActivities = [];
  const usedReplacementIds = [];

  if (actividadesPersonalizadas && Object.keys(actividadesPersonalizadas).length > 0) {
    rutaPersonalizada = JSON.parse(JSON.stringify(ruta.dias));
    for (const dia of rutaPersonalizada) {
      for (const slot of dia.actividades) {
        const actId = slot.actividad._id?.toString() || slot.actividad.toString();
        const custom = actividadesPersonalizadas[actId];
        if (custom === 'POR_LIBRE' || custom?.esPorLibre) {
          slot.actividad = { ...POR_LIBRE };
        } else if (custom) {
          const newAct = await Activity.findById(custom);
          if (newAct) slot.actividad = newAct;
        }
        allActivities.push(slot.actividad);
      }
    }
  } else {
    rutaPersonalizada = JSON.parse(JSON.stringify(ruta.dias));
    for (const dia of rutaPersonalizada) {
      for (const slot of dia.actividades) {
        allActivities.push(slot.actividad);
      }
    }
  }

  allActivities = [];
  for (const dia of rutaPersonalizada || []) {
    for (const slot of dia.actividades || []) {
      const current = slot.actividad;
      if (!current || current.esPorLibre) {
        allActivities.push(current);
        continue;
      }

      const activity = await Activity.findById(current._id || current).populate('ciudad', 'nombre');
      if (activity && !hasStock(activity)) {
        if (routeWasCreatedByAdmin) {
          const replacement = await findReplacementActivity(activity, usedReplacementIds);
          if (replacement) {
            usedReplacementIds.push(replacement._id);
            slot.actividad = replacement;
          } else {
            slot.actividad = { ...POR_LIBRE };
          }
        } else {
          await notifyCommercialFreeSlot(ruta, activity);
          slot.actividad = { ...POR_LIBRE };
        }
      } else if (activity) {
        slot.actividad = activity;
      }

      allActivities.push(slot.actividad);
    }
  }

  // Price is always the sum of the (possibly customized) ticket prices.
  const dias = rutaPersonalizada || ruta.dias;
  const precioTotal = computeRutaPrice(dias);

  const stockActivities = allActivities.filter((activity) => activity && !activity.esPorLibre);

  // Descontamos stock de forma secuencial, pero si algo falla a mitad de camino
  // (p.ej. otra compra concurrente agota una actividad justo en este instante),
  // devolvemos el stock ya descontado en este mismo intento para no dejar el
  // inventario inconsistente ni "vender" entradas sin pedido asociado.
  const consumedActivities = [];
  try {
    for (const activity of stockActivities) {
      const consumed = await consumeStock(activity._id || activity, activity.nombre);
      consumedActivities.push(consumed);
    }
  } catch (err) {
    await Promise.all(
      consumedActivities.map((act) => Activity.findByIdAndUpdate(act._id, { $inc: { stock: 1 } }))
    );
    throw err;
  }

  const order = await Order.create({
    usuario: user._id,
    tipo: 'RUTA',
    ruta: ruta._id,
    rutaPersonalizada,
    precioTotal,
  });

  // Generate both PDFs (tips only over real, ticketed activities).
  let tipsPdfPath = null;
  let facturaPdfPath = null;
  const ticketedActivities = allActivities.filter((a) => a && !a.esPorLibre);

  try {
    const tipsPdfUrl = await generateTipsPdf(order, ruta, ticketedActivities);
    order.tipsPdfUrl = tipsPdfUrl;
    await order.save();
    tipsPdfPath = path.join(process.cwd(), tipsPdfUrl);
  } catch (err) {
    console.error('Error generando Tips PDF:', err.message);
  }

  try {
    const facturaPdfUrl = await generateFacturaPdf(order, ruta, user);
    facturaPdfPath = path.join(process.cwd(), facturaPdfUrl);
  } catch (err) {
    console.error('Error generando Factura PDF:', err.message);
  }

  // Itinerary HTML for email.
  let itinerarioHtml = '';
  if (dias?.length) {
    itinerarioHtml = '<h3 style="color:#c41e3a;margin-top:20px;">Tu itinerario</h3>';
    for (const dia of dias) {
      itinerarioHtml += `<p style="margin:12px 0 4px;font-weight:600;color:#1a1a2e;">Día ${dia.numeroDia} — ${dia.titulo}</p>`;
      for (const slot of dia.actividades) {
        const act = slot.actividad;
        const nombre = act?.nombre || act?.toString() || '';
        const hora = slot.horaInicio ? `${slot.horaInicio} - ${slot.horaFin}` : '';
        itinerarioHtml += `<p style="margin:2px 0 2px 16px;font-size:13px;color:#555;">● ${hora ? `<span style="color:#c41e3a;font-weight:500;">${hora}</span> ` : ''}${nombre}</p>`;
      }
    }
  }

  const attachments = [];
  if (facturaPdfPath) {
    const base64 = readFileAsBase64(facturaPdfPath);
    if (base64) attachments.push({ content: base64, filename: `ChinaTravel-Factura-${order._id.toString().slice(-8).toUpperCase()}.pdf`, type: 'application/pdf' });
  }
  if (tipsPdfPath) {
    const base64 = readFileAsBase64(tipsPdfPath);
    if (base64) attachments.push({ content: base64, filename: `ChinaTravel-Tips-${ruta.titulo.replace(/\s+/g, '_')}.pdf`, type: 'application/pdf' });
  }

  const fecha = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

  await sendEmail({
    to: user.email,
    subject: `¡Gracias por tu compra! Confirmación de pedido - ChinaTravel`,
    html: emailShell('Confirmación', 'Confirmación de compra', `
      <h2 style="color:#1a1a2e;margin-top:0;">¡Gracias por tu compra, ${user.nombre}! 🎉</h2>
      <p style="color:#444;">Tu reserva ha sido confirmada. Estamos preparando todo para que disfrutes de una experiencia increíble en China.</p>
      <div style="background:#ffffff;border-radius:10px;padding:20px;margin:20px 0;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <h3 style="margin:0 0 12px;color:#1a1a2e;">Resumen de la factura</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px;">N° Pedido</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;text-align:right;">${order._id.toString().slice(-8).toUpperCase()}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px;">Fecha</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${fecha}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px;">Ruta</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;text-align:right;">${ruta.titulo}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px;">Ciudad</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${ruta.ciudad?.nombre || ''}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px;">Duración</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${ruta.duracionDias} días</td></tr>
          ${order.descuento > 0 ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#2e7d32;font-size:13px;">Descuento${order.cupon ? ` (${order.cupon})` : ''}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;color:#2e7d32;">-${order.descuento}€</td></tr>` : ''}
          <tr style="background:#c41e3a;"><td style="padding:12px 8px;color:white;font-weight:700;font-size:15px;border-radius:0 0 0 6px;">TOTAL</td><td style="padding:12px 8px;color:white;font-weight:700;font-size:18px;text-align:right;border-radius:0 0 6px 0;">${precioTotal}€</td></tr>
        </table>
      </div>
      ${itinerarioHtml}
      <div style="background:#e8f5e9;padding:16px;border-radius:8px;margin:20px 0;">
        <p style="margin:0;font-size:13px;color:#2e7d32;"><strong>📎 Archivos adjuntos:</strong><br>1. <strong>Factura</strong> — Tu comprobante de compra.<br>2. <strong>Tips de viaje</strong> — Consejos útiles para cada actividad de tu itinerario.</p>
      </div>
      <div style="text-align:center;margin:24px 0;">
        <a href="${config.clientUrl}/dashboard" style="background:#c41e3a;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Ver mi pedido</a>
      </div>
    `),
    attachments,
  });

  return order;
};

export const createOrder = async (user, orderData) => {
  if (orderData.tipo === 'ACTIVIDAD' || orderData.actividadId) {
    return createActivityOrder(user, orderData);
  }
  return createRutaOrder(user, orderData);
};