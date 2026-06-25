import mongoose from 'mongoose';

const activitySlotSchema = new mongoose.Schema(
  {
    actividad: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
    orden: { type: Number, required: true },
    horaInicio: { type: String },
    horaFin: { type: String },
  },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  {
    numeroDia: { type: Number, required: true },
    titulo: { type: String, required: true },
    actividades: [activitySlotSchema],
  },
  { _id: false }
);

const rutaSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    ciudad: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    dias: [daySchema],
    duracionDias: { type: Number, required: true },
    // Precio is derived from the activity tickets in `dias` (see computeRutaPrice).
    precio: { type: Number, default: 0 },
    imagen: { type: String },
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Ruta', rutaSchema);
