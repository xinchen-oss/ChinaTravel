import User from '../models/User.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendEmail } from '../services/emailService.js';
import { emailWrapper, emailButton } from '../utils/emailTemplate.js';
import { validatePassword } from '../utils/validatePassword.js';

export const createUser = asyncHandler(async (req, res) => {
  const { nombre, email, password, role } = req.body;
  if (!nombre || !email || !password) throw new ApiError(400, 'Nombre, email y contraseña son obligatorios');
  const pwError = validatePassword(password);
  if (pwError) throw new ApiError(400, pwError);
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

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    await sendEmail({
      to: user.email,
      subject: '✅ Cuenta Comercial aprobada - ChinaTravel',
      html: emailWrapper(`
        <div style="text-align:center;margin-bottom:28px;">
          <div style="width:72px;height:72px;background:linear-gradient(135deg,#d1fae5,#a7f3d0);color:#059669;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:2.2rem;font-weight:700;box-shadow:0 4px 12px rgba(5,150,105,0.15);">✓</div>
        </div>
        <h2 style="color:#1a1a2e;margin:0 0 8px;text-align:center;font-size:22px;">¡Cuenta Comercial aprobada!</h2>
        <p style="text-align:center;color:#6b7280;margin:0 0 28px;font-size:14px;">Ya formas parte del equipo de ChinaTravel</p>

        <p style="font-size:15px;line-height:1.6;">Hola <strong>${user.nombre}</strong>,</p>
        <p style="font-size:15px;line-height:1.6;">Nos complace informarte de que tu cuenta <span style="background:#10b981;color:#fff;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:700;">Comercial</span> ha sido <strong style="color:#059669;">aprobada</strong>. Ya puedes iniciar sesión y empezar a gestionar y proponer contenido (actividades y rutas) en la plataforma.</p>

        <div style="background:#f0fdf4;border-left:4px solid #059669;border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0;">
          <p style="margin:0;font-size:14px;color:#065f46;line-height:1.5;">💡 Desde tu panel podrás enviar nuevas propuestas de contenido para que el equipo las revise y publique.</p>
        </div>

        ${emailButton(`${clientUrl}/comercial`, 'Acceder a mi panel')}
      `),
    });

    res.json({ ok: true, data: user, message: 'Cuenta Comercial aprobada' });
  } else {
    await Notification.create({
      usuario: user._id,
      tipo: 'SISTEMA',
      titulo: 'Solicitud Comercial rechazada',
      mensaje: 'Tu solicitud de cuenta Comercial ha sido rechazada. Contacta con soporte para más información.',
    });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    await sendEmail({
      to: user.email,
      subject: '❌ Solicitud Comercial rechazada - ChinaTravel',
      html: emailWrapper(`
        <div style="text-align:center;margin-bottom:28px;">
          <div style="width:72px;height:72px;background:linear-gradient(135deg,#fee2e2,#fecaca);color:#dc2626;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:2.2rem;font-weight:700;box-shadow:0 4px 12px rgba(220,38,38,0.15);">✗</div>
        </div>
        <h2 style="color:#1a1a2e;margin:0 0 8px;text-align:center;font-size:22px;">Solicitud Comercial rechazada</h2>
        <p style="text-align:center;color:#6b7280;margin:0 0 28px;font-size:14px;">Tu solicitud no ha sido aprobada en esta ocasión</p>

        <p style="font-size:15px;line-height:1.6;">Hola <strong>${user.nombre}</strong>,</p>
        <p style="font-size:15px;line-height:1.6;">Lamentamos informarte de que tu solicitud de cuenta <span style="background:#6b7280;color:#fff;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:700;">Comercial</span> ha sido <strong style="color:#dc2626;">rechazada</strong>.</p>

        <div style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0;">
          <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.5;">ℹ️ Si crees que se trata de un error, puedes contactar con nuestro equipo de soporte.</p>
        </div>

        ${emailButton(`${clientUrl}/login`, 'Ir a ChinaTravel')}
      `),
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
