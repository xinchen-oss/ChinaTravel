import { useState } from 'react';
import './FAQPage.css';

const FAQ_DATA = [
  {
    categoria: 'Visas y documentación',
    preguntas: [
      { q: '¿Necesito visa para viajar a China?', a: 'Sí, la mayoría de nacionalidades necesitan una visa turística (L). Debes solicitarla en el consulado chino de tu país con al menos 2 semanas de antelación. Necesitarás pasaporte vigente (mínimo 6 meses), foto reciente, formulario y reserva de vuelo/hotel.' },
      { q: '¿Cuánto tarda en tramitarse la visa?', a: 'El trámite estándar tarda 4-7 días hábiles. Hay opciones de tramitación urgente (2-3 días) con coste adicional.' },
      { q: '¿Qué documentos necesito?', a: 'Pasaporte con validez mínima de 6 meses, 2 fotos carnet recientes, formulario de solicitud, reserva de vuelo y hotel, y seguro de viaje.' },
    ],
  },
  {
    categoria: 'Pagos y moneda',
    preguntas: [
      { q: '¿Qué moneda se usa en China?', a: 'El Yuan Renminbi (CNY/RMB). 1 EUR ≈ 7.5-8 CNY aproximadamente. Se recomienda llevar algo de efectivo y una tarjeta internacional.' },
      { q: '¿Puedo pagar con tarjeta?', a: 'Las tarjetas Visa/Mastercard se aceptan en hoteles grandes y centros comerciales. En China se usa mucho el pago móvil (WeChat Pay, Alipay). Para turistas, recomendamos llevar efectivo para mercados.' },
      { q: '¿Los precios incluyen impuestos?', a: 'Sí, todos los precios mostrados en nuestra web incluyen impuestos. No hay cargos ocultos.' },
    ],
  },
  {
    categoria: 'Circuitos y reservas',
    preguntas: [
      { q: '¿Puedo personalizar mi itinerario?', a: 'Sí, en cada circuito puedes cambiar actividades por alternativas de la misma categoría. Antes de pagar verás tu itinerario personalizado completo.' },
      { q: '¿Qué incluye el precio del circuito?', a: 'Incluye el itinerario con todas las actividades y entradas. Hotel, vuelo y seguro se seleccionan y pagan por separado durante el checkout.' },
      { q: '¿Puedo cancelar mi reserva?', a: 'Sí. Cancelaciones dentro de las primeras 48 horas reciben reembolso completo. Después de 48 horas no se aplica reembolso. Puedes cancelar desde tu panel de usuario.' },
      { q: '¿Cómo recibo mi factura?', a: 'Al confirmar tu pedido, recibirás un email con la factura detallada y un PDF con tips de viaje.' },
    ],
  },
  {
    categoria: 'Viaje y logística',
    preguntas: [
      { q: '¿Cuál es la mejor época para viajar a China?', a: 'Primavera (abril-mayo) y otoño (septiembre-noviembre) son ideales. Evita la Semana Dorada (1-7 octubre) y el Año Nuevo Chino por aglomeraciones.' },
      { q: '¿Funciona internet normalmente en China?', a: 'Google, WhatsApp, Facebook e Instagram están bloqueados. Necesitarás una VPN. Recomendamos descargarla antes de viajar.' },
      { q: '¿Los guías hablan español?', a: 'Sí, todos nuestros circuitos incluyen guía profesional de habla hispana.' },
      { q: '¿Es seguro viajar a China?', a: 'Sí, China es uno de los países más seguros del mundo para turistas. La criminalidad violenta es muy baja. Solo hay que tener precauciones normales con pertenencias en zonas concurridas.' },
    ],
  },
  {
    categoria: 'Cuenta y privacidad',
    preguntas: [
      { q: '¿Cómo cambio mi contraseña?', a: 'Ve a Mi cuenta → Mi perfil → sección "Cambiar contraseña". Necesitarás tu contraseña actual.' },
      { q: '¿Mis datos están protegidos?', a: 'Sí, cumplimos con el RGPD. Tus datos personales se almacenan de forma segura y nunca se comparten con terceros sin tu consentimiento. Consulta nuestra Política de Privacidad.' },
      { q: '¿Puedo eliminar mi cuenta?', a: 'Sí, contacta con nuestro equipo de soporte a través del chat y procesaremos tu solicitud.' },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState({});

  const toggle = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Centro de ayuda</h1>
        <p className="page-subtitle">Encuentra respuestas a las preguntas más frecuentes</p>

        <div className="faq-content">
          {FAQ_DATA.map((section, si) => (
            <div key={si} className="faq-section">
              <h2 className="faq-section__title">{section.categoria}</h2>
              <div className="faq-list">
                {section.preguntas.map((item, qi) => {
                  const key = `${si}-${qi}`;
                  const isOpen = openItems[key];
                  return (
                    <div key={qi} className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
                      <button
                        className="faq-item__question"
                        onClick={() => toggle(key)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${key}`}
                      >
                        <span>{item.q}</span>
                        <span className="faq-item__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && <div className="faq-item__answer" id={`faq-answer-${key}`} role="region" aria-label={item.q}>{item.a}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
