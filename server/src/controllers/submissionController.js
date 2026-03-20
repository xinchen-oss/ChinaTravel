import Submission from '../models/Submission.js';
import Activity from '../models/Activity.js';
import Hotel from '../models/Hotel.js';
import Flight from '../models/Flight.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { SUBMISSION_STATUS } from '../utils/constants.js';
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
      <p style="margin:4px 0 0;">Este es un email automático, por favor no respondas.</p>
    </div>
  </div>
`;

const typeLabels = { ACTIVIDAD: 'Actividad', HOTEL: 'Hotel', VUELO: 'Vuelo' };
const typeColors = { ACTIVIDAD: '#f59e0b', HOTEL: '#3b82f6', VUELO: '#8b5cf6' };
const typeIcons = { ACTIVIDAD: '🎯', HOTEL: '🏨', VUELO: '✈️' };

function buildContentTable(contenido, tipo) {
  const excluded = ['imagen', '_id', '__v', 'createdAt', 'updatedAt', 'creadoPor', 'isApproved'];
  const labels = {
    nombre: 'Nombre', descripcion: 'Descripción', ciudad: 'Ciudad', categoria: 'Categoría',
    duracionHoras: 'Duración (h)', precio: 'Precio', precioPorNoche: 'Precio/noche',
    estrellas: 'Estrellas', aerolinea: 'Aerolínea', origen: 'Origen', destino: 'Destino',
    ciudadDestino: 'Ciudad destino', horaSalida: 'Hora salida', horaLlegada: 'Hora llegada',
    plazas: 'Plazas', direccion: 'Dirección', servicios: 'Servicios',
  };

  const rows = Object.entries(contenido || {})
    .filter(([k]) => !excluded.includes(k))
    .map(([k, v], i) => {
      let val = v;
      if (k === 'estrellas') val = '★'.repeat(Number(v)) + '☆'.repeat(5 - Number(v));
      else if (k === 'precio' || k === 'precioPorNoche') val = `${Number(v).toFixed(2)} €`;
      else if (Array.isArray(v)) val = v.join(', ');
      else if (typeof v === 'object') val = JSON.stringify(v);

      return `<tr>
        <td style="padding:10px 0;color:#6b7280;width:40%;${i > 0 ? 'border-top:1px solid #f3f4f6;' : ''}">${labels[k] || k}</td>
        <td style="padding:10px 0;text-align:right;font-weight:${k === 'precio' || k === 'precioPorNoche' ? '700' : '600'};${i > 0 ? 'border-top:1px solid #f3f4f6;' : ''}${k === 'precio' || k === 'precioPorNoche' ? 'font-size:16px;color:#1a1a2e;' : ''}">${val}</td>
      </tr>`;
    }).join('');

  return rows;
}

export const createSubmission = asyncHandler(async (req, res) => {
  let contenido = req.body.contenido;
  if (typeof contenido === 'string') {
    try { contenido = JSON.parse(contenido); } catch (e) { /* keep as-is */ }
  }

  if (req.file) {
    contenido.imagen = `/uploads/${req.file.filename}`;
  }

  const submission = await Submission.create({
    comercial: req.user._id,
    tipoContenido: req.body.tipoContenido,
    contenido,
  });

  const tipo = req.body.tipoContenido;
  const color = typeColors[tipo] || '#f59e0b';
  const icon = typeIcons[tipo] || '📋';
  const label = typeLabels[tipo] || tipo;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const contentRows = buildContentTable(contenido, tipo);

  // Notify all admins
  const admins = await User.find({ role: 'ADMIN' });
  for (const admin of admins) {
    if (admin.email) {
      await sendEmail({
        to: admin.email,
        subject: `📋 Nueva solicitud: ${label} — ${req.user.nombre} — ChinaTravel`,
        html: emailWrapper(`
          <div style="text-align:center;margin-bottom:28px;">
            <div style="width:72px;height:72px;background:linear-gradient(135deg,#dbeafe,#bfdbfe);color:#2563eb;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:2.2rem;box-shadow:0 4px 12px rgba(37,99,235,0.15);">${icon}</div>
          </div>
          <h2 style="color:#1a1a2e;margin:0 0 8px;text-align:center;font-size:22px;">Nueva solicitud de contenido</h2>
          <p style="text-align:center;color:#6b7280;margin:0 0 28px;font-size:14px;">Un comercial ha enviado contenido para revisión</p>

          <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin:0 0 20px;">
            <div style="background:#f8fafc;padding:14px 20px;border-bottom:1px solid #e5e7eb;">
              <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Enviado por</span>
            </div>
            <div style="padding:16px 20px;">
              <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#6b7280;width:40%;">Comercial</td>
                  <td style="padding:8px 0;text-align:right;font-weight:600;">${req.user.nombre}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;border-top:1px solid #f3f4f6;">Email</td>
                  <td style="padding:8px 0;text-align:right;border-top:1px solid #f3f4f6;">
                    <a href="mailto:${req.user.email}" style="color:#c41e3a;text-decoration:none;">${req.user.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;border-top:1px solid #f3f4f6;">Tipo</td>
                  <td style="padding:8px 0;text-align:right;border-top:1px solid #f3f4f6;">
                    <span style="background:${color};color:#fff;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;">${label}</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin:0 0 24px;">
            <div style="background:#f8fafc;padding:14px 20px;border-bottom:1px solid #e5e7eb;">
              <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Contenido propuesto</span>
            </div>
            <div style="padding:16px 20px;">
              <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse;">
                ${contentRows}
              </table>
            </div>
          </div>

          <div style="text-align:center;margin:28px 0 8px;">
            <a href="${clientUrl}/admin/aprobaciones" style="background:linear-gradient(135deg,#c41e3a,#a01830);color:white;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;box-shadow:0 4px 12px rgba(196,30,58,0.3);">Revisar solicitud</a>
          </div>
          <p style="text-align:center;color:#9ca3af;font-size:12px;margin:12px 0 0;">Accede al panel para aprobar o rechazar esta solicitud</p>
        `),
      });
    }
  }

  res.status(201).json({ ok: true, data: submission });
});

export const getSubmissions = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.estado) filter.estado = req.query.estado;

  const submissions = await Submission.find(filter)
    .populate('comercial', 'nombre email')
    .sort('-createdAt');
  res.json({ ok: true, data: submissions });
});

export const getMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ comercial: req.user._id }).sort('-createdAt');
  res.json({ ok: true, data: submissions });
});

export const approveSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id).populate('comercial', 'nombre email');
  if (!submission) throw new ApiError(404, 'Solicitud no encontrada');
  if (submission.estado !== SUBMISSION_STATUS.PENDIENTE) {
    throw new ApiError(400, `Esta solicitud ya fue ${submission.estado === SUBMISSION_STATUS.APROBADO ? 'aprobada' : 'rechazada'}`);
  }

  submission.estado = SUBMISSION_STATUS.APROBADO;
  submission.comentarioAdmin = req.body.comentario || '';
  await submission.save();

  const data = submission.contenido;
  data.creadoPor = submission.comercial._id;
  data.isApproved = true;

  if (submission.tipoContenido === 'ACTIVIDAD') await Activity.create(data);
  else if (submission.tipoContenido === 'HOTEL') await Hotel.create(data);
  else if (submission.tipoContenido === 'VUELO') await Flight.create(data);

  const tipo = submission.tipoContenido;
  const label = typeLabels[tipo] || tipo;
  const color = typeColors[tipo] || '#f59e0b';
  const contentRows = buildContentTable(submission.contenido, tipo);

  await sendEmail({
    to: submission.comercial.email,
    subject: `✅ Solicitud aprobada: ${label} — ChinaTravel`,
    html: emailWrapper(`
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:72px;height:72px;background:linear-gradient(135deg,#d1fae5,#a7f3d0);color:#059669;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:2.2rem;font-weight:700;box-shadow:0 4px 12px rgba(5,150,105,0.15);">✓</div>
      </div>
      <h2 style="color:#1a1a2e;margin:0 0 8px;text-align:center;font-size:22px;">¡Solicitud aprobada!</h2>
      <p style="text-align:center;color:#6b7280;margin:0 0 28px;font-size:14px;">Tu contenido ha sido publicado correctamente</p>

      <p style="font-size:15px;line-height:1.6;">Hola <strong>${submission.comercial.nombre}</strong>,</p>
      <p style="font-size:15px;line-height:1.6;">Nos complace informarte de que tu solicitud de tipo <span style="background:${color};color:#fff;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:700;">${label}</span> ha sido <strong style="color:#059669;">aprobada</strong> y el contenido ya está publicado en la plataforma.</p>

      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin:24px 0;">
        <div style="background:#f0fdf4;padding:14px 20px;border-bottom:1px solid #d1fae5;">
          <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#065f46;">Contenido publicado</span>
        </div>
        <div style="padding:16px 20px;">
          <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse;">
            ${contentRows}
          </table>
        </div>
      </div>

      ${submission.comentarioAdmin ? `
      <div style="background:#f0fdf4;border-left:4px solid #059669;border-radius:0 8px 8px 0;padding:14px 18px;margin:0 0 24px;">
        <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#065f46;">Comentario del administrador</p>
        <p style="margin:0;font-size:14px;color:#065f46;line-height:1.5;">${submission.comentarioAdmin}</p>
      </div>
      ` : ''}

      <div style="text-align:center;margin:28px 0 8px;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/comercial" style="background:linear-gradient(135deg,#c41e3a,#a01830);color:white;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;box-shadow:0 4px 12px rgba(196,30,58,0.3);">Ver mis solicitudes</a>
      </div>
    `),
  });

  res.json({ ok: true, data: submission });
});

export const rejectSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id).populate('comercial', 'nombre email');
  if (!submission) throw new ApiError(404, 'Solicitud no encontrada');
  if (submission.estado !== SUBMISSION_STATUS.PENDIENTE) {
    throw new ApiError(400, `Esta solicitud ya fue ${submission.estado === SUBMISSION_STATUS.APROBADO ? 'aprobada' : 'rechazada'}`);
  }

  submission.estado = SUBMISSION_STATUS.RECHAZADO;
  submission.comentarioAdmin = req.body.comentario || '';
  await submission.save();

  const tipo = submission.tipoContenido;
  const label = typeLabels[tipo] || tipo;
  const color = typeColors[tipo] || '#f59e0b';
  const contentRows = buildContentTable(submission.contenido, tipo);

  await sendEmail({
    to: submission.comercial.email,
    subject: `❌ Solicitud rechazada: ${label} — ChinaTravel`,
    html: emailWrapper(`
      <div style="text-align:center;margin-bottom:28px;">
        <div style="width:72px;height:72px;background:linear-gradient(135deg,#fee2e2,#fecaca);color:#dc2626;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:2.2rem;font-weight:700;box-shadow:0 4px 12px rgba(220,38,38,0.15);">✗</div>
      </div>
      <h2 style="color:#1a1a2e;margin:0 0 8px;text-align:center;font-size:22px;">Solicitud rechazada</h2>
      <p style="text-align:center;color:#6b7280;margin:0 0 28px;font-size:14px;">Tu contenido no ha sido aprobado en esta ocasión</p>

      <p style="font-size:15px;line-height:1.6;">Hola <strong>${submission.comercial.nombre}</strong>,</p>
      <p style="font-size:15px;line-height:1.6;">Lamentamos informarte de que tu solicitud de tipo <span style="background:${color};color:#fff;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:700;">${label}</span> ha sido <strong style="color:#dc2626;">rechazada</strong>.</p>

      ${submission.comentarioAdmin ? `
      <div style="background:#fef2f2;border-left:4px solid #dc2626;border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0;">
        <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#991b1b;">Motivo del rechazo</p>
        <p style="margin:0;font-size:14px;color:#7f1d1d;line-height:1.5;">${submission.comentarioAdmin}</p>
      </div>
      ` : ''}

      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin:24px 0;">
        <div style="background:#fef2f2;padding:14px 20px;border-bottom:1px solid #fecaca;">
          <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#991b1b;">Contenido enviado</span>
        </div>
        <div style="padding:16px 20px;">
          <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse;">
            ${contentRows}
          </table>
        </div>
      </div>

      <div style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;padding:14px 18px;margin:0 0 24px;">
        <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.5;">ℹ️ Puedes corregir los datos y enviar una nueva solicitud desde tu panel de comercial.</p>
      </div>

      <div style="text-align:center;margin:28px 0 8px;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/comercial/nueva-solicitud" style="background:linear-gradient(135deg,#c41e3a,#a01830);color:white;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;box-shadow:0 4px 12px rgba(196,30,58,0.3);">Enviar nueva solicitud</a>
      </div>
    `),
  });

  res.json({ ok: true, data: submission });
});
