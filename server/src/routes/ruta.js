import { Router } from 'express';
import { getRutas, getRuta, getAlternativeActivities, createRuta, updateRuta, deleteRuta } from '../controllers/rutaController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.get('/', getRutas);
router.get('/:id', getRuta);
router.get('/:id/actividades-alternativas', getAlternativeActivities);
router.post('/', protect, authorize(ROLES.ADMIN), createRuta);
router.put('/:id', protect, authorize(ROLES.ADMIN), updateRuta);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteRuta);

export default router;
