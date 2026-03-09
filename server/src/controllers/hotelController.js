import Hotel from '../models/Hotel.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getHotels = asyncHandler(async (req, res) => {
  const filter = { isApproved: true };
  if (req.query.ciudad) filter.ciudad = req.query.ciudad;
  const hotels = await Hotel.find(filter).populate('ciudad', 'nombre slug');
  res.json({ ok: true, data: hotels });
});

export const getHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id).populate('ciudad', 'nombre slug');
  if (!hotel) throw new ApiError(404, 'Hotel no encontrado');
  res.json({ ok: true, data: hotel });
});

export const createHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.create(req.body);
  res.status(201).json({ ok: true, data: hotel });
});

export const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!hotel) throw new ApiError(404, 'Hotel no encontrado');
  res.json({ ok: true, data: hotel });
});

export const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) throw new ApiError(404, 'Hotel no encontrado');
  await hotel.deleteOne();
  res.json({ ok: true, message: 'Hotel eliminado' });
});
