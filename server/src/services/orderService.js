import Order from '../models/Order.js';
import Guide from '../models/Guide.js';
import Activity from '../models/Activity.js';
import ApiError from '../utils/ApiError.js';
import { sendEmail } from './emailService.js';
import { generateTipsPdf } from './pdfService.js';

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
  try {
    const pdfUrl = await generateTipsPdf(order, guide, allActivities);
    order.tipsPdfUrl = pdfUrl;
    await order.save();
  } catch (err) {
    console.error('Error generando PDF:', err.message);
  }

  // Send confirmation email
  await sendEmail({
    to: user.email,
    subject: 'Confirmación de pedido - ChinaTravel',
    html: `
      <h1>¡Gracias por tu compra, ${user.nombre}!</h1>
      <p>Tu pedido ha sido confirmado:</p>
      <ul>
        <li><strong>Guía:</strong> ${guide.titulo}</li>
        <li><strong>Ciudad:</strong> ${guide.ciudad.nombre}</li>
        <li><strong>Duración:</strong> ${guide.duracionDias} días</li>
        <li><strong>Total:</strong> ${precioTotal}€</li>
      </ul>
      <p>Puedes descargar tu PDF de tips desde tu panel de usuario.</p>
    `,
  });

  return order;
};
