import { describe, it, expect, jest } from '@jest/globals';
import { uploadImage } from '../../src/controllers/uploadController.js';
import ApiError from '../../src/utils/ApiError.js';
import { mockRes } from '../helpers/chain.js';

describe('uploadController.uploadImage', () => {
  it('devuelve la URL cuando se sube un archivo', async () => {
    const req = { file: { filename: 'test-image.png' } };
    const res = mockRes();

    await uploadImage(req, res);

    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: { url: '/uploads/test-image.png' },
    });
  });

  it('lanza ApiError 400 si no hay archivo', async () => {
    const req = {};
    const res = mockRes();
    await expect(uploadImage(req, res)).rejects.toThrow(ApiError);
  });
});
