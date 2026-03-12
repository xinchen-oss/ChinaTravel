import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

// Ensure uploads dir exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const generateTipsPdf = async (order, guide, activities) => {
  return new Promise((resolve, reject) => {
    const filename = `tips-${order._id}.pdf`;
    const filepath = path.join(uploadsDir, filename);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);

    // Header bar
    doc.rect(0, 0, doc.page.width, 80).fill('#c41e3a');
    doc.fontSize(26).fillColor('#ffffff').text('ChinaTravel', 50, 25, { align: 'center' });
    doc.fontSize(12).text('Tips y Consejos de Viaje', 50, 55, { align: 'center' });

    doc.moveDown(3);
    doc.fillColor('#1a1a2e');

    // Guide info
    doc.fontSize(20).text(guide.titulo, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#666666').text(`Duración: ${guide.duracionDias} días | Ciudad: ${guide.ciudad?.nombre || ''}`, { align: 'center' });
    doc.moveDown(1.5);

    // Divider
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#e0e0e0');
    doc.moveDown(1);

    // Tips per activity
    doc.fontSize(16).fillColor('#c41e3a').text('Consejos por actividad');
    doc.moveDown(0.8);

    for (const activity of activities) {
      if (doc.y > doc.page.height - 120) doc.addPage();

      doc.fontSize(13).fillColor('#1a1a2e').text(`● ${activity.nombre}`, { continued: false });
      doc.fontSize(10).fillColor('#999999').text(`  Categoría: ${activity.categoria} | Duración: ${activity.duracionHoras}h`);

      if (activity.consejos && activity.consejos.length > 0) {
        activity.consejos.forEach((tip) => {
          doc.fontSize(11).fillColor('#444444').text(`    → ${tip}`);
        });
      } else {
        doc.fontSize(11).fillColor('#999999').text('    Sin consejos específicos disponibles.');
      }
      doc.moveDown(0.6);
    }

    // General tips section
    doc.moveDown(1);
    if (doc.y > doc.page.height - 200) doc.addPage();

    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#e0e0e0');
    doc.moveDown(1);
    doc.fontSize(16).fillColor('#c41e3a').text('Consejos generales para viajar a China');
    doc.moveDown(0.6);

    const generalTips = [
      'Descarga una app de traducción offline antes de viajar (ej: Google Translate con paquete chino).',
      'Lleva efectivo en yuan (CNY), muchas tiendas pequeñas no aceptan tarjetas extranjeras.',
      'Ten siempre contigo una copia de tu pasaporte y visado.',
      'Descarga una VPN antes de llegar si necesitas acceder a Google, WhatsApp, etc.',
      'El agua del grifo no es potable, compra agua embotellada.',
      'Aprende algunas frases básicas en mandarín: 你好 (nǐ hǎo - hola), 谢谢 (xiè xie - gracias).',
      'Respeta las costumbres locales: no señalar con el dedo, no clavar los palillos verticalmente en el arroz.',
      'El horario comercial suele ser de 10:00 a 22:00. Los mercados abren más temprano.',
    ];

    generalTips.forEach((tip) => {
      if (doc.y > doc.page.height - 60) doc.addPage();
      doc.fontSize(11).fillColor('#444444').text(`  ✓ ${tip}`);
      doc.moveDown(0.3);
    });

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).fillColor('#999999').text(`Generado por ChinaTravel — ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });
    doc.fontSize(10).text('¡Buen viaje! 祝你旅途愉快!', { align: 'center' });

    doc.end();
    stream.on('finish', () => resolve(`/uploads/${filename}`));
    stream.on('error', reject);
  });
};

export const generateFacturaPdf = async (order, guide, user) => {
  return new Promise((resolve, reject) => {
    const filename = `factura-${order._id}.pdf`;
    const filepath = path.join(uploadsDir, filename);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);

    // Header bar
    doc.rect(0, 0, doc.page.width, 80).fill('#c41e3a');
    doc.fontSize(26).fillColor('#ffffff').text('ChinaTravel', 50, 20, { align: 'center' });
    doc.fontSize(14).text('FACTURA', 50, 52, { align: 'center' });

    doc.moveDown(3);
    doc.fillColor('#1a1a2e');

    // Invoice info row
    const fecha = new Date(order.createdAt || Date.now()).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'long', year: 'numeric'
    });

    doc.fontSize(11).fillColor('#666666');
    doc.text(`Factura N°: ${order._id.toString().slice(-8).toUpperCase()}`, 50);
    doc.text(`Fecha: ${fecha}`);
    doc.text(`Estado: CONFIRMADO`);
    doc.moveDown(1);

    // Divider
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#e0e0e0');
    doc.moveDown(0.8);

    // Client info
    doc.fontSize(14).fillColor('#1a1a2e').text('Datos del cliente');
    doc.moveDown(0.4);
    doc.fontSize(11).fillColor('#444444');
    doc.text(`Nombre: ${user.nombre} ${user.apellidos || ''}`);
    doc.text(`Email: ${user.email}`);
    if (user.telefono) doc.text(`Teléfono: ${user.telefono}`);
    if (user.direccion?.calle) {
      doc.text(`Dirección: ${user.direccion.calle}, ${user.direccion.ciudad || ''} ${user.direccion.codigoPostal || ''}, ${user.direccion.pais || ''}`);
    }
    doc.moveDown(1);

    // Divider
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#e0e0e0');
    doc.moveDown(0.8);

    // Product table header
    doc.fontSize(14).fillColor('#1a1a2e').text('Detalle de la compra');
    doc.moveDown(0.6);

    const tableTop = doc.y;
    const col1 = 50;
    const col2 = 300;
    const col3 = 420;

    // Table header
    doc.rect(col1, tableTop, doc.page.width - 100, 24).fill('#f0f0f0');
    doc.fontSize(10).fillColor('#1a1a2e');
    doc.text('Concepto', col1 + 8, tableTop + 7, { width: 240 });
    doc.text('Detalle', col2 + 8, tableTop + 7, { width: 110 });
    doc.text('Precio', col3 + 8, tableTop + 7, { width: 80 });

    // Table rows
    let rowY = tableTop + 28;

    // Guide row
    doc.fontSize(10).fillColor('#444444');
    doc.text(`Circuito: ${guide.titulo}`, col1 + 8, rowY, { width: 240 });
    doc.text(`${guide.duracionDias} días`, col2 + 8, rowY, { width: 110 });
    doc.text(`${guide.precio}€`, col3 + 8, rowY, { width: 80 });
    rowY += 22;

    doc.moveTo(col1, rowY).lineTo(doc.page.width - 50, rowY).stroke('#e0e0e0');
    rowY += 4;

    // City
    if (guide.ciudad?.nombre) {
      doc.text(`Ciudad: ${guide.ciudad.nombre}`, col1 + 8, rowY, { width: 240 });
      rowY += 22;
      doc.moveTo(col1, rowY).lineTo(doc.page.width - 50, rowY).stroke('#e0e0e0');
      rowY += 4;
    }

    // Discount
    if (order.descuento > 0) {
      doc.fillColor('#2e7d32');
      doc.text('Descuento aplicado', col1 + 8, rowY, { width: 240 });
      if (order.cupon) doc.text(`Cupón: ${order.cupon}`, col2 + 8, rowY, { width: 110 });
      doc.text(`-${order.descuento}€`, col3 + 8, rowY, { width: 80 });
      rowY += 22;
      doc.moveTo(col1, rowY).lineTo(doc.page.width - 50, rowY).stroke('#e0e0e0');
      rowY += 4;
    }

    // Total
    rowY += 6;
    doc.rect(col1, rowY, doc.page.width - 100, 30).fill('#c41e3a');
    doc.fontSize(13).fillColor('#ffffff');
    doc.text('TOTAL', col1 + 8, rowY + 8, { width: 240 });
    doc.text(`${order.precioTotal}€`, col3 + 8, rowY + 8, { width: 80 });

    // Itinerary summary
    doc.moveDown(4);
    const dias = order.guiaPersonalizada || guide.dias;
    if (dias?.length) {
      const itinY = rowY + 50;
      doc.fontSize(14).fillColor('#1a1a2e').text('Resumen del itinerario', col1, itinY);
      doc.moveDown(0.5);

      for (const dia of dias) {
        if (doc.y > doc.page.height - 80) doc.addPage();
        doc.fontSize(11).fillColor('#c41e3a').text(`Día ${dia.numeroDia} — ${dia.titulo}`);
        for (const slot of dia.actividades) {
          const act = slot.actividad;
          const nombre = act?.nombre || act?.toString() || '';
          const hora = slot.horaInicio ? `${slot.horaInicio}-${slot.horaFin}` : '';
          doc.fontSize(10).fillColor('#666666').text(`    ${hora}  ${nombre}`);
        }
        doc.moveDown(0.4);
      }
    }

    // Footer
    doc.moveDown(2);
    if (doc.y > doc.page.height - 80) doc.addPage();
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#e0e0e0');
    doc.moveDown(0.8);
    doc.fontSize(9).fillColor('#999999');
    doc.text('ChinaTravel — Guías de viaje personalizadas a China', { align: 'center' });
    doc.text(`Documento generado el ${fecha}`, { align: 'center' });
    doc.text('Este documento sirve como comprobante de compra.', { align: 'center' });

    doc.end();
    stream.on('finish', () => resolve(`/uploads/${filename}`));
    stream.on('error', reject);
  });
};
