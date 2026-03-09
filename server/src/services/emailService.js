import sgMail from '../config/sendgrid.js';
import config from '../config/env.js';

export const sendEmail = async ({ to, subject, html }) => {
  if (!config.sendgridApiKey) {
    console.log(`[Email simulado] Para: ${to} | Asunto: ${subject}`);
    return;
  }

  try {
    await sgMail.send({
      to,
      from: config.sendgridFromEmail,
      subject,
      html,
    });
    console.log(`Email enviado a ${to}`);
  } catch (error) {
    console.error('Error enviando email:', error.message);
  }
};
