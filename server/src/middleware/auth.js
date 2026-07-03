import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import config from '../config/env.js';

const attachUser = async (req) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return null;

  const decoded = jwt.verify(token, config.jwtSecret);
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) return null;
  return user;
};

export const protect = asyncHandler(async (req, res, next) => {
  const user = await attachUser(req);
  if (!user) {
    throw new ApiError(401, 'No autorizado, inicia sesión');
  }
  req.user = user;
  next();
});

export const protectOptional = asyncHandler(async (req, res, next) => {
  req.user = await attachUser(req);
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, 'No tienes permisos para esta acción');
  }
  next();
};
