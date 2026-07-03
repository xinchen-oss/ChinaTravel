import Activity from '../models/Activity.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getActivities = asyncHandler(async (req, res) => {
  const filter = { isApproved: true, isActive: true };
  if (req.query.ciudad) filter.ciudad = req.query.ciudad;
  if (req.query.categoria) filter.categoria = req.query.categoria;
  // Solo entradas de pago: las gratuitas no se venden, así que la lista
  // pública las oculta (admin y comercial siguen viéndolas para montar rutas).
  if (req.query.dePago === 'true') filter.precio = { $gt: 0 };

  const activities = await Activity.find(filter).populate('ciudad', 'nombre slug');
  res.json({ ok: true, data: activities });
});

export const getActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id).populate('ciudad', 'nombre slug');
  if (!activity) throw new ApiError(404, 'Actividad no encontrada');

  const isOwner = req.user && (req.user.role === 'ADMIN' || String(activity.creadoPor) === String(req.user._id));
  const isInactive = activity.isActive === false;
  if (isInactive && !isOwner) {
    throw new ApiError(404, 'Actividad no encontrada');
  }

  res.json({ ok: true, data: activity });
});

export const getMyActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find({ creadoPor: req.user._id })
    .populate('ciudad', 'nombre slug')
    .sort('-createdAt');
  res.json({ ok: true, data: activities });
});

export const createActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.create(req.body);
  res.status(201).json({ ok: true, data: activity });
});

export const updateActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) throw new ApiError(404, 'Actividad no encontrada');

  if (req.user?.role && req.user.role !== 'ADMIN' && String(activity.creadoPor) !== String(req.user._id)) {
    throw new ApiError(403, 'No tienes permiso para editar esta actividad');
  }

  const updated = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('ciudad', 'nombre slug');
  res.json({ ok: true, data: updated });
});

export const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) throw new ApiError(404, 'Actividad no encontrada');

  if (req.user && req.user.role !== 'ADMIN' && String(activity.creadoPor) !== String(req.user._id)) {
    throw new ApiError(403, 'No tienes permiso para eliminar esta actividad');
  }

  await activity.deleteOne();
  res.json({ ok: true, message: 'Actividad eliminada' });
});
