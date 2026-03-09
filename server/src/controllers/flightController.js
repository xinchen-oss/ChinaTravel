import Flight from '../models/Flight.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getFlights = asyncHandler(async (req, res) => {
  const filter = { isApproved: true };
  if (req.query.ciudad) filter.ciudadDestino = req.query.ciudad;
  const flights = await Flight.find(filter).populate('ciudadDestino', 'nombre slug');
  res.json({ ok: true, data: flights });
});

export const getFlight = asyncHandler(async (req, res) => {
  const flight = await Flight.findById(req.params.id).populate('ciudadDestino', 'nombre slug');
  if (!flight) throw new ApiError(404, 'Vuelo no encontrado');
  res.json({ ok: true, data: flight });
});

export const createFlight = asyncHandler(async (req, res) => {
  const flight = await Flight.create(req.body);
  res.status(201).json({ ok: true, data: flight });
});

export const updateFlight = asyncHandler(async (req, res) => {
  const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!flight) throw new ApiError(404, 'Vuelo no encontrado');
  res.json({ ok: true, data: flight });
});

export const deleteFlight = asyncHandler(async (req, res) => {
  const flight = await Flight.findById(req.params.id);
  if (!flight) throw new ApiError(404, 'Vuelo no encontrado');
  await flight.deleteOne();
  res.json({ ok: true, message: 'Vuelo eliminado' });
});
