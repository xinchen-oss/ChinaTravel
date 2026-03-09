import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    nombreChino: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    descripcion: { type: String, required: true },
    imagenPortada: { type: String },
    imagenes: [String],
    destacada: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('City', citySchema);
