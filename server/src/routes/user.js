import { Router } from 'express';
import { createUser, getUsers, updateUserRole, deleteUser, getPendingComercials, approveComercial } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(protect, authorize(ROLES.ADMIN));

router.get('/', getUsers);
router.post('/', createUser);
router.get('/pending-comercials', getPendingComercials);
router.put('/:id', updateUserRole);
router.put('/:id/approve', approveComercial);
router.delete('/:id', deleteUser);

export default router;
