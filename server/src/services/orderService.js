import Order from '../models/Order.js';
import Guide from '../models/Guide.js';
import Activity from '../models/Activity.js';
import ApiError from '../utils/ApiError.js';
import { sendEmail, readFileAsBase64 } from './emailService.js';
import { generateTipsPdf } from './pdfService.js';
import { formatPrice } from '../utils/helpers.js';
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

  // Generate tips PDF
  let pdfFilePath = null;
  try {
    const pdfUrl = await generateTipsPdf(order, guide, allActivities);
    order.tipsPdfUrl = pdfUrl;
    await order.save();
    pdfFilePath = path.join(process.cwd(), pdfUrl);
  } catch (err) {
    console.error('Error generando PDF:', err.message);
  }

  // Build itinerary HTML for email
  let itinerarioHtml = '';
  const dias = guiaPersonalizada || guide.dias;
  if (dias?.length) {
    itinerarioHtml = '<h2 style="color:#c41e3a;">Tu itinerario</h2>';
    for (const dia of dias) {
      itinerarioHtml += `<h3>Día ${dia.numeroDia} - ${dia.titulo}</h3><ul>`;
      for (const slot of dia.actividades) {
        const act = slot.actividad;
        const nombre = act?.nombre || act?.toString() || '';
        const hora = slot.horaInicio ? `${slot.horaInicio} - ${slot.horaFin}: ` : '';
        itinerarioHtml += `<li>${hora}${nombre}</li>`;
      }
      itinerarioHtml += '</ul>';
    }
  }

  // Build attachments
  const attachments = [];
  if (pdfFilePath) {
    const base64 = readFileAsBase64(pdfFilePath);
    if (base64) {
      attachments.push({
        content: base64,
        filename: `ChinaTravel-Tips-${guide.titulo.replace(/\s+/g, '_')}.pdf`,
        type: 'application/pdf',
      });
    }
  }

  // Send confirmation email (factura style)
  await sendEmail({
    to: user.email,
    subject: 'Factura y confirmación de pedido - ChinaTravel',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#c41e3a;color:white;padding:20px;text-align:center;">
          <h1 style="margin:0;">ChinaTravel</h1>
          <p style="margin:5px 0 0;">Factura de tu reserva</p>
        </div>
        <div style="padding:20px;background:#f9f9f9;">
          <h2>¡Gracias por tu compra, ${user.nombre}!</h2>
          <p>Tu pedido ha sido confirmado. A continuación los detalles de tu factura:</p>

          <table style="width:100%;border-collapse:collapse;margin:15px 0;">
            <tr style="background:#fff;">
              <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">N° Pedido</td>
              <td style="padding:10px;border:1px solid #ddd;">${order._id}</td>
            </tr>
            <tr style="background:#fff;">
              <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Guía</td>
              <td style="padding:10px;border:1px solid #ddd;">${guide.titulo}</td>
            </tr>
            <tr style="background:#fff;">
              <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Ciudad</td>
              <td style="padding:10px;border:1px solid #ddd;">${guide.ciudad.nombre}</td>
            </tr>
            <tr style="background:#fff;">
              <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Duración</td>
              <td style="padding:10px;border:1px solid #ddd;">${guide.duracionDias} días</td>
            </tr>
            <tr style="background:#c41e3a;color:white;">
              <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Total</td>
              <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">${precioTotal}€</td>
            </tr>
          </table>

          ${itinerarioHtml}

          <p style="margin-top:20px;padding:15px;background:#fff3cd;border-radius:5px;">
            Adjunto encontrarás un PDF con tips y consejos para tu viaje.
          </p>

          <p style="text-align:center;margin-top:20px;color:#666;font-size:12px;">
            ChinaTravel - Descubre China con nosotros<br>
            Este email es tu comprobante de compra (factura).
          </p>
        </div>
      </div>
    `,
    attachments,
  });

  return order;
};
