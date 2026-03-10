import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true, uppercase: true, trim: true },
    descripcion: { type: String },
    tipo: { type: String, enum: ['PORCENTAJE', 'FIJO'], required: true },
    valor: { type: Number, required: true },
    minCompra: { type: Number, default: 0 },
    maxUsos: { type: Number, default: null },
    usosActuales: { type: Number, default: 0 },
    fechaInicio: { type: Date, default: Date.now },
    fechaFin: { type: Date, required: true },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.activo &&
    now >= this.fechaInicio &&
    now <= this.fechaFin &&
    (this.maxUsos === null || this.usosActuales < this.maxUsos)
  );
};

couponSchema.methods.calcDescuento = function (total) {
  if (total < this.minCompra) return 0;
  if (this.tipo === 'PORCENTAJE') return Math.round(total * this.valor / 100);
  return Math.min(this.valor, total);
};

export default mongoose.model('Coupon', couponSchema);
