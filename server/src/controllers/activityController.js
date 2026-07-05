import Activity from '../models/Activity.js';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const getStatusChange = (before, body) => {
  const wasVisible = before.isActive !== false && before.isApproved !== false;
  const nextActive = body.isActive !== undefined ? body.isActive : before.isActive;
  const nextApproved = body.isApproved !== undefined ? body.isApproved : before.isApproved;
  const isVisible = nextActive !== false && nextApproved !== false;

  if (wasVisible === isVisible) return null;
  return isVisible ? 'activada' : 'desactivada';
};

const notifyOwnerStatusChange = async (activity, status) => {
  if (!activity.creadoPor) return;

  await Notification.create({
    usuario: activity.creadoPor,
    tipo: 'SISTEMA',
    titulo: `Actividad ${status}`,
    mensaje: `Tu actividad "${activity.nombre}" ha sido ${status}.`,
    enlace: '/comercial/mis-publicaciones',
  });
};

export const getActivities = asyncHandler(async (req, res) => {
  const filter = { isApproved: true, isActive: true };
  if (req.query.ciudad) filter.ciudad = req.query.ciudad;
  if (req.query.categoria) filter.categoria = req.query.categoria;
  if (req.query.accesible === 'true') filter.accesible = true;
  if (req.query.accesible === 'false') filter.accesible = false;
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

  const statusChange = getStatusChange(activity, req.body);
  const shouldDisable = statusChange === 'desactivada';
  const updated = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('ciudad', 'nombre slug');

  if (statusChange && updated) {
    await notifyOwnerStatusChange(updated, statusChange);
  }

  if (shouldDisable && updated) {
  const candidateOrders = await Order.find({
    tipo: 'ACTIVIDAD',
    actividad: updated._id,
    estado: { $in: ['CONFIRMADO', 'PENDIENTE_CANCELACION'] },
  }).select('_id usuario');

  const actuallyCancelled = [];

  for (const order of candidateOrders) {
    // Atómico: solo se actualiza si SIGUE en uno de esos estados en el momento exacto de la escritura.
    // Si otra petición concurrente ya lo canceló, este findOneAndUpdate no encontrará nada que tocar.
    const result = await Order.findOneAndUpdate(
      {
        _id: order._id,
        estado: { $in: ['CONFIRMADO', 'PENDIENTE_CANCELACION'] },
      },
      {
        estado: 'CANCELADO',
        motivoCancelacion: 'La actividad fue desactivada o bloqueada por el administrador',
        fechaCancelacion: new Date(),
      },
      { new: true }
    );

    if (result) actuallyCancelled.push(result);
  }

  if (actuallyCancelled.length > 0) {
    await Notification.insertMany(actuallyCancelled.map((order) => ({
      usuario: order.usuario,
      tipo: 'PEDIDO',
      titulo: 'Pedido cancelado',
      mensaje: `Tu pedido de "${updated.nombre}" ha sido cancelado porque la actividad ya no esta disponible.`,
      enlace: '/dashboard',
    })));
  }
}
export const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) throw new ApiError(404, 'Actividad no encontrada');

  if (req.user && req.user.role !== 'ADMIN' && String(activity.creadoPor) !== String(req.user._id)) {
    throw new ApiError(403, 'No tienes permiso para eliminar esta actividad');
  }

  await activity.deleteOne();
  res.json({ ok: true, message: 'Actividad eliminada' });
});
