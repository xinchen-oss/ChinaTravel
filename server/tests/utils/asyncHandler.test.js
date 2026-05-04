import { describe, it, expect, jest } from '@jest/globals';
import asyncHandler from '../../src/utils/asyncHandler.js';

describe('asyncHandler', () => {
  it('llama a la función envuelta con req, res, next', async () => {
    const fn = jest.fn(async () => 'ok');
    const wrapped = asyncHandler(fn);
    const req = {}; const res = {}; const next = jest.fn();
    await wrapped(req, res, next);
    expect(fn).toHaveBeenCalledWith(req, res, next);
  });

  it('pasa el error a next cuando la función rechaza', async () => {
    const error = new Error('boom');
    const fn = jest.fn(async () => { throw error; });
    const wrapped = asyncHandler(fn);
    const next = jest.fn();
    await wrapped({}, {}, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('no llama a next con error cuando la función resuelve', async () => {
    const fn = jest.fn(async () => 'ok');
    const wrapped = asyncHandler(fn);
    const next = jest.fn();
    await wrapped({}, {}, next);
    expect(next).not.toHaveBeenCalled();
  });
});
