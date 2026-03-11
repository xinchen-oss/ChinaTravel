import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import config from '../config/env.js';
import { sendEmail } from '../services/emailService.js';

const generateToken = (id) => jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpire });

const userResponse = (user) => ({
  id: user._id,
  nombre: user.nombre,
  apellidos: user.apellidos,
  email: user.email,
  telefono: user.telefono,
  fechaNacimiento: user.fechaNacimiento,
  genero: user.genero,
  nacionalidad: user.nacionalidad,
  pasaporte: user.pasaporte,
  direccion: user.direccion,
  role: user.role,
});

export const register = asyncHandler(async (req, res) => {
  const { nombre, apellidos, email, password, telefono, fechaNacimiento, genero, nacionalidad, pasaporte, direccion, role, empresaNombre, empresaCIF, motivoComercial } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, 'El email ya está registrado');

  const isComercial = role === 'COMERCIAL';

  const user = await User.create({
    nombre, apellidos, email, password,
    telefono, fechaNacimiento, genero, nacionalidad, pasaporte, direccion,
    role: isComercial ? 'COMERCIAL' : 'USER',
    isApproved: !isComercial,
    empresaNombre: isComercial ? empresaNombre : '',
    empresaCIF: isComercial ? empresaCIF : '',
    motivoComercial: isComercial ? motivoComercial : '',
  });

  if (isComercial) {
    await sendEmail({
      to: email,
      subject: 'Solicitud de cuenta Comercial recibida - ChinaTravel',
      html: `<h1>¡Hola ${nombre}!</h1><p>Hemos recibido tu solicitud de cuenta Comercial. Nuestro equipo la revisará y te notificaremos cuando sea aprobada.</p>`,
    });
    res.status(201).json({ ok: true, pendingApproval: true, message: 'Solicitud de cuenta Comercial enviada. Recibirás una notificación cuando sea aprobada por el administrador.' });
  } else {
    const token = generateToken(user._id);
    await sendEmail({
      to: email,
      subject: 'Bienvenido a ChinaTravel',
      html: `<h1>¡Hola ${nombre}!</h1><p>Tu cuenta ha sido creada exitosamente. ¡Descubre China con nosotros!</p>`,
    });
    res.status(201).json({ ok: true, token, user: userResponse(user) });
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Email o contraseña incorrectos');
  }
  if (!user.isActive) throw new ApiError(401, 'Cuenta desactivada');
  if (!user.isApproved) throw new ApiError(401, 'Tu cuenta Comercial está pendiente de aprobación por el administrador');

  const token = generateToken(user._id);
  res.json({ ok: true, token, user: userResponse(user) });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ ok: true, user: userResponse(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!user) throw new ApiError(404, 'Usuario no encontrado');

  const { nombre, apellidos, email, password, currentPassword, telefono, fechaNacimiento, genero, nacionalidad, pasaporte, direccion } = req.body;

  if (nombre !== undefined) user.nombre = nombre;
  if (apellidos !== undefined) user.apellidos = apellidos;
  if (email && email !== user.email) {
    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(400, 'El email ya está en uso');
    user.email = email;
  }
  if (telefono !== undefined) user.telefono = telefono;
  if (fechaNacimiento !== undefined) user.fechaNacimiento = fechaNacimiento || null;
  if (genero !== undefined) user.genero = genero;
  if (nacionalidad !== undefined) user.nacionalidad = nacionalidad;
  if (pasaporte !== undefined) user.pasaporte = pasaporte;
  if (direccion !== undefined) {
    user.direccion = { ...user.direccion?.toObject?.() || {}, ...direccion };
  }

  if (password) {
    if (!currentPassword) throw new ApiError(400, 'Debes proporcionar tu contraseña actual');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new ApiError(400, 'Contraseña actual incorrecta');
    user.password = password;
  }

  await user.save();
  res.json({ ok: true, user: userResponse(user) });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'No existe cuenta con ese email');

  await sendEmail({
    to: email,
    subject: 'Restablecer contraseña - ChinaTravel',
    html: `<h1>Restablecer contraseña</h1><p>Hola ${user.nombre}, has solicitado restablecer tu contraseña. En una versión futura, aquí irá el enlace de restablecimiento.</p>`,
  });

  res.json({ ok: true, message: 'Email de restablecimiento enviado' });
});
