import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No se ha subido ninguna imagen');
  res.json({
    ok: true,
    data: { url: `/uploads/${req.file.filename}` },
  });
});
