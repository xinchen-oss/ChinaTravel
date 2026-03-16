import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import config from '../config/env.js';
import { sendEmail } from '../services/emailService.js';

const generateToken = (id) => jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpire });

const validatePassword = (password) => {
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
  if (!/[A-Z]/.test(password)) return 'La contraseña debe contener al menos una letra mayúscula';
  if (!/[a-z]/.test(password)) return 'La contraseña debe contener al menos una letra minúscula';
  if (!/[0-9]/.test(password)) return 'La contraseña debe contener al menos un número';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'La contraseña debe contener al menos un carácter especial (!@#$%...)';
  return null;
};

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

const emailWrapper = (content) => `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:#c41e3a;color:white;padding:24px;text-align:center;">
      <h1 style="margin:0;font-size:28px;letter-spacing:1px;">🇨🇳 ChinaTravel</h1>
      <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">Descubre China con nosotros</p>
    </div>
    <div style="padding:30px 24px;background:#f9f9f9;">
      ${content}
    </div>
    <div style="padding:16px 24px;text-align:center;background:#1a1a2e;color:rgba(255,255,255,0.5);font-size:11px;">
      <p style="margin:0;">ChinaTravel &copy; ${new Date().getFullYear()} — Todos los derechos reservados</p>
      <p style="margin:4px 0 0;">Este es un email automático, por favor no respondas.</p>
    </div>
  </div>
`;

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
      html: emailWrapper(`
        <h2 style="color:#1a1a2e;margin-top:0;">¡Hola ${nombre}!</h2>
        <p>Hemos recibido tu solicitud de cuenta <strong>Comercial</strong>.</p>
        <p>Nuestro equipo la revisará y te notificaremos por email cuando sea aprobada.</p>
        <div style="background:#fff3cd;padding:14px;border-radius:8px;margin:20px 0;">
          <strong>Empresa:</strong> ${empresaNombre || 'N/A'}<br>
          <strong>CIF:</strong> ${empresaCIF || 'N/A'}
        </div>
        <p style="color:#666;font-size:13px;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
      `),
    });
    res.status(201).json({ ok: true, pendingApproval: true, message: 'Solicitud de cuenta Comercial enviada. Recibirás una notificación cuando sea aprobada por el administrador.' });
  } else {
    const token = generateToken(user._id);
    await sendEmail({
      to: email,
      subject: '¡Bienvenido a ChinaTravel! Confirmación de registro',
      html: emailWrapper(`
        <h2 style="color:#1a1a2e;margin-top:0;">¡Bienvenido/a, ${nombre}! 🎉</h2>
        <p>Tu cuenta ha sido creada exitosamente. Estamos encantados de tenerte con nosotros.</p>
        <div style="background:#ffffff;padding:20px;border-radius:8px;border-left:4px solid #c41e3a;margin:20px 0;">
          <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
          <p style="margin:0;"><strong>Nombre:</strong> ${nombre} ${apellidos || ''}</p>
        </div>
        <p>Con ChinaTravel podrás:</p>
        <ul style="color:#444;line-height:2;">
          <li>Descubrir guías de viaje personalizadas</li>
          <li>Explorar la cultura, gastronomía y ciudades de China</li>
          <li>Reservar circuitos con itinerarios a tu medida</li>
          <li>Participar en el foro de viajeros</li>
        </ul>
        <div style="text-align:center;margin:24px 0;">
          <a href="${config.clientUrl}/guias" style="background:#c41e3a;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Explorar circuitos</a>
        </div>
        <p style="color:#666;font-size:13px;">¡Esperamos que disfrutes descubriendo China!</p>
      `),
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

  const { nombre, apellidos, password, currentPassword, telefono, fechaNacimiento, genero, nacionalidad, pasaporte, direccion } = req.body;

  if (nombre !== undefined) user.nombre = nombre;
  if (apellidos !== undefined) user.apellidos = apellidos;
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
    const isSame = await user.comparePassword(password);
    if (isSame) throw new ApiError(400, 'La nueva contraseña no puede ser igual a la actual');
    const pwError = validatePassword(password);
    if (pwError) throw new ApiError(400, pwError);
    user.password = password;
  }

  await user.save();
  res.json({ ok: true, user: userResponse(user) });
});

export const solicitarCambioEmail = asyncHandler(async (req, res) => {
  const { nuevoEmail } = req.body;
  if (!nuevoEmail) throw new ApiError(400, 'El nuevo email es obligatorio');

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'Usuario no encontrado');
  if (nuevoEmail === user.email) throw new ApiError(400, 'El nuevo email es igual al actual');

  const exists = await User.findOne({ email: nuevoEmail });
  if (exists) throw new ApiError(400, 'El email ya está en uso');

  const token = crypto.randomBytes(32).toString('hex');
  user.pendingEmail = nuevoEmail;
  user.emailChangeToken = crypto.createHash('sha256').update(token).digest('hex');
  user.emailChangeExpire = Date.now() + 30 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const confirmUrl = `${config.clientUrl}/confirmar-email/${token}`;

  await sendEmail({
    to: user.email,
    subject: 'Confirmar cambio de email - ChinaTravel',
    html: emailWrapper(`
      <h2 style="color:#1a1a2e;margin-top:0;">Cambio de email solicitado</h2>
      <p>Hola <strong>${user.nombre}</strong>,</p>
      <p>Has solicitado cambiar tu email a <strong>${nuevoEmail}</strong>.</p>
      <p>Haz clic en el siguiente botón para confirmar el cambio:</p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${confirmUrl}" style="background:#c41e3a;color:white;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;font-size:16px;">Confirmar cambio de email</a>
      </div>
      <p style="color:#666;font-size:13px;">Este enlace expirará en <strong>30 minutos</strong>.</p>
      <p style="color:#666;font-size:13px;">Si no solicitaste este cambio, puedes ignorar este email.</p>
    `),
  });

  res.json({ ok: true, message: 'Se ha enviado un enlace de verificación a tu email actual' });
});

export const confirmarCambioEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailChangeToken: hashedToken,
    emailChangeExpire: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, 'Token inválido o expirado');

  user.email = user.pendingEmail;
  user.pendingEmail = undefined;
  user.emailChangeToken = undefined;
  user.emailChangeExpire = undefined;
  await user.save({ validateBeforeSave: false });

  res.json({ ok: true, message: 'Email actualizado correctamente' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'No existe cuenta con ese email');

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${config.clientUrl}/reset-password/${resetToken}`;

  await sendEmail({
    to: email,
    subject: 'Restablecer contraseña - ChinaTravel',
    html: emailWrapper(`
      <h2 style="color:#1a1a2e;margin-top:0;">Restablecer contraseña</h2>
      <p>Hola <strong>${user.nombre}</strong>,</p>
      <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
      <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${resetUrl}" style="background:#c41e3a;color:white;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;font-size:16px;">Restablecer contraseña</a>
      </div>
      <p style="color:#666;font-size:13px;">Este enlace expirará en <strong>30 minutos</strong>.</p>
      <p style="color:#666;font-size:13px;">Si no solicitaste restablecer tu contraseña, puedes ignorar este email. Tu cuenta seguirá segura.</p>
      <div style="background:#f0f0f0;padding:12px;border-radius:6px;margin-top:16px;">
        <p style="margin:0;font-size:12px;color:#999;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p style="margin:4px 0 0;font-size:11px;color:#c41e3a;word-break:break-all;">${resetUrl}</p>
      </div>
    `),
  });

  res.json({ ok: true, message: 'Email de restablecimiento enviado' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, 'Token inválido o expirado');

  const pwError = validatePassword(password);
  if (pwError) throw new ApiError(400, pwError);

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  await sendEmail({
    to: user.email,
    subject: 'Contraseña actualizada - ChinaTravel',
    html: emailWrapper(`
      <h2 style="color:#1a1a2e;margin-top:0;">Contraseña actualizada</h2>
      <p>Hola <strong>${user.nombre}</strong>,</p>
      <p>Tu contraseña ha sido restablecida exitosamente.</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${config.clientUrl}/login" style="background:#c41e3a;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Iniciar sesión</a>
      </div>
      <p style="color:#666;font-size:13px;">Si no realizaste este cambio, contacta con nosotros inmediatamente.</p>
    `),
  });

  const jwtToken = generateToken(user._id);
  res.json({ ok: true, token: jwtToken, user: userResponse(user) });
});
