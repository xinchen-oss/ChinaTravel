import { Router } from 'express';
import { createSubmission, getSubmissions, getMySubmissions, approveSubmission, rejectSubmission } from '../controllers/submissionController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';
import upload from '../middleware/upload.js';

const router = Router();

router.use(protect);

router.post('/', authorize(ROLES.COMERCIAL), upload.single('imagen'), createSubmission);
router.get('/mis-solicitudes', authorize(ROLES.COMERCIAL), getMySubmissions);
router.get('/', authorize(ROLES.ADMIN), getSubmissions);
router.put('/:id/aprobar', authorize(ROLES.ADMIN), approveSubmission);
router.put('/:id/rechazar', authorize(ROLES.ADMIN), rejectSubmission);

export default router;
