// Plantilla HTML compartida para todos los emails transaccionales de ChinaTravel.
// Mantiene una cabecera/pie consistentes para que todos los correos se vean igual.
export const emailWrapper = (content) => `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:#c41e3a;color:white;padding:24px;text-align:center;">
      <h1 style="margin:0;font-size:28px;letter-spacing:1px;">ChinaTravel</h1>
      <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">Descubre China con nosotros</p>
    </div>
    <div style="padding:30px 24px;background:#f9f9f9;">
      ${content}
    </div>
    <div style="padding:16px 24px;text-align:center;background:#1a1a2e;color:rgba(255,255,255,0.5);font-size:11px;">
      <p style="margin:0;">ChinaTravel &copy; ${new Date().getFullYear()} — Todos los derechos reservados</p>
      <p style="margin:4px 0 0;">Este es un email automático, por favor no respondas.</p>
    </div>
  </div>
`;

// Botón de acción reutilizable (CTA) con el color de marca.
export const emailButton = (url, label) => `
  <div style="text-align:center;margin:28px 0 8px;">
    <a href="${url}" style="background:linear-gradient(135deg,#c41e3a,#a01830);color:white;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;box-shadow:0 4px 12px rgba(196,30,58,0.3);">${label}</a>
  </div>
`;
