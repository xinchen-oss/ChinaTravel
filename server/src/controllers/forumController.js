import ForumPost from '../models/ForumPost.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// obtener todos los posts principales (parentPost = null)
export const getPosts = asyncHandler(async (req, res) => {
  const filter = { parentPost: null };
  if (req.query.ciudad) filter.ciudad = req.query.ciudad;
  if (req.query.search) filter.contenido = { $regex: req.query.search, $options: 'i' };

  const posts = await ForumPost.find(filter)
    .populate('ciudad', 'nombre slug')
    .populate('autor', 'nombre email')
    .sort('-createdAt');

  res.json({ ok: true, data: posts });
});

// obtener un post con sus respuestas
export const getPost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id)
    .populate('autor', 'nombre')
    .populate('ciudad', 'nombre');

  if (!post) return res.status(404).json({ message: 'Post no encontrado' });

  const replies = await ForumPost.find({ parentPost: post._id })
    .populate('autor', 'nombre')
    .sort({ createdAt: 1 });

  res.json({
    post,
    replies
  });
});

// crear un post principal
export const createPost = asyncHandler(async (req, res) => {
  const post = await ForumPost.create({
    titulo: req.body.titulo,
    contenido: req.body.contenido,
    autor: req.user._id, // el autor es el usuario logueado
    ciudad: req.body.ciudad || null,
    parentPost: null,
  });

  res.status(201).json({ ok: true, data: post });
});

// responder a un post
export const createReply = asyncHandler(async (req, res) => {
  const reply = await ForumPost.create({
    contenido: req.body.contenido,
    autor: req.user._id,
    parentPost: req.params.postId
  });

  res.status(201).json({ ok: true, data: reply });
});

// eliminar un post y sus respuestas
export const deletePost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post no encontrado');

  // eliminar las respuestas
  await ForumPost.deleteMany({ parentPost: post._id });

  // eliminar el post principal
  await post.deleteOne();

  res.json({ ok: true, message: 'Post eliminado' });
});
