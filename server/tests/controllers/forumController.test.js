import {
  getPosts,
  getPost,
  createPost,
  createReply,
  deletePost
} from '../controllers/forumPost.controller.js';

import ForumPost from '../models/ForumPost.js';
import ApiError from '../utils/ApiError.js';

// 🔹 Mock
jest.mock('../models/ForumPost.js');

const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('ForumPost Controller', () => {

  afterEach(() => jest.clearAllMocks());

  // 🔹 getPosts
  describe('getPosts', () => {

    it('should return posts with filters', async () => {
      const req = {
        query: {
          ciudad: '123',
          search: 'china'
        }
      };
      const res = mockRes();

      const mockPosts = [{ contenido: 'Viaje a China' }];

      const sortMock = jest.fn().mockResolvedValue(mockPosts);
      const populateAutorMock = jest.fn().mockReturnValue({ sort: sortMock });
      const populateCiudadMock = jest.fn().mockReturnValue({ populate: populateAutorMock });

      ForumPost.find.mockReturnValue({
        populate: populateCiudadMock
      });

      await getPosts(req, res);

      expect(ForumPost.find).toHaveBeenCalledWith({
        parentPost: null,
        ciudad: '123',
        contenido: { $regex: 'china', $options: 'i' }
      });

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: mockPosts
      });
    });

    it('should return posts without filters', async () => {
      const req = { query: {} };
      const res = mockRes();

      const sortMock = jest.fn().mockResolvedValue([]);
      const populateAutorMock = jest.fn().mockReturnValue({ sort: sortMock });
      const populateCiudadMock = jest.fn().mockReturnValue({ populate: populateAutorMock });

      ForumPost.find.mockReturnValue({
        populate: populateCiudadMock
      });

      await getPosts(req, res);

      expect(ForumPost.find).toHaveBeenCalledWith({
        parentPost: null
      });
    });

  });

  // 🔹 getPost
  describe('getPost', () => {

    it('should return post with replies', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      const mockPost = { _id: '123', titulo: 'Post' };
      const mockReplies = [{ contenido: 'Reply' }];

      // mock del primer findById
      ForumPost.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockPost)
        })
      });

      // mock de replies
      ForumPost.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockReplies)
        })
      });

      await getPost(req, res);

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        data: {
          post: mockPost,
          replies: mockReplies
        }
      });
    });

    it('should return 404 if post not found', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      ForumPost.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null)
        })
      });

      await getPost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

  });

  // 🔹 createPost
  describe('createPost', () => {

    it('should create a post', async () => {
      const req = {
        body: { titulo: 'Nuevo', contenido: 'Texto', ciudad: '123' },
        user: { _id: 'user1' }
      };
      const res = mockRes();

      const mockPost = { titulo: 'Nuevo' };

      ForumPost.create.mockResolvedValue(mockPost);

      await createPost(req, res);

      expect(ForumPost.create).toHaveBeenCalledWith({
        titulo: 'Nuevo',
        contenido: 'Texto',
        autor: 'user1',
        ciudad: '123',
        parentPost: null
      });

      expect(res.status).toHaveBeenCalledWith(201);
    });

  });

  // 🔹 createReply
  describe('createReply', () => {

    it('should create a reply', async () => {
      const req = {
        body: { contenido: 'Reply' },
        user: { _id: 'user1' },
        params: { postId: '123' }
      };
      const res = mockRes();

      const mockReply = { contenido: 'Reply' };

      ForumPost.create.mockResolvedValue(mockReply);

      await createReply(req, res);

      expect(ForumPost.create).toHaveBeenCalledWith({
        contenido: 'Reply',
        autor: 'user1',
        parentPost: '123'
      });

      expect(res.status).toHaveBeenCalledWith(201);
    });

  });

  // 🔹 deletePost
  describe('deletePost', () => {

    it('should delete post and replies', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      const deleteOneMock = jest.fn().mockResolvedValue();

      const mockPost = {
        _id: '123',
        deleteOne: deleteOneMock
      };

      ForumPost.findById.mockResolvedValue(mockPost);
      ForumPost.deleteMany.mockResolvedValue();

      await deletePost(req, res);

      expect(ForumPost.deleteMany).toHaveBeenCalledWith({
        parentPost: '123'
      });

      expect(deleteOneMock).toHaveBeenCalled();

      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        message: 'Post eliminado'
      });
    });

    it('should throw error if post not found', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      ForumPost.findById.mockResolvedValue(null);

      await expect(deletePost(req, res)).rejects.toThrow(ApiError);
    });

  });

});
