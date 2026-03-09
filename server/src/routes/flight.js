import { Router } from 'express';
import { getFlights, getFlight, createFlight, updateFlight, deleteFlight } from '../controllers/flightController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.get('/', getFlights);
router.get('/:id', getFlight);
router.post('/', protect, authorize(ROLES.ADMIN), createFlight);
router.put('/:id', protect, authorize(ROLES.ADMIN), updateFlight);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteFlight);

export default router;
