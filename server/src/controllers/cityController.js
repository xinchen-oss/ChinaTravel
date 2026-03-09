import City from '../models/City.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getCities = asyncHandler(async (req, res) => {
  const cities = await City.find().sort('nombre');
  res.json({ ok: true, data: cities });
});

export const getFeaturedCities = asyncHandler(async (req, res) => {
  const cities = await City.find({ destacada: true }).sort('nombre');
  res.json({ ok: true, data: cities });
});

export const getCityBySlug = asyncHandler(async (req, res) => {
  const city = await City.findOne({ slug: req.params.slug });
  if (!city) throw new ApiError(404, 'Ciudad no encontrada');
  res.json({ ok: true, data: city });
});

export const createCity = asyncHandler(async (req, res) => {
  const city = await City.create(req.body);
  res.status(201).json({ ok: true, data: city });
});

export const updateCity = asyncHandler(async (req, res) => {
  const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!city) throw new ApiError(404, 'Ciudad no encontrada');
  res.json({ ok: true, data: city });
});

export const deleteCity = asyncHandler(async (req, res) => {
  const city = await City.findById(req.params.id);
  if (!city) throw new ApiError(404, 'Ciudad no encontrada');
  await city.deleteOne();
  res.json({ ok: true, message: 'Ciudad eliminada' });
});
