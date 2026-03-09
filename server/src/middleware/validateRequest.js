import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    throw new ApiError(400, messages.join(', '));
  }
  next();
};

export default validateRequest;
