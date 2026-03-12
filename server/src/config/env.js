import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/chinatravel',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_in_production',
  jwtExpire: '7d',
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@chinatravel.com',
  gmailUser: process.env.GMAIL_USER,
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  uploadsDir: 'uploads',
};
