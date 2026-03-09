import Guide from '../models/Guide.js';
import Activity from '../models/Activity.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getGuides = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.ciudad) filter.ciudad = req.query.ciudad;

  const guides = await Guide.find(filter)
    .populate('ciudad', 'nombre slug imagenPortada')
    .select('-dias');
  res.json({ ok: true, data: guides });
});

export const getGuide = asyncHandler(async (req, res) => {
  const guide = await Guide.findById(req.params.id)
    .populate('ciudad', 'nombre slug imagenPortada')
    .populate('dias.actividades.actividad');
  if (!guide) throw new ApiError(404, 'Guía no encontrada');
  res.json({ ok: true, data: guide });
});

export const getAlternativeActivities = asyncHandler(async (req, res) => {
  const guide = await Guide.findById(req.params.id).populate('ciudad');
  if (!guide) throw new ApiError(404, 'Guía no encontrada');

  const { categoria, exclude } = req.query;
  const filter = { ciudad: guide.ciudad._id, isApproved: true };
  if (categoria) filter.categoria = categoria;
  if (exclude) filter._id = { $nin: exclude.split(',') };

  const alternatives = await Activity.find(filter);
  res.json({ ok: true, data: alternatives });
});

export const createGuide = asyncHandler(async (req, res) => {
  const guide = await Guide.create(req.body);
  res.status(201).json({ ok: true, data: guide });
});

export const updateGuide = asyncHandler(async (req, res) => {
  const guide = await Guide.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!guide) throw new ApiError(404, 'Guía no encontrada');
  res.json({ ok: true, data: guide });
});

export const deleteGuide = asyncHandler(async (req, res) => {
  const guide = await Guide.findById(req.params.id);
  if (!guide) throw new ApiError(404, 'Guía no encontrada');
  await guide.deleteOne();
  res.json({ ok: true, message: 'Guía eliminada' });
});
