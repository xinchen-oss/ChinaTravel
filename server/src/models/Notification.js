import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tipo: {
      type: String,
      enum: ['PEDIDO', 'RESENA', 'PROMO', 'SISTEMA', 'VIAJE'],
      required: true,
    },
    titulo: { type: String, required: true },
    mensaje: { type: String, required: true },
    leido: { type: Boolean, default: false },
    enlace: { type: String },
  },
  { timestamps: true }
);

notificationSchema.index({ usuario: 1, leido: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
