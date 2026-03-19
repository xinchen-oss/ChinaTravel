import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema(
  {
    aerolinea: { type: String, required: true, trim: true },
    origen: { type: String, required: true },
    destino: { type: String, required: true },
    ciudadDestino: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    precio: { type: Number, required: true },
    horaSalida: { type: String },
    horaLlegada: { type: String },
    duracionHoras: { type: Number },
    accesibilidad: {
      sillasRuedas: { type: Boolean, default: false },
      asistenciaEspecial: { type: Boolean, default: false },
    },
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Flight', flightSchema);
