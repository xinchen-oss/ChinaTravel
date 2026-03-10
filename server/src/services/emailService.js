import sgMail from '../config/sendgrid.js';
import config from '../config/env.js';
import fs from 'fs';
import path from 'path';

export const sendEmail = async ({ to, subject, html, attachments }) => {
  if (!config.sendgridApiKey) {
    console.log(`[Email simulado] Para: ${to} | Asunto: ${subject}`);
    if (attachments?.length) {
      console.log(`[Email simulado] Adjuntos: ${attachments.map(a => a.filename).join(', ')}`);
    }
    return;
  }

  try {
    const msg = {
      to,
      from: config.sendgridFromEmail,
      subject,
      html,
    };

    if (attachments?.length) {
      msg.attachments = attachments.map(att => ({
        content: att.content,
        filename: att.filename,
        type: att.type || 'application/pdf',
        disposition: 'attachment',
      }));
    }

    await sgMail.send(msg);
    console.log(`Email enviado a ${to}`);
  } catch (error) {
    console.error('Error enviando email:', error.message);
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
