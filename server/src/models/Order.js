import mongoose from 'mongoose';
import { ORDER_STATUS } from '../utils/constants.js';

const orderSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // An order is either a whole RUTA or a single ACTIVIDAD ticket.
    tipo: { type: String, enum: ['RUTA', 'ACTIVIDAD'], default: 'RUTA' },
    ruta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ruta',
      required: function () {
        return this.tipo === 'RUTA';
      },
    },
    rutaPersonalizada: { type: mongoose.Schema.Types.Mixed },
    actividad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: function () {
        return this.tipo === 'ACTIVIDAD';
      },
    },
    // Visit date/time for a single activity ticket.
    fechaVisita: { type: Date },
    horaVisita: { type: String },
    precioTotal: { type: Number, required: true },
    descuento: { type: Number, default: 0 },
    cupon: { type: String },
    estado: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.CONFIRMADO },
    tipsPdfUrl: { type: String },
    motivoCancelacion: { type: String },
    fechaCancelacion: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
