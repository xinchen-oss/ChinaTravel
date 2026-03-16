import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe, updateProfile, solicitarCambioEmail, confirmarCambioEmail, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.post(
  '/registro',
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email no válido'),
    body('password')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
      .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
      .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
      .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).withMessage('La contraseña debe contener al menos un carácter especial'),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email no válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  validateRequest,
  login
);

router.get('/me', protect, getMe);
router.put('/perfil', protect, updateProfile);
router.post('/solicitar-cambio-email', protect, solicitarCambioEmail);
router.get('/confirmar-email/:token', confirmarCambioEmail);
router.post('/forgot-password', body('email').isEmail(), validateRequest, forgotPassword);
router.put(
  '/reset-password/:token',
  [
    body('password')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
      .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
      .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
      .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).withMessage('La contraseña debe contener al menos un carácter especial'),
  ],
  validateRequest,
  resetPassword
);

export default router;
