import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import config from './config/env.js';
import errorHandler from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import cityRoutes from './routes/city.js';
import activityRoutes from './routes/activity.js';
import guideRoutes from './routes/guide.js';
import hotelRoutes from './routes/hotel.js';
import flightRoutes from './routes/flight.js';
import orderRoutes from './routes/order.js';
import cultureRoutes from './routes/culture.js';
import submissionRoutes from './routes/submission.js';
import uploadRoutes from './routes/upload.js';
import userRoutes from './routes/user.js';
import forumRoutes from './routes/forum.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({ origin: config.clientUrl || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { ok: false, error: 'Demasiadas peticiones, intenta de nuevo más tarde' },
});
app.use('/api/', limiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/ciudades', cityRoutes);
app.use('/api/actividades', activityRoutes);
app.use('/api/guias', guideRoutes);
app.use('/api/hoteles', hotelRoutes);
app.use('/api/vuelos', flightRoutes);
app.use('/api/pedidos', orderRoutes);
app.use('/api/cultura', cultureRoutes);
app.use('/api/solicitudes', submissionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/foro', forumRoutes);

// Error handler
app.use(errorHandler);

export default app;
