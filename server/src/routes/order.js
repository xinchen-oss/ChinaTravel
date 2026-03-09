import { Router } from 'express';
import { placeOrder, getMyOrders, getOrder, getAllOrders, getTipsPdf } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(protect);

router.post('/', placeOrder);
router.get('/mis-pedidos', getMyOrders);
router.get('/todos', authorize(ROLES.ADMIN), getAllOrders);
router.get('/:id', getOrder);
router.get('/:id/tips-pdf', getTipsPdf);

export default router;
