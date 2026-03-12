import Order from '../models/Order.js';
import Guide from '../models/Guide.js';
import Activity from '../models/Activity.js';
import ApiError from '../utils/ApiError.js';
import { sendEmail, readFileAsBase64 } from './emailService.js';
import { generateTipsPdf, generateFacturaPdf } from './pdfService.js';
import { formatPrice } from '../utils/helpers.js';
import config from '../config/env.js';
import path from 'path';

export const createOrder = async (user, orderData) => {
  const { guiaId, actividadesPersonalizadas, hotelId, vueloId } = orderData;

  const guide = await Guide.findById(guiaId)
    .populate('ciudad', 'nombre')
    .populate('dias.actividades.actividad');
  if (!guide) throw new ApiError(404, 'Guía no encontrada');

  // Build customized guide snapshot
  let guiaPersonalizada = null;
  let allActivities = [];

  if (actividadesPersonalizadas && Object.keys(actividadesPersonalizadas).length > 0) {
    guiaPersonalizada = JSON.parse(JSON.stringify(guide.dias));
    for (const dia of guiaPersonalizada) {
      for (const slot of dia.actividades) {
        const actId = slot.actividad._id?.toString() || slot.actividad.toString();
        if (actividadesPersonalizadas[actId]) {
          const newAct = await Activity.findById(actividadesPersonalizadas[actId]);
          if (newAct) slot.actividad = newAct;
        }
        allActivities.push(slot.actividad);
      }
    }
  } else {
    for (const dia of guide.dias) {
      for (const slot of dia.actividades) {
        allActivities.push(slot.actividad);
      }
    }
  }

  const precioTotal = orderData.precioTotal || guide.precio;

  const order = await Order.create({
    usuario: user._id,
    guia: guide._id,
    guiaPersonalizada,
    hotel: hotelId || undefined,
    vuelo: vueloId || undefined,
    precioTotal,
  });

  // Generate both PDFs
  let tipsPdfPath = null;
  let facturaPdfPath = null;

  try {
    const tipsPdfUrl = await generateTipsPdf(order, guide, allActivities);
    order.tipsPdfUrl = tipsPdfUrl;
    await order.save();
    tipsPdfPath = path.join(process.cwd(), tipsPdfUrl);
  } catch (err) {
    console.error('Error generando Tips PDF:', err.message);
  }

  try {
    const facturaPdfUrl = await generateFacturaPdf(order, guide, user);
    facturaPdfPath = path.join(process.cwd(), facturaPdfUrl);
  } catch (err) {
    console.error('Error generando Factura PDF:', err.message);
  }

  // Build itinerary HTML for email
  let itinerarioHtml = '';
  const dias = guiaPersonalizada || guide.dias;
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

  // Build attachments
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
  if (tipsPdfPath) {
    const base64 = readFileAsBase64(tipsPdfPath);
    if (base64) {
      attachments.push({
        content: base64,
        filename: `ChinaTravel-Tips-${guide.titulo.replace(/\s+/g, '_')}.pdf`,
        type: 'application/pdf',
      });
    }
  }

  const fecha = new Date().toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  // Send confirmation email with both PDFs
  await sendEmail({
    to: user.email,
    subject: `¡Gracias por tu compra! Confirmación de pedido - ChinaTravel`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
        <div style="background:#c41e3a;color:white;padding:24px;text-align:center;">
          <h1 style="margin:0;font-size:28px;letter-spacing:1px;">🇨🇳 ChinaTravel</h1>
          <p style="margin:6px 0 0;font-size:14px;opacity:0.9;">Confirmación de compra</p>
        </div>
        <div style="padding:30px 24px;background:#f9f9f9;">
          <h2 style="color:#1a1a2e;margin-top:0;">¡Gracias por tu compra, ${user.nombre}! 🎉</h2>
          <p style="color:#444;">Tu reserva ha sido confirmada. Estamos preparando todo para que disfrutes de una experiencia increíble en China.</p>

          <div style="background:#ffffff;border-radius:10px;padding:20px;margin:20px 0;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            <h3 style="margin:0 0 12px;color:#1a1a2e;">Resumen de la factura</h3>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px;">N° Pedido</td>
                <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;text-align:right;">${order._id.toString().slice(-8).toUpperCase()}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px;">Fecha</td>
                <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${fecha}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px;">Circuito</td>
                <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;text-align:right;">${guide.titulo}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px;">Ciudad</td>
                <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${guide.ciudad?.nombre || ''}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:13px;">Duración</td>
                <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${guide.duracionDias} días</td>
              </tr>
              ${order.descuento > 0 ? `
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #eee;color:#2e7d32;font-size:13px;">Descuento${order.cupon ? ` (${order.cupon})` : ''}</td>
                <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;color:#2e7d32;">-${order.descuento}€</td>
              </tr>
              ` : ''}
              <tr style="background:#c41e3a;">
                <td style="padding:12px 8px;color:white;font-weight:700;font-size:15px;border-radius:0 0 0 6px;">TOTAL</td>
                <td style="padding:12px 8px;color:white;font-weight:700;font-size:18px;text-align:right;border-radius:0 0 6px 0;">${precioTotal}€</td>
              </tr>
            </table>
          </div>

          ${itinerarioHtml}

          <div style="background:#e8f5e9;padding:16px;border-radius:8px;margin:20px 0;">
            <p style="margin:0;font-size:13px;color:#2e7d32;">
              <strong>📎 Archivos adjuntos:</strong><br>
              1. <strong>Factura</strong> — Tu comprobante de compra con todos los detalles.<br>
              2. <strong>Tips de viaje</strong> — Consejos útiles para cada actividad de tu itinerario.
            </p>
          </div>

          <div style="text-align:center;margin:24px 0;">
            <a href="${config.clientUrl}/dashboard" style="background:#c41e3a;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Ver mi pedido</a>
          </div>

          <p style="color:#888;font-size:12px;text-align:center;">
            ¿Tienes dudas? Visita nuestra sección de <a href="${config.clientUrl}/ayuda" style="color:#c41e3a;">Ayuda</a>.
          </p>
        </div>
        <div style="padding:16px 24px;text-align:center;background:#1a1a2e;color:rgba(255,255,255,0.5);font-size:11px;">
          <p style="margin:0;">ChinaTravel &copy; ${new Date().getFullYear()} — Todos los derechos reservados</p>
          <p style="margin:4px 0 0;">Este email es tu comprobante de compra.</p>
        </div>
      </div>
    `,
    attachments,
  });

  return order;
};
