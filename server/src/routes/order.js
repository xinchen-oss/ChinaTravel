import { Router } from 'express';
import { placeOrder, placeBatchOrder, getMyOrders, getOrder, getAllOrders, getTipsPdf, cancelOrder, getRecommendations } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(protect);

router.post('/', placeOrder);
router.post('/batch', placeBatchOrder);
router.get('/mis-pedidos', getMyOrders);
router.get('/todos', authorize(ROLES.ADMIN), getAllOrders);
router.get('/recomendaciones', getRecommendations);
router.get('/:id', getOrder);
router.get('/:id/tips-pdf', getTipsPdf);
router.put('/:id/cancelar', cancelOrder);

export default router;
