import { Router } from 'express';
import { placeOrder, placeBatchOrder, getMyOrders, getOrder, getAllOrders, getTipsPdf, cancelOrder, approveCancellation, rejectCancellation, getRecommendations, deleteOrder } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(protect);

router.post('/', authorize(ROLES.USER), placeOrder);
router.post('/batch', authorize(ROLES.USER), placeBatchOrder);
router.get('/mis-pedidos', authorize(ROLES.USER), getMyOrders);
router.get('/todos', authorize(ROLES.ADMIN), getAllOrders);
router.get('/recomendaciones', authorize(ROLES.USER), getRecommendations);
router.get('/:id', getOrder);
router.get('/:id/tips-pdf', getTipsPdf);
router.put('/:id/cancelar', authorize(ROLES.USER), cancelOrder);
router.put('/:id/aprobar-cancelacion', authorize(ROLES.ADMIN), approveCancellation);
router.put('/:id/rechazar-cancelacion', authorize(ROLES.ADMIN), rejectCancellation);
router.delete('/:id', authorize(ROLES.ADMIN), deleteOrder);

export default router;
