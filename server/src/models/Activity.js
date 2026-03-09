import mongoose from 'mongoose';
import { ACTIVITY_CATEGORIES } from '../utils/constants.js';

const activitySchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    ciudad: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    categoria: { type: String, enum: ACTIVITY_CATEGORIES, required: true },
    duracionHoras: { type: Number, required: true },
    precio: { type: Number, required: true, default: 0 },
    imagen: { type: String },
    consejos: [String],
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);
