import { Router } from 'express';
import { getArticles, getArticle, createArticle, updateArticle, deleteArticle } from '../controllers/cultureController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.get('/', getArticles);
router.get('/:id', getArticle);
router.post('/', protect, authorize(ROLES.ADMIN), createArticle);
router.put('/:id', protect, authorize(ROLES.ADMIN), updateArticle);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteArticle);

export default router;
