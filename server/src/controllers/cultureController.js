import CultureArticle from '../models/CultureArticle.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getArticles = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.ciudad) filter.ciudad = req.query.ciudad;
  if (req.query.categoria) filter.categoria = req.query.categoria;

  const articles = await CultureArticle.find(filter)
    .populate('ciudad', 'nombre slug')
    .select('-contenido')
    .sort('-createdAt');
  res.json({ ok: true, data: articles });
});

export const getArticle = asyncHandler(async (req, res) => {
  const article = await CultureArticle.findById(req.params.id).populate('ciudad', 'nombre slug');
  if (!article) throw new ApiError(404, 'Artículo no encontrado');
  res.json({ ok: true, data: article });
});

export const createArticle = asyncHandler(async (req, res) => {
  const article = await CultureArticle.create(req.body);
  res.status(201).json({ ok: true, data: article });
});

export const updateArticle = asyncHandler(async (req, res) => {
  const article = await CultureArticle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!article) throw new ApiError(404, 'Artículo no encontrado');
  res.json({ ok: true, data: article });
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const article = await CultureArticle.findById(req.params.id);
  if (!article) throw new ApiError(404, 'Artículo no encontrado');
  await article.deleteOne();
  res.json({ ok: true, message: 'Artículo eliminado' });
});
