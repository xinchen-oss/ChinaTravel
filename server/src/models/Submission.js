import mongoose from 'mongoose';
import { SUBMISSION_STATUS, SUBMISSION_TYPES } from '../utils/constants.js';

const submissionSchema = new mongoose.Schema(
  {
    comercial: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tipoContenido: { type: String, enum: SUBMISSION_TYPES, required: true },
    contenido: { type: mongoose.Schema.Types.Mixed, required: true },
    estado: { type: String, enum: Object.values(SUBMISSION_STATUS), default: SUBMISSION_STATUS.PENDIENTE },
    comentarioAdmin: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Submission', submissionSchema);
