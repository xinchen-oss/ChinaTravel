import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String },
    ciudad: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    estrellas: { type: Number, min: 1, max: 5, required: true },
    precioPorNoche: { type: Number, required: true },
    imagen: { type: String },
    accesibilidad: {
      sillasRuedas: { type: Boolean, default: false },
      ascensor: { type: Boolean, default: false },
      habitacionAdaptada: { type: Boolean, default: false },
    },
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Hotel', hotelSchema);
