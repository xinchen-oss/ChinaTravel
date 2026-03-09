import { Router } from 'express';
import { getCities, getFeaturedCities, getCityBySlug, createCity, updateCity, deleteCity } from '../controllers/cityController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.get('/', getCities);
router.get('/destacadas', getFeaturedCities);
router.get('/:slug', getCityBySlug);

// Admin only
router.post('/', protect, authorize(ROLES.ADMIN), createCity);
router.put('/:id', protect, authorize(ROLES.ADMIN), updateCity);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteCity);

export default router;
