import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import errorHandler from '../../src/middleware/errorHandler.js';
import ApiError from '../../src/utils/ApiError.js';

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('errorHandler middleware', () => {
  let consoleErrorSpy;
  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('responde con el statusCode y mensaje del ApiError', () => {
    const res = mockRes();
    errorHandler(new ApiError(404, 'No encontrado'), {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ ok: false, error: 'No encontrado' });
  });

  it('convierte CastError de mongoose en 400', () => {
    const res = mockRes();
    const err = new Error('cast'); err.name = 'CastError';
    errorHandler(err, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ ok: false, error: 'Recurso no encontrado' });
  });

  it('convierte duplicate key (11000) en 400 con campo', () => {
    const res = mockRes();
    const err = { code: 11000, keyValue: { email: 'a@b.com' }, message: 'dup' };
    errorHandler(err, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ ok: false, error: 'Ya existe un registro con ese email' });
  });

  it('convierte ValidationError de mongoose en 400 concatenando mensajes', () => {
    const res = mockRes();
    const err = {
      name: 'ValidationError',
      message: 'val',
      errors: { a: { message: 'A es requerido' }, b: { message: 'B es requerido' } },
    };
    errorHandler(err, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].error).toMatch(/A es requerido.*B es requerido/);
  });

  it('convierte JsonWebTokenError en 401', () => {
    const res = mockRes();
    const err = new Error('jwt'); err.name = 'JsonWebTokenError';
    errorHandler(err, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ ok: false, error: 'Token no válido' });
  });

  it('convierte TokenExpiredError en 401', () => {
    const res = mockRes();
    const err = new Error('exp'); err.name = 'TokenExpiredError';
    errorHandler(err, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ ok: false, error: 'Token expirado' });
  });

  it('oculta detalles en errores 500', () => {
    const res = mockRes();
    errorHandler(new Error('algo interno'), {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ ok: false, error: 'Error interno del servidor' });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
