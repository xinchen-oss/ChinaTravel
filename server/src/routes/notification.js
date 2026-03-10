import { Router } from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.use(protect);

// Get my notifications
router.get('/', asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ usuario: req.user._id })
    .sort('-createdAt')
    .limit(50);
  const sinLeer = await Notification.countDocuments({ usuario: req.user._id, leido: false });
  res.json({ ok: true, data: { notifications, sinLeer } });
}));

// Mark as read
router.put('/:id/leer', asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, usuario: req.user._id },
    { leido: true }
  );
  res.json({ ok: true });
}));

// Mark all as read
router.put('/leer-todo', asyncHandler(async (req, res) => {
  await Notification.updateMany({ usuario: req.user._id, leido: false }, { leido: true });
  res.json({ ok: true });
}));

export default router;
