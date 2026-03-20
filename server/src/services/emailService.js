import nodemailer from 'nodemailer';
import config from '../config/env.js';
import fs from 'fs';
import path from 'path';

let transporter = null;

if (config.mailtrapHost && config.mailtrapUser) {
  transporter = nodemailer.createTransport({
    host: config.mailtrapHost,
    port: Number(config.mailtrapPort) || 587,
    auth: {
      user: config.mailtrapUser,
      pass: config.mailtrapPass,
    },
  });

  transporter.verify()
    .then(() => console.log('✅ Mailtrap SMTP conectado correctamente'))
    .catch((err) => console.error('❌ Error conectando Mailtrap:', err.message));
}

let lastEmailTime = 0;

export const sendEmail = async ({ to, subject, html, attachments }) => {
  if (!transporter) {
    console.log(`📧 [Email simulado] Para: ${to} | Asunto: ${subject}`);
    if (attachments?.length) {
      console.log(`📎 Adjuntos: ${attachments.map(a => a.filename).join(', ')}`);
    }
    return;
  }

  // Rate limit: wait at least 1.5s between emails (Mailtrap free plan limit)
  const now = Date.now();
  const elapsed = now - lastEmailTime;
  if (elapsed < 1500) {
    await new Promise((r) => setTimeout(r, 1500 - elapsed));
  }

  try {
    const mailOptions = {
      from: '"ChinaTravel" <noreply@chinatravel.com>',
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

    lastEmailTime = Date.now();
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
