import { Router } from 'express';
import { getRutas, getRuta, getMyRutas, getMyRouteStats, getAlternativeActivities, createRuta, updateRuta, deleteRuta } from '../controllers/rutaController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.get('/', getRutas);
router.get('/mis-rutas', protect, authorize(ROLES.COMERCIAL), getMyRutas);
router.get('/estadisticas-mis-rutas', protect, authorize(ROLES.COMERCIAL), getMyRouteStats);
router.get('/:id', getRuta);
router.get('/:id/actividades-alternativas', getAlternativeActivities);
router.post('/', protect, authorize(ROLES.ADMIN), createRuta);
router.put('/:id', protect, updateRuta);
router.delete('/:id', protect, deleteRuta);

export default router;
