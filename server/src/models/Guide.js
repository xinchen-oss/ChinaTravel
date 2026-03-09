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

const guideSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    ciudad: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    dias: [daySchema],
    duracionDias: { type: Number, required: true },
    precio: { type: Number, required: true },
    imagen: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Guide', guideSchema);
