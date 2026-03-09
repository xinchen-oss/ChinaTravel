import Submission from '../models/Submission.js';
import Activity from '../models/Activity.js';
import Hotel from '../models/Hotel.js';
import Flight from '../models/Flight.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { SUBMISSION_STATUS } from '../utils/constants.js';
import { sendEmail } from '../services/emailService.js';

export const createSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.create({
    comercial: req.user._id,
    tipoContenido: req.body.tipoContenido,
    contenido: req.body.contenido,
  });

  // Notify admins
  await sendEmail({
    to: 'admin@chinatravel.com',
    subject: 'Nueva solicitud de contenido - ChinaTravel',
    html: `<p>El comercial <strong>${req.user.nombre}</strong> ha enviado una nueva solicitud de tipo <strong>${req.body.tipoContenido}</strong>.</p>`,
  });

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
    throw new ApiError(400, 'Esta solicitud ya fue procesada');
  }

  submission.estado = SUBMISSION_STATUS.APROBADO;
  submission.comentarioAdmin = req.body.comentario || '';
  await submission.save();

  // Create the actual resource
  const data = submission.contenido;
  data.creadoPor = submission.comercial._id;
  data.isApproved = true;

  if (submission.tipoContenido === 'ACTIVIDAD') await Activity.create(data);
  else if (submission.tipoContenido === 'HOTEL') await Hotel.create(data);
  else if (submission.tipoContenido === 'VUELO') await Flight.create(data);

  await sendEmail({
    to: submission.comercial.email,
    subject: 'Solicitud aprobada - ChinaTravel',
    html: `<p>¡Hola ${submission.comercial.nombre}!</p><p>Tu solicitud de tipo <strong>${submission.tipoContenido}</strong> ha sido <strong>aprobada</strong>.</p>${submission.comentarioAdmin ? `<p>Comentario: ${submission.comentarioAdmin}</p>` : ''}`,
  });

  res.json({ ok: true, data: submission });
});

export const rejectSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id).populate('comercial', 'nombre email');
  if (!submission) throw new ApiError(404, 'Solicitud no encontrada');
  if (submission.estado !== SUBMISSION_STATUS.PENDIENTE) {
    throw new ApiError(400, 'Esta solicitud ya fue procesada');
  }

  submission.estado = SUBMISSION_STATUS.RECHAZADO;
  submission.comentarioAdmin = req.body.comentario || '';
  await submission.save();

  await sendEmail({
    to: submission.comercial.email,
    subject: 'Solicitud rechazada - ChinaTravel',
    html: `<p>Hola ${submission.comercial.nombre},</p><p>Tu solicitud de tipo <strong>${submission.tipoContenido}</strong> ha sido <strong>rechazada</strong>.</p>${submission.comentarioAdmin ? `<p>Motivo: ${submission.comentarioAdmin}</p>` : ''}`,
  });

  res.json({ ok: true, data: submission });
});
