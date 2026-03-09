import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateTipsPdf = async (order, guide, activities) => {
  return new Promise((resolve, reject) => {
    const filename = `tips-${order._id}.pdf`;
    const filepath = path.join(__dirname, '..', '..', 'uploads', filename);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);

    // Title
    doc.fontSize(24).text('ChinaTravel - Tips de Viaje', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(guide.titulo, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Duración: ${guide.duracionDias} días`);
    doc.moveDown();

    // Tips per activity
    doc.fontSize(16).text('Consejos por actividad:', { underline: true });
    doc.moveDown();

    for (const activity of activities) {
      doc.fontSize(14).text(activity.nombre, { bold: true });
      doc.fontSize(11).text(`Categoría: ${activity.categoria} | Duración: ${activity.duracionHoras}h`);
      if (activity.consejos && activity.consejos.length > 0) {
        activity.consejos.forEach((tip) => {
          doc.fontSize(11).text(`  • ${tip}`);
        });
      }
      doc.moveDown(0.5);
    }

    doc.moveDown();
    doc.fontSize(10).text('Generado por ChinaTravel - ¡Buen viaje!', { align: 'center' });

    doc.end();
    stream.on('finish', () => resolve(`/uploads/${filename}`));
    stream.on('error', reject);
  });
};
