import User from '../models/User.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendEmail } from '../services/emailService.js';

export const createUser = asyncHandler(async (req, res) => {
  const { nombre, email, password, role } = req.body;
  if (!nombre || !email || !password) throw new ApiError(400, 'Nombre, email y contraseña son obligatorios');
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, 'Ya existe un usuario con ese email');
  const user = await User.create({ nombre, email, password, role: role || 'USER', isApproved: true });
  res.status(201).json({ ok: true, data: user });
});

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

export const getPendingComercials = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'COMERCIAL', isApproved: false }).select('-__v');
  res.json({ ok: true, data: users });
});

export const approveComercial = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Usuario no encontrado');
  if (user.role !== 'COMERCIAL') throw new ApiError(400, 'Este usuario no es Comercial');

  const { approved } = req.body; // true = aprobar, false = rechazar

  if (approved) {
    user.isApproved = true;
    await user.save();

    await Notification.create({
      usuario: user._id,
      tipo: 'SISTEMA',
      titulo: 'Cuenta Comercial aprobada',
      mensaje: '¡Tu cuenta Comercial ha sido aprobada! Ya puedes iniciar sesión y gestionar contenido.',
      enlace: '/comercial',
    });

    await sendEmail({
      to: user.email,
      subject: 'Cuenta Comercial aprobada - ChinaTravel',
      html: `<h1>¡Enhorabuena ${user.nombre}!</h1><p>Tu cuenta Comercial ha sido aprobada. Ya puedes iniciar sesión en ChinaTravel y empezar a gestionar tu contenido.</p>`,
    });

    res.json({ ok: true, data: user, message: 'Cuenta Comercial aprobada' });
  } else {
    await Notification.create({
      usuario: user._id,
      tipo: 'SISTEMA',
      titulo: 'Solicitud Comercial rechazada',
      mensaje: 'Tu solicitud de cuenta Comercial ha sido rechazada. Contacta con soporte para más información.',
    });

    await sendEmail({
      to: user.email,
      subject: 'Solicitud Comercial rechazada - ChinaTravel',
      html: `<h1>Hola ${user.nombre}</h1><p>Lamentamos informarte que tu solicitud de cuenta Comercial ha sido rechazada. Si crees que es un error, contacta con nuestro equipo de soporte.</p>`,
    });

    await user.deleteOne();
    res.json({ ok: true, message: 'Solicitud Comercial rechazada y usuario eliminado' });
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Usuario no encontrado');
  await user.deleteOne();
  res.json({ ok: true, message: 'Usuario eliminado' });
});
