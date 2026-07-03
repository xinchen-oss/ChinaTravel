import { Router } from 'express';
import { getActivities, getActivity, getMyActivities, createActivity, updateActivity, deleteActivity } from '../controllers/activityController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.get('/', getActivities);
router.get('/mis-actividades', protect, authorize(ROLES.COMERCIAL), getMyActivities);
router.get('/:id', getActivity);
router.post('/', protect, authorize(ROLES.ADMIN), createActivity);
router.put('/:id', protect, updateActivity);
router.delete('/:id', protect, deleteActivity);

export default router;
