import { Router } from 'express';
import { getPendingCounts } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(protect, authorize(ROLES.ADMIN));

router.get('/pending-counts', getPendingCounts);

export default router;
