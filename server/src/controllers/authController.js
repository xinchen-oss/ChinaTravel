import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import config from '../config/env.js';
import { sendEmail } from '../services/emailService.js';

const generateToken = (id) => jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpire });

export const register = asyncHandler(async (req, res) => {
  const { nombre, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, 'El email ya está registrado');

  const user = await User.create({ nombre, email, password });
  const token = generateToken(user._id);

  await sendEmail({
    to: email,
    subject: 'Bienvenido a ChinaTravel',
    html: `<h1>¡Hola ${nombre}!</h1><p>Tu cuenta ha sido creada exitosamente. ¡Descubre China con nosotros!</p>`,
  });

  res.status(201).json({
    ok: true,
    token,
    user: { id: user._id, nombre: user.nombre, email: user.email, role: user.role },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Email o contraseña incorrectos');
  }
  if (!user.isActive) throw new ApiError(401, 'Cuenta desactivada');

  const token = generateToken(user._id);
  res.json({
    ok: true,
    token,
    user: { id: user._id, nombre: user.nombre, email: user.email, role: user.role },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    ok: true,
    user: { id: req.user._id, nombre: req.user.nombre, email: req.user.email, role: req.user.role },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!user) throw new ApiError(404, 'Usuario no encontrado');

  const { nombre, email, password, currentPassword } = req.body;

  if (nombre) user.nombre = nombre;
  if (email && email !== user.email) {
    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(400, 'El email ya está en uso');
    user.email = email;
  }
  if (password) {
    if (!currentPassword) throw new ApiError(400, 'Debes proporcionar tu contraseña actual');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new ApiError(400, 'Contraseña actual incorrecta');
    user.password = password;
  }

  await user.save();

  res.json({
    ok: true,
    user: { id: user._id, nombre: user.nombre, email: user.email, role: user.role },
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'No existe cuenta con ese email');

  // In production, generate a reset token and send it
  await sendEmail({
    to: email,
    subject: 'Restablecer contraseña - ChinaTravel',
    html: `<h1>Restablecer contraseña</h1><p>Hola ${user.nombre}, has solicitado restablecer tu contraseña. En una versión futura, aquí irá el enlace de restablecimiento.</p>`,
  });

  res.json({ ok: true, message: 'Email de restablecimiento enviado' });
});
