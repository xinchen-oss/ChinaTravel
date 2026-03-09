import { Router } from 'express';
import { getGuides, getGuide, getAlternativeActivities, createGuide, updateGuide, deleteGuide } from '../controllers/guideController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.get('/', getGuides);
router.get('/:id', getGuide);
router.get('/:id/actividades-alternativas', getAlternativeActivities);
router.post('/', protect, authorize(ROLES.ADMIN), createGuide);
router.put('/:id', protect, authorize(ROLES.ADMIN), updateGuide);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteGuide);

export default router;
