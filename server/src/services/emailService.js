import nodemailer from 'nodemailer';
import config from '../config/env.js';
import fs from 'fs';
import path from 'path';

// Create Gmail SMTP transporter
let transporter = null;

if (config.gmailUser && config.gmailAppPassword && config.gmailAppPassword !== 'tu_app_password_aqui') {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.gmailUser,
      pass: config.gmailAppPassword,
    },
  });

  // Verify connection on startup
  transporter.verify()
    .then(() => console.log('✅ Gmail SMTP conectado correctamente'))
    .catch((err) => console.error('❌ Error conectando Gmail SMTP:', err.message));
}

export const sendEmail = async ({ to, subject, html, attachments }) => {
  if (!transporter) {
    console.log(`📧 [Email simulado] Para: ${to} | Asunto: ${subject}`);
    if (attachments?.length) {
      console.log(`📎 Adjuntos: ${attachments.map(a => a.filename).join(', ')}`);
    }
    return;
  }

  try {
    const mailOptions = {
      from: `"ChinaTravel" <${config.gmailUser}>`,
      to,
      subject,
      html,
    };

    if (attachments?.length) {
      mailOptions.attachments = attachments.map(att => ({
        filename: att.filename,
        content: Buffer.from(att.content, 'base64'),
        contentType: att.type || 'application/pdf',
      }));
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado a ${to} (${info.messageId})`);
  } catch (error) {
    console.error('❌ Error enviando email:', error.message);
  }
};

export const readFileAsBase64 = (filePath) => {
  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);
    return fs.readFileSync(absolutePath).toString('base64');
  } catch (err) {
    console.error('Error leyendo archivo para adjunto:', err.message);
    return null;
  }
};
