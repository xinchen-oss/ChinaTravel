import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tipo: { type: String, enum: ['GUIA', 'HOTEL', 'ACTIVIDAD'], required: true },
    referencia: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'tipoRef' },
    tipoRef: { type: String, enum: ['Guide', 'Hotel', 'Activity'], required: true },
    puntuacion: { type: Number, required: true, min: 1, max: 5 },
    titulo: { type: String, trim: true, maxlength: 100 },
    comentario: { type: String, required: true, maxlength: 1000 },
    estado: { type: String, enum: ['PENDIENTE', 'APROBADO', 'RECHAZADO'], default: 'PENDIENTE' },
  },
  { timestamps: true }
);

reviewSchema.index({ usuario: 1, tipo: 1, referencia: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
