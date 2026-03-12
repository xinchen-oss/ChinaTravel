import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../utils/constants.js';

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    apellidos: { type: String, trim: true, default: '' },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, 'La contraseña es obligatoria'], minlength: 6, select: false },
    telefono: { type: String, trim: true, default: '' },
    fechaNacimiento: { type: Date },
    genero: { type: String, enum: ['', 'MASCULINO', 'FEMENINO', 'OTRO', 'PREFIERO_NO_DECIR'], default: '' },
    nacionalidad: { type: String, trim: true, default: '' },
    pasaporte: { type: String, trim: true, default: '' },
    direccion: {
      calle: { type: String, trim: true, default: '' },
      ciudad: { type: String, trim: true, default: '' },
      codigoPostal: { type: String, trim: true, default: '' },
      pais: { type: String, trim: true, default: '' },
    },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
    empresaNombre: { type: String, trim: true, default: '' },
    empresaCIF: { type: String, trim: true, default: '' },
    motivoComercial: { type: String, trim: true, default: '' },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
