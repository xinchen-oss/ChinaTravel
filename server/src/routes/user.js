import { Router } from 'express';
import { getUsers, updateUserRole, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(protect, authorize(ROLES.ADMIN));

router.get('/', getUsers);
router.put('/:id', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
