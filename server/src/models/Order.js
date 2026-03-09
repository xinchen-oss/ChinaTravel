import mongoose from 'mongoose';
import { ORDER_STATUS } from '../utils/constants.js';

const orderSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    guia: { type: mongoose.Schema.Types.ObjectId, ref: 'Guide', required: true },
    guiaPersonalizada: { type: mongoose.Schema.Types.Mixed },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    vuelo: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
    precioTotal: { type: Number, required: true },
    estado: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.CONFIRMADO },
    tipsPdfUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
