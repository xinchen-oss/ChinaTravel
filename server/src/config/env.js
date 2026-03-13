import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/chinatravel',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_in_production',
  jwtExpire: '7d',
  mailtrapHost: process.env.MAILTRAP_HOST,
  mailtrapPort: process.env.MAILTRAP_PORT,
  mailtrapUser: process.env.MAILTRAP_USER,
  mailtrapPass: process.env.MAILTRAP_PASS,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  uploadsDir: 'uploads',
};
