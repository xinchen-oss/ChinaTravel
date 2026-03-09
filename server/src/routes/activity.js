import { Router } from 'express';
import { getActivities, getActivity, createActivity, updateActivity, deleteActivity } from '../controllers/activityController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.get('/', getActivities);
router.get('/:id', getActivity);
router.post('/', protect, authorize(ROLES.ADMIN), createActivity);
router.put('/:id', protect, authorize(ROLES.ADMIN), updateActivity);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteActivity);

export default router;
