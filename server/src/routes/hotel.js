import { Router } from 'express';
import { getHotels, getHotel, createHotel, updateHotel, deleteHotel } from '../controllers/hotelController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.get('/', getHotels);
router.get('/:id', getHotel);
router.post('/', protect, authorize(ROLES.ADMIN), createHotel);
router.put('/:id', protect, authorize(ROLES.ADMIN), updateHotel);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteHotel);

export default router;
