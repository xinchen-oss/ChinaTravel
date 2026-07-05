import Ruta from '../models/Ruta.js';
import Activity from '../models/Activity.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { computeRutaPrice } from '../utils/helpers.js';

// Recalculate and persist a ruta's price from its activity tickets.
const repriceRuta = async (rutaId) => {
  const ruta = await Ruta.findById(rutaId).populate('dias.actividades.actividad', 'precio');
  if (!ruta) return null;
  ruta.precio = computeRutaPrice(ruta.dias);
  await ruta.save();
  return ruta;
};

const isRutaAccesible = (ruta) => {
  const dias = Array.isArray(ruta?.dias) ? ruta.dias : [];
  return dias.every((dia) => (dia.actividades || []).every((slot) => {
    const actividad = slot?.actividad;
    return !actividad || actividad.accesible !== false;
  }));
};

const getStatusChange = (before, body) => {
  if (body.isActive === undefined) return null;
  if (before.isActive === body.isActive) return null;
  return body.isActive ? 'activada' : 'desactivada';
};

const notifyOwnerStatusChange = async (ruta, status) => {
  if (!ruta.creadoPor) return;

  await Notification.create({
    usuario: ruta.creadoPor,
    tipo: 'SISTEMA',
    titulo: `Ruta ${status}`,
    mensaje: `Tu ruta "${ruta.titulo}" ha sido ${status}.`,
    enlace: '/comercial/mis-publicaciones',
  });
};

export const getRutas = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.ciudad) filter.ciudad = req.query.ciudad;

  const rutas = await Ruta.find(filter)
    .populate('ciudad', 'nombre slug imagenPortada')
    .populate('dias.actividades.actividad', 'accesible');

  const data = rutas
    .map((ruta) => {
      const plain = ruta.toObject ? ruta.toObject() : ruta;
      return { ...plain, accesible: isRutaAccesible(plain) };
    })
    .filter((ruta) => {
      if (req.query.accesible === 'true') return ruta.accesible;
      if (req.query.accesible === 'false') return !ruta.accesible;
      return true;
    });

  res.json({ ok: true, data });
});

export const getRuta = asyncHandler(async (req, res) => {
  const ruta = await Ruta.findById(req.params.id)
    .populate('ciudad', 'nombre slug imagenPortada')
    .populate('dias.actividades.actividad');
  if (!ruta) throw new ApiError(404, 'Ruta no encontrada');

  const plain = ruta.toObject ? ruta.toObject() : ruta;
  plain.accesible = isRutaAccesible(plain);

  const isOwner = req.user && (req.user.role === 'ADMIN' || String(ruta.creadoPor) === String(req.user._id));
  const isInactive = ruta.isActive === false;
  if (isInactive && !isOwner) {
    throw new ApiError(404, 'Ruta no encontrada');
  }

  res.json({ ok: true, data: plain });
});

export const getMyRutas = asyncHandler(async (req, res) => {
  const rutas = await Ruta.find({ creadoPor: req.user._id })
    .populate('ciudad', 'nombre slug imagenPortada')
    .sort('-createdAt');
  res.json({ ok: true, data: rutas });
});

export const getMyRouteStats = asyncHandler(async (req, res) => {
  const rutas = await Ruta.find({ creadoPor: req.user._id })
    .select('_id titulo ciudad')
    .populate('ciudad', 'nombre');

  const routeIds = rutas.map((ruta) => ruta._id);

  const [orders, reviews] = await Promise.all([
    Order.find({ ruta: { $in: routeIds } }).select('ruta precioTotal'),
    Review.find({ tipo: 'RUTA', referencia: { $in: routeIds } }).select('referencia puntuacion'),
  ]);

  const ordersByRoute = orders.reduce((acc, order) => {
    const key = String(order.ruta);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const incomeByRoute = orders.reduce((acc, order) => {
    const key = String(order.ruta);
    acc[key] = (acc[key] || 0) + Number(order.precioTotal || 0);
    return acc;
  }, {});

  const reviewsByRoute = reviews.reduce((acc, review) => {
    const key = String(review.referencia);
    const existing = acc[key] || { count: 0, total: 0 };
    existing.count += 1;
    existing.total += Number(review.puntuacion || 0);
    acc[key] = existing;
    return acc;
  }, {});

  const routes = rutas.map((ruta) => {
    const routeId = String(ruta._id);
    const ordersCount = ordersByRoute[routeId] || 0;
    const income = incomeByRoute[routeId] || 0;
    const reviewData = reviewsByRoute[routeId];
    const averageRating = reviewData?.count ? Number((reviewData.total / reviewData.count).toFixed(1)) : 0;

    return {
      _id: ruta._id,
      titulo: ruta.titulo,
      ciudad: ruta.ciudad,
      orders: ordersCount,
      income,
      averageRating,
      popularity: ordersCount > 0 ? 'Alta' : 'Sin pedidos',
    };
  }).sort((a, b) => b.orders - a.orders || b.income - a.income);

  const summary = {
    totalOrders: orders.length,
    totalIncome: orders.reduce((sum, order) => sum + Number(order.precioTotal || 0), 0),
    averageRating: reviews.length ? Number((reviews.reduce((sum, review) => sum + Number(review.puntuacion || 0), 0) / reviews.length).toFixed(1)) : 0,
  };

  res.json({ ok: true, data: { summary, routes } });
});

export const getAlternativeActivities = asyncHandler(async (req, res) => {
  const ruta = await Ruta.findById(req.params.id).populate('ciudad');
  if (!ruta) throw new ApiError(404, 'Ruta no encontrada');

  const { categoria, exclude } = req.query;
  const filter = { ciudad: ruta.ciudad._id, isApproved: true, isActive: true, stock: { $gt: 0 } };
  if (categoria) filter.categoria = categoria;
  if (exclude) filter._id = { $nin: exclude.split(',') };

  const alternatives = await Activity.find(filter);
  res.json({ ok: true, data: alternatives });
});

export const createRuta = asyncHandler(async (req, res) => {
  const ruta = await Ruta.create(req.body);
  const priced = await repriceRuta(ruta._id);
  res.status(201).json({ ok: true, data: priced || ruta });
});

export const updateRuta = asyncHandler(async (req, res) => {
  const ruta = await Ruta.findById(req.params.id);
  if (!ruta) throw new ApiError(404, 'Ruta no encontrada');

  if (req.user?.role && req.user.role !== 'ADMIN' && String(ruta.creadoPor) !== String(req.user._id)) {
    throw new ApiError(403, 'No tienes permiso para editar esta ruta');
  }

  const statusChange = getStatusChange(ruta, req.body);
  const updated = await Ruta.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) throw new ApiError(404, 'Ruta no encontrada');
  const priced = await repriceRuta(updated._id);
  if (statusChange) {
    await notifyOwnerStatusChange(priced || updated, statusChange);
  }
  res.json({ ok: true, data: priced || updated });
});

export const deleteRuta = asyncHandler(async (req, res) => {
  const ruta = await Ruta.findById(req.params.id);
  if (!ruta) throw new ApiError(404, 'Ruta no encontrada');

  if (req.user && req.user.role !== 'ADMIN' && String(ruta.creadoPor) !== String(req.user._id)) {
    throw new ApiError(403, 'No tienes permiso para eliminar esta ruta');
  }

  await ruta.deleteOne();
  res.json({ ok: true, message: 'Ruta eliminada' });
});
