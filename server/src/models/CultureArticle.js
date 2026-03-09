import mongoose from 'mongoose';
import { CULTURE_CATEGORIES } from '../utils/constants.js';

const cultureArticleSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    contenido: { type: String, required: true },
    resumen: { type: String },
    ciudad: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    categoria: { type: String, enum: CULTURE_CATEGORIES, required: true },
    imagen: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('CultureArticle', cultureArticleSchema);
