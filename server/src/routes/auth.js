import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe, updateProfile, forgotPassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.post(
  '/registro',
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email no válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
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
router.post('/forgot-password', body('email').isEmail(), validateRequest, forgotPassword);

export default router;
