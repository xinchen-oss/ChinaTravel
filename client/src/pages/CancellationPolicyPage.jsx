import './FAQPage.css';

export default function CancellationPolicyPage() {
  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Políticas de cancelación y reembolsos</h1>
        <p className="page-subtitle">Conoce nuestras condiciones antes de reservar</p>

        <div className="faq-content policy-content">
          <section className="policy-section">
            <h2>1. Cancelación gratuita (dentro de 48 horas)</h2>
            <p>Puedes cancelar tu reserva de forma gratuita durante las primeras <strong>48 horas</strong> después de realizar el pedido. Recibirás un reembolso completo del 100% del importe pagado.</p>
          </section>

          <section className="policy-section">
            <h2>2. Cancelación tardía (después de 48 horas)</h2>
            <p>Las cancelaciones realizadas después de las 48 horas desde la compra <strong>no tienen derecho a reembolso</strong>. El pedido quedará marcado como cancelado pero no se procesará devolución.</p>
          </section>

          <section className="policy-section">
            <h2>3. Cómo cancelar</h2>
            <p>Para cancelar un pedido:</p>
            <ol>
              <li>Inicia sesión en tu cuenta</li>
              <li>Ve a <strong>Mi cuenta → Mis pedidos</strong></li>
              <li>Haz clic en el pedido que deseas cancelar</li>
              <li>Pulsa el botón <strong>"Cancelar pedido"</strong></li>
              <li>Confirma la cancelación indicando el motivo</li>
            </ol>
          </section>

          <section className="policy-section">
            <h2>4. Reembolsos</h2>
            <p>Los reembolsos aprobados se procesan en un plazo de <strong>5-10 días hábiles</strong> y se devuelven al método de pago original. Recibirás una notificación por email cuando se procese tu reembolso.</p>
          </section>

          <section className="policy-section">
            <h2>5. Modificaciones</h2>
            <p>Si deseas modificar tu itinerario sin cancelar el pedido, contacta con nuestro equipo de atención al cliente a través del chat de la web. Haremos lo posible por acomodar tus cambios sin coste adicional.</p>
          </section>

          <section className="policy-section">
            <h2>6. Circunstancias excepcionales</h2>
            <p>En casos de fuerza mayor (desastres naturales, pandemias, restricciones gubernamentales), ofrecemos:</p>
            <ul>
              <li>Reembolso completo independientemente del plazo</li>
              <li>Cambio de fechas sin coste</li>
              <li>Crédito para futuras reservas</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>7. Cupones y promociones</h2>
            <p>Si tu pedido incluía un cupón de descuento y se procesa el reembolso, el cupón será restaurado para su uso futuro (si aún está dentro de su periodo de validez).</p>
          </section>

          <section className="policy-section">
            <h2>8. Contacto</h2>
            <p>Para cualquier duda sobre cancelaciones o reembolsos, utiliza nuestro chat de atención al cliente o escríbenos un email. Nuestro equipo responde en menos de 24 horas.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
