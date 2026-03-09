import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-__v');
  res.json({ ok: true, data: users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Usuario no encontrado');

  user.role = req.body.role || user.role;
  user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
  await user.save();

  res.json({ ok: true, data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Usuario no encontrado');
  await user.deleteOne();
  res.json({ ok: true, message: 'Usuario eliminado' });
});
