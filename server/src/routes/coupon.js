import { Router } from 'express';
import Coupon from '../models/Coupon.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

const router = Router();

// Validate coupon (authenticated users)
router.post('/validar', protect, asyncHandler(async (req, res) => {
  const { codigo, total } = req.body;
  const coupon = await Coupon.findOne({ codigo: codigo.toUpperCase() });
  if (!coupon) throw new ApiError(404, 'Cupón no encontrado');
  if (!coupon.isValid()) throw new ApiError(400, 'Cupón expirado o agotado');
  if (total < coupon.minCompra) throw new ApiError(400, `Compra mínima: ${coupon.minCompra}€`);

  const descuento = coupon.calcDescuento(total);
  res.json({
    ok: true,
    data: {
      codigo: coupon.codigo,
      descripcion: coupon.descripcion,
      descuento,
      tipo: coupon.tipo,
      valor: coupon.valor,
    },
  });
}));

// Admin CRUD
router.get('/', protect, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.json({ ok: true, data: coupons });
}));

router.post('/', protect, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ ok: true, data: coupon });
}));

router.put('/:id', protect, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!coupon) throw new ApiError(404, 'Cupón no encontrado');
  res.json({ ok: true, data: coupon });
}));

router.delete('/:id', protect, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ ok: true, message: 'Cupón eliminado' });
}));

export default router;
