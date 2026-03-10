import { Router } from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

const router = Router();

// Get reviews for a specific item (public)
router.get('/:tipo/:referenciaId', asyncHandler(async (req, res) => {
  const { tipo, referenciaId } = req.params;
  const tipoMap = { guia: 'GUIA', hotel: 'HOTEL', actividad: 'ACTIVIDAD' };
  const tipoVal = tipoMap[tipo];
  if (!tipoVal) throw new ApiError(400, 'Tipo inválido');

  const reviews = await Review.find({ tipo: tipoVal, referencia: referenciaId, estado: 'APROBADO' })
    .populate('usuario', 'nombre apellidos')
    .sort('-createdAt');

  const stats = await Review.aggregate([
    { $match: { tipo: tipoVal, referencia: new mongoose.Types.ObjectId(referenciaId), estado: 'APROBADO' } },
    { $group: { _id: null, avg: { $avg: '$puntuacion' }, count: { $sum: 1 } } },
  ]);

  res.json({
    ok: true,
    data: {
      reviews,
      promedio: stats[0]?.avg ? Math.round(stats[0].avg * 10) / 10 : 0,
      total: stats[0]?.count || 0,
    },
  });
}));

// Create review (authenticated)
router.post('/', protect, asyncHandler(async (req, res) => {
  const { tipo, referenciaId, puntuacion, titulo, comentario } = req.body;
  const tipoMap = { GUIA: 'Guide', HOTEL: 'Hotel', ACTIVIDAD: 'Activity' };
  const tipoRef = tipoMap[tipo];
  if (!tipoRef) throw new ApiError(400, 'Tipo inválido');

  const existing = await Review.findOne({ usuario: req.user._id, tipo, referencia: referenciaId });
  if (existing) throw new ApiError(400, 'Ya has dejado una reseña para este elemento');

  const review = await Review.create({
    usuario: req.user._id,
    tipo,
    referencia: referenciaId,
    tipoRef,
    puntuacion,
    titulo,
    comentario,
  });

  res.status(201).json({ ok: true, data: review });
}));

// Admin: get all pending reviews
router.get('/admin/pendientes', protect, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const reviews = await Review.find({ estado: 'PENDIENTE' })
    .populate('usuario', 'nombre apellidos email')
    .sort('-createdAt');
  res.json({ ok: true, data: reviews });
}));

// Admin: moderate review
router.put('/admin/:id', protect, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const { estado } = req.body;
  if (!['APROBADO', 'RECHAZADO'].includes(estado)) throw new ApiError(400, 'Estado inválido');

  const review = await Review.findByIdAndUpdate(req.params.id, { estado }, { new: true });
  if (!review) throw new ApiError(404, 'Reseña no encontrada');

  // Notify user
  await Notification.create({
    usuario: review.usuario,
    tipo: 'RESENA',
    titulo: estado === 'APROBADO' ? 'Reseña publicada' : 'Reseña rechazada',
    mensaje: estado === 'APROBADO'
      ? 'Tu reseña ha sido aprobada y ya es visible para otros usuarios.'
      : 'Tu reseña ha sido rechazada por no cumplir nuestras normas.',
  });

  res.json({ ok: true, data: review });
}));

export default router;
