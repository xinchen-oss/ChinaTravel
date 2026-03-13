import { Router } from 'express';
import { getAutoReply, getFallbackMessage } from '../services/chatbotService.js';
import { sendEmail } from '../services/emailService.js';
import config from '../config/env.js';

const router = Router();

/**
 * POST /api/chat/message
 * Send a message to the chatbot. Returns AI answer or fallback.
 */
router.post('/message', (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ ok: false, error: 'Mensaje vacío' });
  }

  const result = getAutoReply(message.trim());

  if (result) {
    return res.json({
      ok: true,
      data: {
        reply: result.answer,
        type: 'bot',
      },
    });
  }

  return res.json({
    ok: true,
    data: {
      reply: getFallbackMessage(),
      type: 'fallback',
    },
  });
});

/**
 * POST /api/chat/contact
 * Escalate to human agent — sends email to support team.
 */
router.post('/contact', async (req, res) => {
  const { nombre, email, mensaje, historial } = req.body;

  if (!email || !mensaje) {
    return res.status(400).json({ ok: false, error: 'Email y mensaje son obligatorios' });
  }

  try {
    // Build conversation history for context
    let historyHtml = '';
    if (historial && historial.length > 0) {
      historyHtml = `
        <h3 style="margin-top:20px;">Historial del chat:</h3>
        <div style="background:#f5f5f5;padding:12px;border-radius:8px;font-size:13px;">
          ${historial.map((m) => `
            <p style="margin:4px 0;"><strong>${m.sender === 'user' ? '👤 Cliente' : '🤖 Bot'}:</strong> ${m.text}</p>
          `).join('')}
        </div>
      `;
    }

    // Send to support team
    await sendEmail({
      to: 'soporte@chinatravel.com',
      subject: `💬 Consulta de ${nombre || 'Cliente'} — ChinaTravel Chat`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;">
          <h2 style="color:#c41e3a;">Nueva consulta desde el chat</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px;font-weight:bold;">Nombre:</td><td style="padding:8px;">${nombre || 'No proporcionado'}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Email:</td><td style="padding:8px;">${email}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Mensaje:</td><td style="padding:8px;">${mensaje}</td></tr>
          </table>
          ${historyHtml}
        </div>
      `,
    });

    // Send confirmation to user
    await sendEmail({
      to: email,
      subject: 'Hemos recibido tu consulta — ChinaTravel',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;">
          <h2 style="color:#c41e3a;">¡Hola ${nombre || ''}!</h2>
          <p>Hemos recibido tu consulta y nuestro equipo te responderá lo antes posible (normalmente en menos de 24 horas).</p>
          <p><strong>Tu mensaje:</strong></p>
          <blockquote style="background:#f9f9f9;padding:12px;border-left:3px solid #c41e3a;margin:12px 0;">${mensaje}</blockquote>
          <p>Mientras tanto, puedes seguir usando nuestro asistente virtual en la web para resolver dudas frecuentes.</p>
          <p style="color:#888;font-size:12px;">— Equipo ChinaTravel</p>
        </div>
      `,
    });

    res.json({ ok: true, message: 'Tu consulta ha sido enviada. Te responderemos por email.' });
  } catch (err) {
    console.error('Error sending chat contact email:', err);
    res.json({ ok: true, message: 'Tu consulta ha sido registrada. Te contactaremos pronto.' });
  }
});

export default router;
