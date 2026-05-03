import { uploadImage } from '../controllers/upload.controller.js';
import ApiError from '../utils/ApiError.js';

describe('uploadImage controller', () => {
  it('should return image url when file is uploaded', async () => {
    const req = {
      file: {
        filename: 'test-image.png',
      },
    };

    const res = {
      json: jest.fn(),
    };

    await uploadImage(req, res);

    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      data: {
        url: '/uploads/test-image.png',
      },
    });
  });

  it('should throw error if no file is uploaded', async () => {
    const req = {};
    const res = {
      json: jest.fn(),
    };

    await expect(uploadImage(req, res)).rejects.toThrow(ApiError);
  });
});
