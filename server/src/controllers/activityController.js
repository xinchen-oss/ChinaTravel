import Activity from '../models/Activity.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getActivities = asyncHandler(async (req, res) => {
  const filter = { isApproved: true };
  if (req.query.ciudad) filter.ciudad = req.query.ciudad;
  if (req.query.categoria) filter.categoria = req.query.categoria;

  const activities = await Activity.find(filter).populate('ciudad', 'nombre slug');
  res.json({ ok: true, data: activities });
});

export const getActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id).populate('ciudad', 'nombre slug');
  if (!activity) throw new ApiError(404, 'Actividad no encontrada');
  res.json({ ok: true, data: activity });
});

export const createActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.create(req.body);
  res.status(201).json({ ok: true, data: activity });
});

export const updateActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!activity) throw new ApiError(404, 'Actividad no encontrada');
  res.json({ ok: true, data: activity });
});

export const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) throw new ApiError(404, 'Actividad no encontrada');
  await activity.deleteOne();
  res.json({ ok: true, message: 'Actividad eliminada' });
});
