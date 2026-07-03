import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { chainable, mockRes } from '../helpers/chain.js';

jest.unstable_mockModule('../../src/models/ForumPost.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
}));

const { default: ForumPost } = await import('../../src/models/ForumPost.js');
const { default: ApiError } = await import('../../src/utils/ApiError.js');
const {
  getPosts,
  getPost,
  createPost,
  createReply,
  deletePost,
  moderatePost,
} = await import('../../src/controllers/forumController.js');

beforeEach(() => jest.clearAllMocks());

describe('forumController.getPosts', () => {
  it('aplica filtros ciudad y search excluyendo posts bloqueados', async () => {
    const data = [{ titulo: 'X' }];
    ForumPost.find.mockReturnValue(chainable(data));
    const res = mockRes();
    await getPosts({ query: { ciudad: '123', search: 'china' } }, res);
    expect(ForumPost.find).toHaveBeenCalledWith({
      parentPost: null,
      bloqueado: false,
      ciudad: '123',
      contenido: { $regex: 'china', $options: 'i' },
    });
    expect(res.json).toHaveBeenCalledWith({ ok: true, data });
  });

  it('solo posts principales sin filtros', async () => {
    ForumPost.find.mockReturnValue(chainable([]));
    await getPosts({ query: {} }, mockRes());
    expect(ForumPost.find).toHaveBeenCalledWith({ parentPost: null, bloqueado: false });
  });
});

describe('forumController.getPost', () => {
  it('devuelve post + replies', async () => {
    const post = { _id: '1', titulo: 'P' };
    const replies = [{ contenido: 'R' }];
    ForumPost.findById.mockReturnValue(chainable(post));
    ForumPost.find.mockReturnValue(chainable(replies));
    const res = mockRes();
    await getPost({ params: { id: '1' } }, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data: { post, replies } });
  });

  it('responde 404 si no existe', async () => {
    ForumPost.findById.mockReturnValue(chainable(null));
    const res = mockRes();
    await getPost({ params: { id: '1' } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('forumController.createPost', () => {
  it('crea un post principal', async () => {
    ForumPost.create.mockResolvedValue({ titulo: 'P' });
    const res = mockRes();
    await createPost(
      { body: { titulo: 'P', contenido: 'C', ciudad: '123' }, user: { _id: 'u1' } },
      res
    );
    expect(ForumPost.create).toHaveBeenCalledWith({
      titulo: 'P',
      contenido: 'C',
      autor: 'u1',
      ciudad: '123',
      imagen: null,
      oficial: false,
      bloqueado: false,
      parentPost: null,
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe('forumController.createReply', () => {
  it('crea una respuesta usando params.postId', async () => {
    ForumPost.create.mockResolvedValue({ contenido: 'R' });
    const res = mockRes();
    await createReply(
      { body: { contenido: 'R' }, user: { _id: 'u1' }, params: { postId: 'p1' } },
      res
    );
    expect(ForumPost.create).toHaveBeenCalledWith({
      contenido: 'R',
      autor: 'u1',
      oficial: false,
      bloqueado: false,
      parentPost: 'p1',
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe('forumController.deletePost', () => {
  it('elimina post y sus respuestas', async () => {
    const deleteOne = jest.fn().mockResolvedValue();
    ForumPost.findById.mockResolvedValue({ _id: '1', autor: 'u1', deleteOne });
    ForumPost.deleteMany.mockResolvedValue();
    const res = mockRes();
    await deletePost({ params: { id: '1' }, user: { _id: 'u1', role: 'USER' } }, res);
    expect(ForumPost.deleteMany).toHaveBeenCalledWith({ parentPost: '1' });
    expect(deleteOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true, message: 'Post eliminado' });
  });

  it('lanza 404 si el post no existe', async () => {
    ForumPost.findById.mockResolvedValue(null);
    await expect(deletePost({ params: { id: '1' }, user: { _id: 'u1', role: 'USER' } }, mockRes())).rejects.toThrow(ApiError);
  });
});

describe('forumController.moderatePost', () => {
  it('permite a un admin bloquear un post', async () => {
    const post = {
      _id: '1',
      bloqueado: false,
      save: jest.fn().mockResolvedValue(),
    };
    ForumPost.findById.mockResolvedValue(post);
    const res = mockRes();

    await moderatePost({ params: { id: '1' }, body: { bloqueado: true, motivo: 'spam' }, user: { _id: 'admin1', role: 'ADMIN' } }, res);

    expect(post.bloqueado).toBe(true);
    expect(post.motivoBloqueo).toBe('spam');
    expect(post.bloqueadoPor).toBe('admin1');
    expect(post.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true, data: post });
  });
});
