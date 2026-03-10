/**
 * Smart chatbot service — rule-based travel assistant for ChinaTravel.
 * Answers common questions about China travel in Spanish.
 * Returns null when it can't answer → triggers email fallback.
 */

const knowledgeBase = [
  {
    keywords: ['visa', 'visado', 'pasaporte', 'entrar a china', 'necesito visa'],
    answer: 'Para viajar a China necesitas un visado. Los ciudadanos españoles y latinoamericanos deben solicitar una visa turística (L) en el consulado chino de su país. El trámite suele tardar 4-7 días hábiles. Necesitarás: pasaporte vigente (mínimo 6 meses), foto reciente, formulario de solicitud y reserva de vuelo/hotel. Algunos países tienen exención de visa para tránsitos de 72-144 horas.',
  },
  {
    keywords: ['moneda', 'dinero', 'yuan', 'renminbi', 'cambio', 'pagar', 'efectivo', 'tarjeta'],
    answer: 'La moneda oficial es el Yuan Renminbi (CNY/RMB). 1 EUR ≈ 7.5-8 CNY aproximadamente. En China se usa mucho el pago móvil (WeChat Pay, Alipay). Recomendamos llevar algo de efectivo para mercados y pequeños comercios. Las tarjetas Visa/Mastercard se aceptan en hoteles grandes y centros comerciales. Puedes cambiar divisas en el aeropuerto o bancos.',
  },
  {
    keywords: ['clima', 'tiempo', 'temperatura', 'cuando viajar', 'mejor época', 'temporada'],
    answer: 'China tiene un clima muy variado. Las mejores épocas para viajar son primavera (abril-mayo) y otoño (septiembre-noviembre) con temperaturas agradables. El verano (junio-agosto) es caluroso y húmedo. El invierno (diciembre-febrero) es frío en el norte pero agradable en el sur. Evita la Semana Dorada (1-7 octubre) y el Año Nuevo Chino por aglomeraciones.',
  },
  {
    keywords: ['idioma', 'hablan', 'inglés', 'español', 'comunicar', 'traductor', 'chino'],
    answer: 'El idioma oficial es el mandarín (普通话). El inglés tiene uso limitado fuera de hoteles internacionales y zonas turísticas. Recomendamos: descargar Google Translate o Pleco con paquete offline, llevar un traductor electrónico, y aprender frases básicas. Nuestros circuitos incluyen guía en español, así que no tendrás problemas de comunicación.',
  },
  {
    keywords: ['internet', 'vpn', 'wifi', 'google', 'whatsapp', 'redes sociales'],
    answer: 'En China están bloqueados Google, WhatsApp, Facebook, Instagram y Twitter. Necesitarás una VPN para acceder a estos servicios. Recomendamos contratar una VPN antes de viajar (ExpressVPN, NordVPN). El WiFi es muy común en hoteles y restaurantes. También puedes comprar una tarjeta SIM local o un router pocket WiFi en el aeropuerto.',
  },
  {
    keywords: ['seguro', 'seguridad', 'peligro', 'seguro de viaje', 'emergencia'],
    answer: 'China es un país muy seguro para turistas. La criminalidad violenta es muy baja. Precauciones normales: cuidar pertenencias en zonas turísticas concurridas. Todos nuestros circuitos incluyen seguro de viaje con cobertura médica. En emergencias: policía 110, ambulancia 120, bomberos 119. La embajada española en Pekín: +86 10 6532 3629.',
  },
  {
    keywords: ['comida', 'comer', 'gastronomía', 'restaurante', 'plato', 'picante', 'vegetariano'],
    answer: 'La gastronomía china es increíblemente variada. Cada región tiene su estilo: Sichuan (picante), Cantón (dim sum), Pekín (pato laqueado), Shanghái (xiaolongbao). Para vegetarianos, hay opciones en templos budistas y restaurantes modernos. Nuestros circuitos incluyen comidas con platos típicos seleccionados. El agua del grifo NO es potable — bebe siempre agua embotellada.',
  },
  {
    keywords: ['transporte', 'tren', 'avión', 'metro', 'taxi', 'moverse', 'tren bala'],
    answer: 'China tiene una red de transporte excelente. El tren de alta velocidad (高铁) conecta las principales ciudades a hasta 350 km/h. El metro existe en todas las grandes ciudades. Los taxis son baratos — usa la app DiDi. Vuelos internos son frecuentes y asequibles. Nuestros circuitos incluyen todos los traslados internos.',
  },
  {
    keywords: ['hotel', 'alojamiento', 'dormir', 'hospedaje', 'hostal'],
    answer: 'Nuestros circuitos incluyen hoteles de 4-5 estrellas seleccionados. Si viajas por tu cuenta, hay opciones desde hostales (~50-100 CNY) hasta hoteles de lujo. Booking.com funciona en China pero muchos usan Ctrip/Trip.com. Los hoteles requieren pasaporte para el check-in por ley china.',
  },
  {
    keywords: ['precio', 'costo', 'cuánto', 'presupuesto', 'barato', 'caro'],
    answer: 'China ofrece muy buena relación calidad-precio. Un presupuesto diario orientativo: mochilero ~200-300 CNY, medio ~500-800 CNY, confort ~1000+ CNY. Nuestros circuitos incluyen hotel, comidas, guía en español, transporte y entradas — consulta los precios en la sección de Circuitos.',
  },
  {
    keywords: ['muralla', 'gran muralla', 'great wall'],
    answer: 'La Gran Muralla China tiene más de 21.000 km. Las secciones más populares cerca de Pekín son: Badaling (más accesible, con teleférico), Mutianyu (menos masificada, muy restaurada), Jinshanling (para senderistas) y Simatai (sección original sin restaurar). Recomendamos llevar calzado cómodo y agua. Nuestro circuito de Pekín incluye visita a la muralla.',
  },
  {
    keywords: ['circuito', 'tour', 'guía', 'itinerario', 'viaje organizado', 'paquete'],
    answer: 'Ofrecemos circuitos organizados por las principales ciudades de China con guía en español, hoteles 4-5★, comidas incluidas y seguro de viaje. Puedes personalizar tu itinerario cambiando actividades. Consulta todos nuestros circuitos en la sección "Circuitos" de la web. Si tienes necesidades especiales, escríbenos y diseñamos un viaje a medida.',
  },
  {
    keywords: ['equipaje', 'maleta', 'llevar', 'ropa', 'qué llevar'],
    answer: 'Recomendamos: ropa cómoda y por capas, calzado para caminar, adaptador de enchufe (tipo A/C/I), protector solar, medicamentos personales, copia del pasaporte, VPN descargada, y una pequeña mochila para excursiones diarias. En verano ropa ligera; en invierno abrigo grueso para el norte.',
  },
  {
    keywords: ['hola', 'buenos días', 'buenas tardes', 'hey', 'qué tal'],
    answer: '¡Hola! 👋 Soy el asistente virtual de ChinaTravel. Puedo ayudarte con información sobre visas, clima, moneda, transporte, gastronomía, seguridad y nuestros circuitos por China. ¿En qué puedo ayudarte?',
  },
  {
    keywords: ['gracias', 'muchas gracias', 'genial', 'perfecto'],
    answer: '¡De nada! 😊 Si tienes más preguntas sobre tu viaje a China, no dudes en preguntarme. ¡Estoy aquí para ayudarte!',
  },
  {
    keywords: ['vacuna', 'salud', 'médico', 'enfermedad', 'hospital', 'farmacia'],
    answer: 'No hay vacunas obligatorias para China, pero se recomienda tener al día: hepatitis A/B, tétanos y fiebre tifoidea. Los hospitales en grandes ciudades son modernos. Hay farmacias (药店) por todas partes. Lleva tus medicamentos con receta traducida al inglés. Nuestros circuitos incluyen seguro médico de viaje.',
  },
];

/**
 * Find the best matching answer for a user message.
 * Returns { answer, confidence } or null if no match.
 */
export function getAutoReply(message) {
  const msg = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    let score = 0;
    for (const kw of entry.keywords) {
      const kwNorm = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (msg.includes(kwNorm)) {
        score += kwNorm.length; // longer keyword matches = higher confidence
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  // Require minimum match quality
  if (bestScore >= 3 && bestMatch) {
    return { answer: bestMatch.answer, confidence: Math.min(bestScore / 10, 1) };
  }

  return null;
}

/**
 * Get a "can't answer" message suggesting email escalation.
 */
export function getFallbackMessage() {
  return 'No tengo suficiente información para responder a esa pregunta. ¿Te gustaría que un agente de nuestro equipo te contacte por email? Haz clic en "Contactar agente" y te responderemos lo antes posible.';
}
