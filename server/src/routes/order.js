import { Router } from 'express';
import { placeOrder, placeBatchOrder, getMyOrders, getOrder, getAllOrders, getTipsPdf, cancelOrder, approveCancellation, rejectCancellation, getRecommendations, deleteOrder } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(protect);

router.post('/', authorize(ROLES.USER, ROLES.COMERCIAL), placeOrder);
router.post('/batch', authorize(ROLES.USER, ROLES.COMERCIAL), placeBatchOrder);
router.get('/mis-pedidos', authorize(ROLES.USER, ROLES.COMERCIAL), getMyOrders);
router.get('/todos', authorize(ROLES.ADMIN), getAllOrders);
router.get('/recomendaciones', authorize(ROLES.USER, ROLES.COMERCIAL), getRecommendations);
router.get('/:id', getOrder);
router.get('/:id/tips-pdf', getTipsPdf);
router.put('/:id/cancelar', authorize(ROLES.USER, ROLES.COMERCIAL), cancelOrder);
router.put('/:id/aprobar-cancelacion', authorize(ROLES.ADMIN), approveCancellation);
router.put('/:id/rechazar-cancelacion', authorize(ROLES.ADMIN), rejectCancellation);
router.delete('/:id', authorize(ROLES.ADMIN), deleteOrder);

export default router;
