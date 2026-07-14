import ForumPost from '../models/ForumPost.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ROLES } from '../utils/constants.js';

// obtener todos los posts principales (parentPost = null)
export const getPosts = asyncHandler(async (req, res) => {
  const filter = { parentPost: null, bloqueado: false };
  if (req.query.ciudad) filter.ciudad = req.query.ciudad;
  if (req.query.search) filter.contenido = { $regex: req.query.search, $options: 'i' };

  const posts = await ForumPost.find(filter)
    .populate('ciudad', 'nombre slug')
    .populate('autor', 'nombre email role')
    .sort({ oficial: -1, createdAt: -1 });

  res.json({ ok: true, data: posts });
});

// obtener un post con sus respuestas
export const getPost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id)
    .populate('autor', 'nombre role')
    .populate('ciudad', 'nombre');

  if (!post) return res.status(404).json({ message: 'Post no encontrado' });

  if (post.bloqueado && req.user?.role !== ROLES.ADMIN) {
    return res.status(404).json({ message: 'Post no encontrado' });
  }

  const replies = await ForumPost.find({ parentPost: post._id, bloqueado: false })
    .populate('autor', 'nombre role')
    .sort({ createdAt: 1 });

  res.json({
    ok: true,
    data: { post, replies }
  });
});

// crear un post principal
export const createPost = asyncHandler(async (req, res) => {
  const post = await ForumPost.create({
    titulo: req.body.titulo,
    contenido: req.body.contenido,
    autor: req.user._id,
    ciudad: req.body.ciudad || null,
    imagen: req.body.imagen || null,
    oficial: req.user.role === ROLES.ADMIN,
    bloqueado: false,
    parentPost: null,
  });

  const populated = await ForumPost.findById(post._id)
    .populate('ciudad', 'nombre slug')
    .populate('autor', 'nombre email role');

  res.status(201).json({ ok: true, data: populated });
});

// responder a un post
export const createReply = asyncHandler(async (req, res) => {
  const reply = await ForumPost.create({
    contenido: req.body.contenido,
    autor: req.user._id,
    oficial: req.user.role === ROLES.ADMIN,
    bloqueado: false,
    parentPost: req.params.postId,
  });

  const populated = await ForumPost.findById(reply._id).populate('autor', 'nombre role');

  res.status(201).json({ ok: true, data: populated });
});

// eliminar un post y sus respuestas
export const deletePost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post no encontrado');

  const isAdmin = req.user.role === ROLES.ADMIN;
  const isOwner = String(post.autor) === String(req.user._id);
  if (!isAdmin && !isOwner) {
    throw new ApiError(403, 'No tienes permisos para eliminar este contenido');
  }

  await ForumPost.deleteMany({ parentPost: post._id });
  await post.deleteOne();

  res.json({ ok: true, message: 'Post eliminado' });
});

export const getModerationPosts = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.ADMIN) {
    throw new ApiError(403, 'No tienes permisos para moderar el foro');
  }

  const posts = await ForumPost.find({ bloqueado: true })
    .populate('autor', 'nombre role')
    .populate('ciudad', 'nombre')
    .sort({ createdAt: -1 });

  res.json({ ok: true, data: posts });
});

export const moderatePost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post no encontrado');

  const shouldBlock = req.body.bloqueado === undefined ? !post.bloqueado : req.body.bloqueado;
  post.bloqueado = shouldBlock;
  await post.save();

  res.json({ ok: true, data: post });
});
