import { describe, it, expect } from '@jest/globals';
import ApiError from '../../src/utils/ApiError.js';

describe('ApiError', () => {
  it('extiende Error y guarda statusCode + message', () => {
    const err = new ApiError(404, 'No encontrado');
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('No encontrado');
  });

  it('marca el error como operacional', () => {
    const err = new ApiError(400, 'Bad Request');
    expect(err.isOperational).toBe(true);
  });

  it('captura stack trace', () => {
    const err = new ApiError(500, 'boom');
    expect(typeof err.stack).toBe('string');
    expect(err.stack.length).toBeGreaterThan(0);
  });
});
