import User from '../models/User.js';
import Submission from '../models/Submission.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import asyncHandler from '../utils/asyncHandler.js';

// Counts of items awaiting admin action, used to show red-dot badges in the admin sidebar.
export const getPendingCounts = asyncHandler(async (req, res) => {
  const [comercials, submissions, cancellations, reviews] = await Promise.all([
    User.countDocuments({ role: 'COMERCIAL', isApproved: false }),
    Submission.countDocuments({ estado: 'PENDIENTE' }),
    Order.countDocuments({ estado: 'PENDIENTE_CANCELACION' }),
    Review.countDocuments({ estado: 'PENDIENTE' }),
  ]);

  res.json({ ok: true, data: { comercials, submissions, cancellations, reviews } });
});
