import Ruta from '../models/Ruta.js';
import Activity from '../models/Activity.js';
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

export const getRutas = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.ciudad) filter.ciudad = req.query.ciudad;

  const rutas = await Ruta.find(filter)
    .populate('ciudad', 'nombre slug imagenPortada')
    .select('-dias');
  res.json({ ok: true, data: rutas });
});

export const getRuta = asyncHandler(async (req, res) => {
  const ruta = await Ruta.findById(req.params.id)
    .populate('ciudad', 'nombre slug imagenPortada')
    .populate('dias.actividades.actividad');
  if (!ruta) throw new ApiError(404, 'Ruta no encontrada');
  res.json({ ok: true, data: ruta });
});

export const getAlternativeActivities = asyncHandler(async (req, res) => {
  const ruta = await Ruta.findById(req.params.id).populate('ciudad');
  if (!ruta) throw new ApiError(404, 'Ruta no encontrada');

  const { categoria, exclude } = req.query;
  const filter = { ciudad: ruta.ciudad._id, isApproved: true };
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
  const ruta = await Ruta.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!ruta) throw new ApiError(404, 'Ruta no encontrada');
  const priced = await repriceRuta(ruta._id);
  res.json({ ok: true, data: priced || ruta });
});

export const deleteRuta = asyncHandler(async (req, res) => {
  const ruta = await Ruta.findById(req.params.id);
  if (!ruta) throw new ApiError(404, 'Ruta no encontrada');
  await ruta.deleteOne();
  res.json({ ok: true, message: 'Ruta eliminada' });
});
