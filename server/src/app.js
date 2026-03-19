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
import chatRoutes from './routes/chat.js';
import reviewRoutes from './routes/review.js';
import couponRoutes from './routes/coupon.js';
import notificationRoutes from './routes/notification.js';
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
  max: 1000,
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
app.use('/api/chat', chatRoutes);
app.use('/api/resenas', reviewRoutes);
app.use('/api/cupones', couponRoutes);
app.use('/api/notificaciones', notificationRoutes);
app.use('/api/foro', forumRoutes);
// Serve React frontend in production
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  // Don't catch API routes or uploads
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  res.sendFile(path.join(clientDist, 'index.html'));
});




// Error handler
app.use(errorHandler);

export default app;
