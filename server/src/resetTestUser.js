import mongoose from 'mongoose';
import config from './config/env.js';
import User from './models/User.js';

const TARGET = { email: 'user@chinatravel.com', password: 'user123', nombre: 'Usuario', role: 'USER' };

await mongoose.connect(config.mongoUri);
console.log('Conectado a MongoDB');

let user = await User.findOne({ email: TARGET.email });
if (user) {
  user.password = TARGET.password;
  user.isActive = true;
  user.isApproved = true;
  await user.save();
  console.log(`Contraseña restablecida para ${TARGET.email}`);
} else {
  user = await User.create(TARGET);
  console.log(`Usuario ${TARGET.email} creado`);
}

await mongoose.disconnect();
console.log('OK');
