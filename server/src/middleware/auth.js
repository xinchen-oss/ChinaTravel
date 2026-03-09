import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import config from '../config/env.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    throw new ApiError(401, 'No autorizado, inicia sesión');
  }
  const decoded = jwt.verify(token, config.jwtSecret);
  req.user = await User.findById(decoded.id);
  if (!req.user || !req.user.isActive) {
    throw new ApiError(401, 'Usuario no encontrado o desactivado');
  }
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, 'No tienes permisos para esta acción');
  }
  next();
};
