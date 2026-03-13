const mongoose = require('mongoose');
const config = require('./src/config/env.js');

async function run() {
  const uri = config.default?.mongoUri || config.mongoUri;
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const reviews = [
    // Pekín Imperial
    { usuario: '69b19a72ac41cb8d65278fae', referencia: '69aee9b688d6498883680ecc', puntuacion: 5, titulo: 'Increíble experiencia', comentario: 'La Gran Muralla me dejó sin palabras. El guía explicaba todo con mucho detalle y pasión. Totalmente recomendable para una primera visita a China.' },
    { usuario: '69b19a72ac41cb8d65278faf', referencia: '69aee9b688d6498883680ecc', puntuacion: 4, titulo: 'Muy bien organizado', comentario: 'Todo estaba perfectamente planificado. Los hoteles eran cómodos y la comida deliciosa. Solo le falta un poco más de tiempo libre para explorar.' },
    { usuario: '69b19a72ac41cb8d65278fb1', referencia: '69aee9b688d6498883680ecc', puntuacion: 5, titulo: 'Viaje soñado', comentario: 'Siempre quise visitar la Ciudad Prohibida y superó todas mis expectativas. La organización fue impecable.' },

    // Pekín Completo 5 Días
    { usuario: '69b19a72ac41cb8d65278fb0', referencia: '69aee9b688d6498883680ece', puntuacion: 5, titulo: 'Los mejores 5 días', comentario: 'Cada día fue una aventura diferente. Desde el Palacio de Verano hasta los hutongs, todo fue mágico. El guía hablaba español perfecto.' },
    { usuario: '69b19a72ac41cb8d65278fb2', referencia: '69aee9b688d6498883680ece', puntuacion: 4, titulo: 'Muy completo', comentario: 'El itinerario cubre todos los puntos importantes de Pekín. Las comidas incluidas eran auténticas y variadas. Repetiría sin duda.' },

    // Shanghái Moderna y Clásica
    { usuario: '69b19a72ac41cb8d65278fae', referencia: '69aee9b688d6498883680ecf', puntuacion: 5, titulo: 'Shanghái es impresionante', comentario: 'El contraste entre el Bund y Pudong es espectacular. Las vistas nocturnas desde la Torre de la Perla Oriental son inolvidables.' },
    { usuario: '69b19a72ac41cb8d65278fb1', referencia: '69aee9b688d6498883680ecf', puntuacion: 4, titulo: 'Ciudad fascinante', comentario: 'Me encantó la mezcla de modernidad y tradición. El Jardín Yuyuan es precioso. El guía nos llevó a restaurantes locales increíbles.' },
    { usuario: '69aee9b488d6498883680e60', referencia: '69aee9b688d6498883680ecf', puntuacion: 5, titulo: 'Perfecto para conocer Shanghái', comentario: 'Tres días bien aprovechados. El transporte estaba muy bien organizado y no perdimos tiempo. Lo recomiendo al 100%.' },

    // Chengdú - Pandas y Sabores
    { usuario: '69b19a72ac41cb8d65278faf', referencia: '69aee9b688d6498883680ed2', puntuacion: 5, titulo: 'Los pandas son adorables', comentario: 'Ver los pandas gigantes en su hábitat fue el sueño de mi vida. Además, la comida sichuanesa es riquísima aunque picante.' },
    { usuario: '69b19a72ac41cb8d65278fb0', referencia: '69aee9b688d6498883680ed2', puntuacion: 5, titulo: 'Comida espectacular', comentario: 'El hotpot de Chengdú es lo mejor que he probado. Los pandas bebés son una ternura. El guía conocía los mejores sitios locales.' },
    { usuario: '69b19a72ac41cb8d65278fb2', referencia: '69aee9b688d6498883680ed2', puntuacion: 4, titulo: 'Muy recomendable', comentario: 'Chengdú tiene un ambiente muy relajado. Los pandas son el plato fuerte pero la gastronomía no se queda atrás.' },

    // Harbin - Reino del Hielo
    { usuario: '69b19a72ac41cb8d65278fae', referencia: '69aee9b688d6498883680ed8', puntuacion: 5, titulo: 'Un mundo de hielo y nieve', comentario: 'El festival de esculturas de hielo es algo que hay que ver al menos una vez. Las luces de colores por la noche son mágicas. Abríguense bien.' },
    { usuario: '69b19a72ac41cb8d65278fb1', referencia: '69aee9b688d6498883680ed8', puntuacion: 4, titulo: 'Frío pero maravilloso', comentario: 'Hacía -25°C pero mereció la pena. Las esculturas gigantes de hielo iluminadas son impresionantes. El hotel tenía buena calefacción.' },

    // Chongqing - La Ciudad Montaña
    { usuario: '69b19a72ac41cb8d65278faf', referencia: '69aee9b688d6498883680ed5', puntuacion: 4, titulo: 'Ciudad única', comentario: 'Chongqing parece de ciencia ficción, construida sobre montañas. El hotpot de aquí es aún más picante que el de Chengdú. Fascinante.' },
    { usuario: '69b19a72ac41cb8d65278fb0', referencia: '69aee9b688d6498883680ed5', puntuacion: 5, titulo: 'La ciudad cyberpunk', comentario: 'Las vistas nocturnas del río Yangtsé son espectaculares. El monorraíl que pasa por los edificios es surrealista. Gran experiencia.' },

    // Guilin y Yangshuo
    { usuario: '69b19a72ac41cb8d65278fae', referencia: '69b02b10efda4615f9f923d6', puntuacion: 5, titulo: 'Paisajes de película', comentario: 'Navegar por el río Li entre las montañas kársticas es como estar dentro de una pintura china. Yangshuo tiene mucho encanto.' },
    { usuario: '69b19a72ac41cb8d65278fb2', referencia: '69b02b10efda4615f9f923d6', puntuacion: 5, titulo: 'Naturaleza pura', comentario: 'Los paisajes más bonitos que he visto en mi vida. El crucero por el río Li al amanecer es una experiencia inolvidable.' },

    // Xi'an Histórica
    { usuario: '69b19a72ac41cb8d65278fb1', referencia: '69aef26303038eb3b5d166dc', puntuacion: 5, titulo: 'Los Guerreros de Terracota', comentario: 'Ver el ejército de terracota en persona es impactante. Miles de soldados de arcilla cada uno con un rostro diferente. Impresionante.' },
    { usuario: '69aee9b488d6498883680e60', referencia: '69aef26303038eb3b5d166dc', puntuacion: 4, titulo: 'Historia viva', comentario: 'Xi\'an es una ciudad llena de historia. El barrio musulmán tiene la mejor comida callejera de China. Muy recomendable.' },

    // Cantón Gastronómico
    { usuario: '69b19a72ac41cb8d65278faf', referencia: '69aef26303038eb3b5d166df', puntuacion: 4, titulo: 'Paraíso gastronómico', comentario: 'El dim sum en Cantón es otro nivel. Probamos platos que nunca había visto en restaurantes chinos en España. Increíble.' },
    { usuario: '69b19a72ac41cb8d65278fb0', referencia: '69aef26303038eb3b5d166df', puntuacion: 5, titulo: 'Comer en Cantón es arte', comentario: 'Cada comida era una obra maestra. El guía nos llevó a mercados locales y restaurantes familiares. Comida auténtica y deliciosa.' },

    // Hangzhou
    { usuario: '69b19a72ac41cb8d65278fae', referencia: '69b02b10efda4615f9f923d4', puntuacion: 5, titulo: 'El Lago del Oeste es mágico', comentario: 'Hangzhou es la ciudad más romántica de China. Pasear por el Lago del Oeste al atardecer es una experiencia única. El té Longjing es exquisito.' },
    { usuario: '69b19a72ac41cb8d65278faf', referencia: '69b02b10efda4615f9f923d4', puntuacion: 4, titulo: 'Ciudad preciosa', comentario: 'Una ciudad muy agradable y tranquila. Los templos budistas rodeados de bambú son espectaculares. La ceremonia del té fue lo mejor.' },

    // Lhasa
    { usuario: '69b19a72ac41cb8d65278fb2', referencia: '69b02b10efda4615f9f923d8', puntuacion: 5, titulo: 'Experiencia espiritual', comentario: 'Lhasa te cambia la perspectiva de la vida. El Palacio Potala es majestuoso y los monasterios tienen una paz indescriptible. Viaje transformador.' },
    { usuario: '69b19a72ac41cb8d65278fb1', referencia: '69b02b10efda4615f9f923d8', puntuacion: 5, titulo: 'El techo del mundo', comentario: 'La altitud se nota pero merece la pena. Los paisajes tibetanos son de otro mundo. La cultura y religión budista te envuelven completamente.' },
  ];

  const mapped = reviews.map(r => ({
    ...r,
    tipo: 'GUIA',
    tipoRef: 'Guide',
    estado: 'APROBADO',
    usuario: new mongoose.Types.ObjectId(r.usuario),
    referencia: new mongoose.Types.ObjectId(r.referencia),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24*60*60*1000),
    updatedAt: new Date(),
  }));

  await db.collection('reviews').deleteMany({});
  const result = await db.collection('reviews').insertMany(mapped);
  console.log('Inserted', result.insertedCount, 'reviews');
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
