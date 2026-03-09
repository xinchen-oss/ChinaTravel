import ApiError from '../utils/ApiError.js';

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new ApiError(400, 'Recurso no encontrado');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(400, `Ya existe un registro con ese ${field}`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new ApiError(400, messages.join(', '));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Token no válido');
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expirado');
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    ok: false,
    error: statusCode === 500 ? 'Error interno del servidor' : error.message,
  });

  if (statusCode === 500) {
    console.error('Error 500:', err);
  }
};

export default errorHandler;
