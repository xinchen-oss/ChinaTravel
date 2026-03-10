import mongoose from 'mongoose';
import connectDB from './config/db.js';
import City from './models/City.js';
import Activity from './models/Activity.js';
import Guide from './models/Guide.js';
import Hotel from './models/Hotel.js';
import Flight from './models/Flight.js';
import CultureArticle from './models/CultureArticle.js';

const seed = async () => {
  await connectDB();

  // ========== 8 NEW CITIES ==========
  const cities = await City.create([
    {
      nombre: 'Hangzhou', nombreChino: '杭州', slug: 'hangzhou',
      descripcion: 'La ciudad del Lago del Oeste, considerada el paraíso en la tierra por Marco Polo. Capital del té Longjing, templos budistas milenarios, pagodas junto al agua y una de las ciudades más románticas de China.',
      imagenPortada: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Guilin', nombreChino: '桂林', slug: 'guilin',
      descripcion: 'Famosa por sus montañas kársticas y el río Li, Guilin es el paisaje más icónico de China, impreso en el billete de 20 yuanes. Arrozales en terrazas, cuevas de estalactitas y pueblos antiguos.',
      imagenPortada: 'https://images.unsplash.com/photo-1537531383496-e3cdba5e457c?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Lhasa', nombreChino: '拉萨', slug: 'lhasa',
      descripcion: 'Capital del Tíbet a 3.650m de altitud. Hogar del Palacio de Potala, el templo de Jokhang y monasterios budistas tibetanos. Una experiencia espiritual única en el techo del mundo.',
      imagenPortada: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Suzhou', nombreChino: '苏州', slug: 'suzhou',
      descripcion: 'La Venecia de Oriente: jardines clásicos chinos (Patrimonio UNESCO), canales milenarios, pagodas y la mejor seda de China. Una ciudad que encarna la elegancia tradicional china.',
      imagenPortada: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80',
      destacada: false,
    },
    {
      nombre: 'Kunming', nombreChino: '昆明', slug: 'kunming',
      descripcion: 'La Ciudad de la Eterna Primavera, capital de Yunnan. Puerta de entrada a las maravillas naturales del suroeste: bosques de piedra, montañas nevadas, minorías étnicas y la gastronomía más diversa de China.',
      imagenPortada: 'https://images.unsplash.com/photo-1558005137-d9619a5c539f?w=800&q=80',
      destacada: false,
    },
    {
      nombre: 'Lijiang', nombreChino: '丽江', slug: 'lijiang',
      descripcion: 'Antigua ciudad Naxi (Patrimonio UNESCO) al pie de la Montaña del Dragón de Jade. Calles empedradas, canales, puentes de piedra y una cultura única que mezcla tradiciones chinas, tibetanas y Naxi.',
      imagenPortada: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Shenzhen', nombreChino: '深圳', slug: 'shenzhen',
      descripcion: 'De pueblo pesquero a megalópolis tecnológica en 40 años. Capital mundial de la tecnología, sede de Huawei, Tencent y DJI. Arquitectura futurista, parques temáticos y la frontera con Hong Kong.',
      imagenPortada: 'https://images.unsplash.com/photo-1533552689071-33be96f7d31e?w=800&q=80',
      destacada: false,
    },
    {
      nombre: 'Dunhuang', nombreChino: '敦煌', slug: 'dunhuang',
      descripcion: 'Oasis en el desierto del Gobi y parada clave de la antigua Ruta de la Seda. Famosa por las Cuevas de Mogao con pinturas budistas de 1.600 años, dunas de arena cantantes y lagos en forma de media luna.',
      imagenPortada: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&q=80',
      destacada: true,
    },
  ]);
  console.log('8 nuevas ciudades creadas');

  const [hangzhou, guilin, lhasa, suzhou, kunming, lijiang, shenzhen, dunhuang] = cities;

  // ========== HANGZHOU ACTIVITIES ==========
  const hzActs = await Activity.create([
    { nombre: 'Lago del Oeste en barco', descripcion: 'Paseo en barco tradicional por el Lago del Oeste, uno de los paisajes más bellos de China. Patrimonio UNESCO. Pagodas, puentes y jardines reflejados en el agua.', ciudad: hangzhou._id, categoria: 'NATURALEZA', duracionHoras: 2.5, precio: 20, consejos: ['El mejor momento es al amanecer con la niebla', 'El barco pasa junto a la Pagoda Leifeng'] },
    { nombre: 'Plantaciones de té Longjing', descripcion: 'Visita a las plantaciones del té verde más famoso de China. Degustación, paseo entre campos de té y demostración de la ceremonia del té.', ciudad: hangzhou._id, categoria: 'CULTURAL', duracionHoras: 3, precio: 25, consejos: ['Compra té directamente a los agricultores', 'La cosecha de primavera es la mejor'] },
    { nombre: 'Templo Lingyin', descripcion: 'Uno de los monasterios budistas más grandes y antiguos de China (328 d.C.). Estatuas talladas en roca, incienso, monjes y una atmósfera de profunda espiritualidad.', ciudad: hangzhou._id, categoria: 'HISTORICO', duracionHoras: 2.5, precio: 15, consejos: ['El Buda tallado en la roca del exterior es impresionante', 'Llega temprano para evitar multitudes'] },
    { nombre: 'Calle Hefang', descripcion: 'Calle histórica peatonal con tiendas de artesanía, farmacia tradicional centenaria, espectáculos callejeros y comida local.', ciudad: hangzhou._id, categoria: 'COMPRAS', duracionHoras: 2, precio: 0, consejos: ['La farmacia Hu Qing Yu Tang es un museo en sí misma', 'Prueba el pollo mendigante'] },
    { nombre: 'Espectáculo Impression West Lake', descripcion: 'Show nocturno al aire libre dirigido por Zhang Yimou (director de la ceremonia olímpica de Pekín). Danza sobre el agua con las montañas como telón de fondo.', ciudad: hangzhou._id, categoria: 'CULTURAL', duracionHoras: 1.5, precio: 40, consejos: ['Solo de marzo a noviembre', 'Reserva con antelación'] },
    { nombre: 'Pagoda de las Seis Armonías', descripcion: 'Pagoda de 60 metros construida en el año 970 junto al río Qiantang. Vistas panorámicas y el famoso maremoto del río Qiantang en septiembre.', ciudad: hangzhou._id, categoria: 'HISTORICO', duracionHoras: 1.5, precio: 10, consejos: ['Sube los 13 pisos para las vistas', 'En septiembre el maremoto es espectacular'] },
    { nombre: 'Pollo mendigante de Hangzhou', descripcion: 'Degustación del plato más famoso de Hangzhou: pollo envuelto en barro y hojas de loto, cocido durante horas. Crujiente por fuera, tierno por dentro.', ciudad: hangzhou._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 18, consejos: ['El restaurante Louwailou junto al lago es el más histórico', 'Prueba también el cerdo Dongpo'] },
  ]);

  // ========== GUILIN ACTIVITIES ==========
  const glActs = await Activity.create([
    { nombre: 'Crucero por el río Li', descripcion: 'Navegación de 4 horas por el río Li desde Guilin hasta Yangshuo. El paisaje kárstico más famoso del mundo: montañas de formas imposibles reflejadas en aguas cristalinas.', ciudad: guilin._id, categoria: 'NATURALEZA', duracionHoras: 4.5, precio: 45, consejos: ['Es el paisaje del billete de 20 yuanes', 'La cubierta superior tiene las mejores vistas'] },
    { nombre: 'Calle Yangshuo', descripcion: 'Pueblo encantador al final del crucero por el Li. Calles animadas, restaurantes, bares y un ambiente mochilero internacional rodeado de montañas kársticas.', ciudad: guilin._id, categoria: 'CULTURAL', duracionHoras: 3, precio: 0, consejos: ['West Street es la calle principal', 'Alquila una bicicleta eléctrica para explorar los alrededores'] },
    { nombre: 'Arrozales en terraza de Longji', descripcion: 'Arrozales tallados en las montañas durante 700 años por el pueblo Zhuang. Patrimonio agrícola espectacular que cambia de color con las estaciones.', ciudad: guilin._id, categoria: 'NATURALEZA', duracionHoras: 6, precio: 30, consejos: ['En mayo-junio los arrozales inundados son como espejos', 'En octubre el arroz dorado es espectacular'] },
    { nombre: 'Cueva Flauta de Caña', descripcion: 'Cueva de piedra caliza iluminada con colores, con estalactitas y estalagmitas de formas fantásticas. Inscripciones de más de 1.200 años.', ciudad: guilin._id, categoria: 'NATURALEZA', duracionHoras: 1.5, precio: 12, consejos: ['Las formaciones rocosas tienen nombres divertidos', 'La iluminación es un poco kitsch pero impresionante'] },
    { nombre: 'Colina Trompa de Elefante', descripcion: 'El símbolo de Guilin: una colina junto al río que parece un elefante bebiendo agua. Vistas panorámicas de la ciudad y el río.', ciudad: guilin._id, categoria: 'NATURALEZA', duracionHoras: 1.5, precio: 8, consejos: ['Las mejores fotos son desde el otro lado del río', 'De noche la iluminación es bonita'] },
    { nombre: 'Fideos de arroz de Guilin', descripcion: 'Degustación de los mifen (fideos de arroz) de Guilin, el plato local por excelencia. Decenas de toppings y estilos diferentes.', ciudad: guilin._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 5, consejos: ['Prueba los mifen con caldo de hueso y ternera', 'Son el desayuno, almuerzo y cena de los locales'] },
    { nombre: 'Rafting en bambú por el río Yulong', descripcion: 'Descenso tranquilo en balsa de bambú por el río Yulong, rodeado de montañas kársticas. Más íntimo y menos turístico que el río Li.', ciudad: guilin._id, categoria: 'AVENTURA', duracionHoras: 2.5, precio: 20, consejos: ['Más tranquilo que el río Li', 'Lleva protección solar'] },
  ]);

  // ========== LHASA ACTIVITIES ==========
  const lhActs = await Activity.create([
    { nombre: 'Palacio de Potala', descripcion: 'Antigua residencia del Dalai Lama, encaramada a 3.700m de altitud. 1.000 habitaciones, 10.000 santuarios y una de las estructuras más impresionantes del planeta.', ciudad: lhasa._id, categoria: 'HISTORICO', duracionHoras: 3, precio: 35, consejos: ['Solo se permiten 5.000 visitantes al día, reserva con mucha antelación', 'La subida es dura por la altitud, ve despacio'] },
    { nombre: 'Templo de Jokhang', descripcion: 'El templo más sagrado del budismo tibetano, construido en el año 647. Peregrinos postrándose, mantequilla de yak ardiendo y una atmósfera de devoción única.', ciudad: lhasa._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 15, consejos: ['Camina en sentido horario como los peregrinos', 'La terraza tiene vistas al Potala'] },
    { nombre: 'Calle Barkhor', descripcion: 'Circuito de peregrinación alrededor del Jokhang. Mercado tibetano con banderas de oración, joyería de turquesa, ruedas de oración y artesanía local.', ciudad: lhasa._id, categoria: 'COMPRAS', duracionHoras: 2.5, precio: 0, consejos: ['Siempre camina en sentido horario', 'Regatea con respeto'] },
    { nombre: 'Monasterio de Sera', descripcion: 'Famoso por sus debates de monjes: cada tarde, los monjes debaten filosofía budista con gestos dramáticos. Uno de los tres grandes monasterios Gelug del Tíbet.', ciudad: lhasa._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 10, consejos: ['Los debates son a las 15:00, no te los pierdas', 'Es hipnótico aunque no entiendas tibetano'] },
    { nombre: 'Té de mantequilla de yak', descripcion: 'Degustación de la bebida emblemática del Tíbet: té con mantequilla de yak y sal. También momo (dumplings tibetanos) y tsampa (harina de cebada tostada).', ciudad: lhasa._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 8, consejos: ['El sabor salado sorprende la primera vez', 'Los momos de yak son deliciosos'] },
    { nombre: 'Lago Namtso (excursión)', descripcion: 'Excursión al lago sagrado Namtso a 4.718m de altitud. Aguas turquesas rodeadas de montañas nevadas y cielos infinitos. Uno de los lugares más fotogénicos del Tíbet.', ciudad: lhasa._id, categoria: 'NATURALEZA', duracionHoras: 10, precio: 60, consejos: ['A 4.700m la altitud se nota mucho', 'Lleva ropa de abrigo incluso en verano'] },
  ]);

  // ========== SUZHOU ACTIVITIES ==========
  const szActs = await Activity.create([
    { nombre: 'Jardín del Administrador Humilde', descripcion: 'El jardín clásico chino más grande y famoso de Suzhou. Patrimonio UNESCO. Pabellones, estanques de lotos, rocas y puentes en armonía perfecta.', ciudad: suzhou._id, categoria: 'NATURALEZA', duracionHoras: 2.5, precio: 12, consejos: ['Llega a primera hora para evitar multitudes', 'Cada rincón está diseñado como un cuadro'] },
    { nombre: 'Canales de Suzhou en barco', descripcion: 'Paseo en barco por los canales milenarios de Suzhou. Casas blancas con techos negros, puentes de piedra y vida local junto al agua.', ciudad: suzhou._id, categoria: 'CULTURAL', duracionHoras: 1.5, precio: 15, consejos: ['Al atardecer la luz es perfecta', 'El canal Pingjiang es el más bonito'] },
    { nombre: 'Pagoda del Templo del Norte', descripcion: 'La pagoda más alta del sur del Yangtsé (76m). 9 pisos con vistas panorámicas de toda Suzhou y sus jardines.', ciudad: suzhou._id, categoria: 'HISTORICO', duracionHoras: 1.5, precio: 8, consejos: ['Sube todos los pisos para la mejor vista', 'La pagoda tiene más de 1.700 años de historia'] },
    { nombre: 'Museo de la Seda de Suzhou', descripcion: 'Suzhou es la capital de la seda china desde hace 5.000 años. Museo con telares antiguos, demostración de fabricación y tienda de seda auténtica.', ciudad: suzhou._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 0, consejos: ['La demostración de tejido es fascinante', 'Compra seda auténtica aquí, no en la calle'] },
    { nombre: 'Calle Pingjiang', descripcion: 'Calle histórica junto al canal Pingjiang con casas de la dinastía Ming. Teteterías, tiendas de artesanía, música de guqin y un ambiente tranquilo y elegante.', ciudad: suzhou._id, categoria: 'COMPRAS', duracionHoras: 2, precio: 0, consejos: ['Los pasteles de Suzhou son adictivos', 'Toma un té en una casa de té junto al canal'] },
  ]);

  // ========== LIJIANG ACTIVITIES ==========
  const ljActs = await Activity.create([
    { nombre: 'Casco antiguo de Lijiang', descripcion: 'Ciudad antigua Naxi de 800 años (Patrimonio UNESCO). Calles empedradas, canales, puentes de piedra y vistas a la Montaña del Dragón de Jade.', ciudad: lijiang._id, categoria: 'CULTURAL', duracionHoras: 3, precio: 0, consejos: ['De noche las luces rojas crean una atmósfera mágica', 'Piérdete por los callejones secundarios'] },
    { nombre: 'Montaña del Dragón de Jade', descripcion: 'Glaciar a 4.680m con teleférico. Vistas de las cumbres nevadas sobre praderas de flores y lagos de agua turquesa.', ciudad: lijiang._id, categoria: 'AVENTURA', duracionHoras: 5, precio: 40, consejos: ['Alquila una bombona de oxígeno por la altitud', 'Lleva ropa de abrigo, hace mucho frío arriba'] },
    { nombre: 'Espectáculo Impression Lijiang', descripcion: 'Show al aire libre dirigido por Zhang Yimou con la montaña nevada como escenario. 500 actores locales naxi y Yi interpretan historias ancestrales.', ciudad: lijiang._id, categoria: 'CULTURAL', duracionHoras: 1.5, precio: 35, consejos: ['El escenario natural es impresionante', 'Lleva manta, hace frío por la altitud'] },
    { nombre: 'Lago Lugu (excursión)', descripcion: 'Lago cristalino a 2.685m rodeado de montañas, hogar del pueblo Mosuo (la última sociedad matriarcal de China). Paseo en canoa de madera.', ciudad: lijiang._id, categoria: 'NATURALEZA', duracionHoras: 10, precio: 50, consejos: ['El viaje de ida son 4 horas pero merece la pena', 'La cultura Mosuo es fascinante'] },
    { nombre: 'Música Naxi antigua', descripcion: 'Concierto de música ceremonial Naxi, una tradición musical de más de 500 años interpretada por ancianos del pueblo. Patrimonio cultural inmaterial.', ciudad: lijiang._id, categoria: 'CULTURAL', duracionHoras: 1.5, precio: 15, consejos: ['Los músicos tienen más de 70 años', 'Es una experiencia única en el mundo'] },
  ]);

  // ========== DUNHUANG ACTIVITIES ==========
  const dhActs = await Activity.create([
    { nombre: 'Cuevas de Mogao', descripcion: '492 cuevas con pinturas budistas de 1.600 años. El mayor tesoro artístico de la Ruta de la Seda. Patrimonio UNESCO.', ciudad: dunhuang._id, categoria: 'HISTORICO', duracionHoras: 3.5, precio: 40, consejos: ['Reserva online con meses de antelación', 'Solo se visitan 8 cuevas por entrada', 'No se pueden hacer fotos dentro'] },
    { nombre: 'Dunas de arena Mingsha', descripcion: 'Dunas de arena cantantes de hasta 250m de altura junto al oasis de la Luna Creciente. Paseo en camello al atardecer sobre el desierto del Gobi.', ciudad: dunhuang._id, categoria: 'AVENTURA', duracionHoras: 3, precio: 25, consejos: ['El atardecer sobre las dunas es mágico', 'El paseo en camello es imprescindible'] },
    { nombre: 'Lago de la Luna Creciente', descripcion: 'Oasis en forma de media luna rodeado de dunas gigantes. Ha sobrevivido más de 2.000 años sin secarse. Uno de los paisajes más surrealistas de China.', ciudad: dunhuang._id, categoria: 'NATURALEZA', duracionHoras: 1.5, precio: 0, consejos: ['Incluido en la entrada de las dunas', 'Al amanecer está vacío'] },
    { nombre: 'Mercado nocturno de Dunhuang', descripcion: 'Mercado de comida callejera del desierto: fideos tirados a mano, cordero asado, burro (especialidad local) y cerveza fría bajo las estrellas del Gobi.', ciudad: dunhuang._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 10, consejos: ['El cordero asado es el mejor de China', 'Prueba los fideos amarillos de Dunhuang'] },
    { nombre: 'Paso de Yumen (Puerta de Jade)', descripcion: 'Antigua puerta de la Gran Muralla en la Ruta de la Seda. Marco histórico donde los viajeros dejaban China hacia el oeste. Paisaje desértico desolador y fascinante.', ciudad: dunhuang._id, categoria: 'HISTORICO', duracionHoras: 3, precio: 15, consejos: ['Está en medio del desierto, lleva agua', 'La sensación de estar donde pasaron las caravanas es increíble'] },
  ]);

  // ========== KUNMING & SHENZHEN minimal activities ==========
  const kmActs = await Activity.create([
    { nombre: 'Bosque de Piedra', descripcion: 'Formaciones kársticas gigantes que parecen un bosque petrificado. Patrimonio UNESCO. Laberintos de piedra caliza de 270 millones de años.', ciudad: kunming._id, categoria: 'NATURALEZA', duracionHoras: 4, precio: 25, consejos: ['Es fácil perderse, sigue las señales', 'El pueblo Sani vende artesanía bonita'] },
    { nombre: 'Lago Dianchi', descripcion: 'El sexto lago más grande de China, conocido como la Perla de la Meseta. Paseo junto al agua con vistas a las montañas del Oeste.', ciudad: kunming._id, categoria: 'NATURALEZA', duracionHoras: 2.5, precio: 0, consejos: ['En invierno miles de gaviotas migran aquí', 'El templo en la montaña del Oeste tiene vistas increíbles'] },
    { nombre: 'Mercado de flores de Kunming', descripcion: 'El mercado de flores más grande de Asia. Hectáreas de flores tropicales, orquídeas y rosas a precios increíbles. Kunming exporta flores a todo el mundo.', ciudad: kunming._id, categoria: 'COMPRAS', duracionHoras: 2, precio: 0, consejos: ['Es enorme, céntrate en la zona de orquídeas', 'Los precios son ridículamente baratos'] },
    { nombre: 'Fideos cruzando el puente', descripcion: 'El plato estrella de Yunnan: caldo hirviendo en el que tú cocinas los ingredientes. Una sopa legendaria con más de 300 años de historia.', ciudad: kunming._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 12, consejos: ['La leyenda del plato es preciosa', 'Hay versiones de 10 a 30 ingredientes'] },
  ]);

  const szhActs = await Activity.create([
    { nombre: 'Distrito de Futian', descripcion: 'El corazón tecnológico de Shenzhen. Rascacielos futuristas, sede de Tencent y el centro cívico más moderno de China.', ciudad: shenzhen._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 0, consejos: ['El centro cívico tiene forma de ave Roc', 'La librería más bonita de China está aquí'] },
    { nombre: 'OCT Loft', descripcion: 'Distrito de arte y diseño en una antigua fábrica. Galerías, cafés indie, murales y tiendas de diseñadores locales.', ciudad: shenzhen._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 0, consejos: ['Los fines de semana hay mercadillos', 'El café es excelente'] },
    { nombre: 'Dafen Oil Painting Village', descripcion: 'Pueblo donde se producen el 60% de las copias de pinturas al óleo del mundo. Miles de artistas pintando Van Goghs y Monets en directo.', ciudad: shenzhen._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 0, consejos: ['Puedes encargar un retrato por muy poco', 'Es surrealista pero fascinante'] },
    { nombre: 'Sea World', descripcion: 'Zona de ocio y restaurantes junto al mar construida alrededor de un crucero francés encallado. Vida nocturna y gastronomía internacional.', ciudad: shenzhen._id, categoria: 'NOCTURNO', duracionHoras: 2.5, precio: 0, consejos: ['El crucero Ming Hua es el centro de todo', 'Buenos restaurantes y bares'] },
  ]);

  console.log('Actividades creadas para 8 ciudades nuevas');

  // ========== GUIDES ==========
  const guides = [];

  // --- HANGZHOU ---
  guides.push({
    titulo: 'Hangzhou - Paraíso del Lago del Oeste',
    descripcion: '3 días en la ciudad más romántica de China: el Lago del Oeste en barco, plantaciones de té Longjing, templos budistas milenarios y el pollo mendigante más famoso de la gastronomía china.',
    ciudad: hangzhou._id, duracionDias: 3, precio: 289,
    imagen: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'El Lago del Oeste', actividades: [
        { actividad: hzActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: hzActs[3]._id, orden: 2, horaInicio: '13:00', horaFin: '15:00' },
        { actividad: hzActs[6]._id, orden: 3, horaInicio: '18:00', horaFin: '19:30' },
        { actividad: hzActs[4]._id, orden: 4, horaInicio: '20:30', horaFin: '22:00' },
      ]},
      { numeroDia: 2, titulo: 'Té y Templos', actividades: [
        { actividad: hzActs[1]._id, orden: 1, horaInicio: '08:30', horaFin: '11:30' },
        { actividad: hzActs[2]._id, orden: 2, horaInicio: '13:00', horaFin: '15:30' },
        { actividad: hzActs[5]._id, orden: 3, horaInicio: '16:30', horaFin: '18:00' },
      ]},
      { numeroDia: 3, titulo: 'Despedida', actividades: [
        { actividad: hzActs[0]._id, orden: 1, horaInicio: '07:00', horaFin: '08:30' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Hangzhou Express - 2 Días',
    descripcion: 'Lo esencial de Hangzhou: el Lago del Oeste, té Longjing y el templo Lingyin en un fin de semana perfecto.',
    ciudad: hangzhou._id, duracionDias: 2, precio: 199,
    imagen: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Lago y Gastronomía', actividades: [
        { actividad: hzActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: hzActs[3]._id, orden: 2, horaInicio: '13:00', horaFin: '15:00' },
        { actividad: hzActs[6]._id, orden: 3, horaInicio: '18:00', horaFin: '19:30' },
      ]},
      { numeroDia: 2, titulo: 'Té y Templo', actividades: [
        { actividad: hzActs[1]._id, orden: 1, horaInicio: '08:30', horaFin: '11:30' },
        { actividad: hzActs[2]._id, orden: 2, horaInicio: '13:00', horaFin: '15:30' },
      ]},
    ],
  });

  // --- GUILIN ---
  guides.push({
    titulo: 'Guilin y Yangshuo - Montañas de Sueño',
    descripcion: '4 días entre las montañas kársticas más bellas del mundo: crucero por el río Li, arrozales en terraza, rafting en bambú y la mejor comida del sur de China.',
    ciudad: guilin._id, duracionDias: 4, precio: 399,
    imagen: 'https://images.unsplash.com/photo-1537531383496-e3cdba5e457c?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada a Guilin', actividades: [
        { actividad: glActs[4]._id, orden: 1, horaInicio: '14:00', horaFin: '15:30' },
        { actividad: glActs[3]._id, orden: 2, horaInicio: '16:00', horaFin: '17:30' },
        { actividad: glActs[5]._id, orden: 3, horaInicio: '19:00', horaFin: '20:30' },
      ]},
      { numeroDia: 2, titulo: 'Crucero por el río Li', actividades: [
        { actividad: glActs[0]._id, orden: 1, horaInicio: '08:30', horaFin: '13:00' },
        { actividad: glActs[1]._id, orden: 2, horaInicio: '14:00', horaFin: '17:00' },
      ]},
      { numeroDia: 3, titulo: 'Arrozales y Rafting', actividades: [
        { actividad: glActs[2]._id, orden: 1, horaInicio: '08:00', horaFin: '14:00' },
        { actividad: glActs[6]._id, orden: 2, horaInicio: '15:30', horaFin: '18:00' },
      ]},
      { numeroDia: 4, titulo: 'Último Día', actividades: [
        { actividad: glActs[5]._id, orden: 1, horaInicio: '09:00', horaFin: '10:30' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Guilin Express - 2 Días',
    descripcion: 'Lo imprescindible de Guilin: crucero por el río Li y Yangshuo en un fin de semana entre montañas kársticas.',
    ciudad: guilin._id, duracionDias: 2, precio: 219,
    imagen: 'https://images.unsplash.com/photo-1537531383496-e3cdba5e457c?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Guilin y Cueva', actividades: [
        { actividad: glActs[4]._id, orden: 1, horaInicio: '09:00', horaFin: '10:30' },
        { actividad: glActs[3]._id, orden: 2, horaInicio: '11:00', horaFin: '12:30' },
        { actividad: glActs[5]._id, orden: 3, horaInicio: '18:00', horaFin: '19:30' },
      ]},
      { numeroDia: 2, titulo: 'Río Li y Yangshuo', actividades: [
        { actividad: glActs[0]._id, orden: 1, horaInicio: '08:30', horaFin: '13:00' },
        { actividad: glActs[1]._id, orden: 2, horaInicio: '14:00', horaFin: '17:00' },
      ]},
    ],
  });

  // --- LHASA ---
  guides.push({
    titulo: 'Lhasa - El Techo del Mundo',
    descripcion: '4 días en el Tíbet: el Palacio de Potala, templos sagrados, debates de monjes, té de mantequilla de yak y una excursión al lago sagrado Namtso. Experiencia espiritual única.',
    ciudad: lhasa._id, duracionDias: 4, precio: 599,
    imagen: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Aclimatación', actividades: [
        { actividad: lhActs[2]._id, orden: 1, horaInicio: '15:00', horaFin: '17:30' },
        { actividad: lhActs[4]._id, orden: 2, horaInicio: '18:00', horaFin: '19:30' },
      ]},
      { numeroDia: 2, titulo: 'Potala y Jokhang', actividades: [
        { actividad: lhActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: lhActs[1]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
      ]},
      { numeroDia: 3, titulo: 'Monasterio y Debates', actividades: [
        { actividad: lhActs[3]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: lhActs[2]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
      ]},
      { numeroDia: 4, titulo: 'Lago Sagrado Namtso', actividades: [
        { actividad: lhActs[5]._id, orden: 1, horaInicio: '07:00', horaFin: '17:00' },
      ]},
    ],
  });

  // --- SUZHOU ---
  guides.push({
    titulo: 'Suzhou - La Venecia de Oriente',
    descripcion: '3 días en la ciudad de los jardines y los canales: jardines UNESCO, paseos en barco por canales milenarios, pagodas y la mejor seda de China.',
    ciudad: suzhou._id, duracionDias: 3, precio: 269,
    imagen: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Jardines y Canales', actividades: [
        { actividad: szActs[0]._id, orden: 1, horaInicio: '08:30', horaFin: '11:00' },
        { actividad: szActs[1]._id, orden: 2, horaInicio: '13:00', horaFin: '14:30' },
        { actividad: szActs[4]._id, orden: 3, horaInicio: '15:30', horaFin: '17:30' },
      ]},
      { numeroDia: 2, titulo: 'Seda y Pagoda', actividades: [
        { actividad: szActs[3]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: szActs[2]._id, orden: 2, horaInicio: '13:00', horaFin: '14:30' },
      ]},
      { numeroDia: 3, titulo: 'Último Paseo', actividades: [
        { actividad: szActs[1]._id, orden: 1, horaInicio: '09:00', horaFin: '10:30' },
      ]},
    ],
  });

  // --- LIJIANG ---
  guides.push({
    titulo: 'Lijiang - Ciudad Naxi y Montaña de Jade',
    descripcion: '3 días en la antigua ciudad Naxi al pie de la Montaña del Dragón de Jade: calles empedradas, cultura ancestral, nieve eterna y música milenaria.',
    ciudad: lijiang._id, duracionDias: 3, precio: 349,
    imagen: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Ciudad Antigua', actividades: [
        { actividad: ljActs[0]._id, orden: 1, horaInicio: '14:00', horaFin: '17:00' },
        { actividad: ljActs[4]._id, orden: 2, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Montaña del Dragón', actividades: [
        { actividad: ljActs[1]._id, orden: 1, horaInicio: '08:00', horaFin: '13:00' },
        { actividad: ljActs[2]._id, orden: 2, horaInicio: '15:00', horaFin: '16:30' },
      ]},
      { numeroDia: 3, titulo: 'Despedida Naxi', actividades: [
        { actividad: ljActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
      ]},
    ],
  });

  // --- DUNHUANG ---
  guides.push({
    titulo: 'Dunhuang - Ruta de la Seda',
    descripcion: '3 días en el oasis del desierto del Gobi: cuevas budistas milenarias, dunas de arena cantantes, camellos al atardecer y la Puerta de Jade hacia Occidente.',
    ciudad: dunhuang._id, duracionDias: 3, precio: 379,
    imagen: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Cuevas de Mogao', actividades: [
        { actividad: dhActs[0]._id, orden: 1, horaInicio: '08:30', horaFin: '12:00' },
        { actividad: dhActs[3]._id, orden: 2, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 2, titulo: 'Dunas y Oasis', actividades: [
        { actividad: dhActs[1]._id, orden: 1, horaInicio: '16:00', horaFin: '19:00' },
        { actividad: dhActs[2]._id, orden: 2, horaInicio: '19:00', horaFin: '20:30' },
      ]},
      { numeroDia: 3, titulo: 'Puerta de Jade', actividades: [
        { actividad: dhActs[4]._id, orden: 1, horaInicio: '08:00', horaFin: '11:00' },
      ]},
    ],
  });

  // --- KUNMING ---
  guides.push({
    titulo: 'Kunming - Eterna Primavera',
    descripcion: '3 días en la puerta de Yunnan: bosques de piedra milenarios, lagos rodeados de montañas, mercados de flores y los fideos más famosos del suroeste de China.',
    ciudad: kunming._id, duracionDias: 3, precio: 249,
    imagen: 'https://images.unsplash.com/photo-1558005137-d9619a5c539f?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Bosque de Piedra', actividades: [
        { actividad: kmActs[0]._id, orden: 1, horaInicio: '08:00', horaFin: '12:00' },
        { actividad: kmActs[3]._id, orden: 2, horaInicio: '18:00', horaFin: '19:30' },
      ]},
      { numeroDia: 2, titulo: 'Lago y Flores', actividades: [
        { actividad: kmActs[1]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: kmActs[2]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
      ]},
      { numeroDia: 3, titulo: 'Despedida', actividades: [
        { actividad: kmActs[3]._id, orden: 1, horaInicio: '09:00', horaFin: '10:30' },
      ]},
    ],
  });

  // --- SHENZHEN ---
  guides.push({
    titulo: 'Shenzhen - La Ciudad del Futuro',
    descripcion: '2 días en la capital tecnológica del mundo: arquitectura futurista, arte urbano, gastronomía internacional y el pueblo de pintores más surrealista de China.',
    ciudad: shenzhen._id, duracionDias: 2, precio: 179,
    imagen: 'https://images.unsplash.com/photo-1533552689071-33be96f7d31e?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Tecnología y Arte', actividades: [
        { actividad: szhActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: szhActs[1]._id, orden: 2, horaInicio: '13:00', horaFin: '15:30' },
        { actividad: szhActs[3]._id, orden: 3, horaInicio: '19:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Arte y Despedida', actividades: [
        { actividad: szhActs[2]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
      ]},
    ],
  });

  await Guide.create(guides);
  console.log(`${guides.length} nuevas guías creadas`);

  // ========== HOTELS ==========
  await Hotel.create([
    { nombre: 'West Lake State Hotel', ciudad: hangzhou._id, estrellas: 5, precioPorNoche: 120, descripcion: 'Hotel de lujo junto al Lago del Oeste con vistas a las pagodas.' },
    { nombre: 'Guilin Riverside Hotel', ciudad: guilin._id, estrellas: 4, precioPorNoche: 55, descripcion: 'Hotel junto al río Li con vistas a las montañas kársticas.' },
    { nombre: 'Yangshuo Mountain Retreat', ciudad: guilin._id, estrellas: 4, precioPorNoche: 70, descripcion: 'Hotel boutique en Yangshuo rodeado de montañas.' },
    { nombre: 'Lhasa Potala View Hotel', ciudad: lhasa._id, estrellas: 4, precioPorNoche: 85, descripcion: 'Hotel con vistas al Palacio de Potala y oxígeno en habitación.' },
    { nombre: 'Suzhou Garden Hotel', ciudad: suzhou._id, estrellas: 4, precioPorNoche: 65, descripcion: 'Hotel estilo jardín clásico junto al canal Pingjiang.' },
    { nombre: 'Lijiang Ancient Town Hotel', ciudad: lijiang._id, estrellas: 4, precioPorNoche: 60, descripcion: 'Hotel Naxi tradicional dentro del casco antiguo.' },
    { nombre: 'Dunhuang Silk Road Hotel', ciudad: dunhuang._id, estrellas: 4, precioPorNoche: 55, descripcion: 'Hotel con decoración de la Ruta de la Seda junto a las dunas.' },
    { nombre: 'Kunming Spring Hotel', ciudad: kunming._id, estrellas: 4, precioPorNoche: 50, descripcion: 'Hotel moderno en el centro con jardín tropical.' },
    { nombre: 'Shenzhen Tech Hotel', ciudad: shenzhen._id, estrellas: 4, precioPorNoche: 75, descripcion: 'Hotel inteligente con domótica completa en Futian.' },
  ]);
  console.log('Hoteles creados');

  // ========== FLIGHTS ==========
  await Flight.create([
    { aerolinea: 'Air China', origen: 'Madrid', destino: 'Hangzhou', ciudadDestino: hangzhou._id, precio: 540, duracionHoras: 13 },
    { aerolinea: 'China Southern', origen: 'Madrid', destino: 'Guilin', ciudadDestino: guilin._id, precio: 580, duracionHoras: 14 },
    { aerolinea: 'Air China', origen: 'Madrid', destino: 'Lhasa (escala Chengdú)', ciudadDestino: lhasa._id, precio: 720, duracionHoras: 16 },
    { aerolinea: 'China Eastern', origen: 'Barcelona', destino: 'Hangzhou', ciudadDestino: hangzhou._id, precio: 550, duracionHoras: 12.5 },
    { aerolinea: 'China Southern', origen: 'Madrid', destino: 'Kunming', ciudadDestino: kunming._id, precio: 560, duracionHoras: 14 },
    { aerolinea: 'China Southern', origen: 'Madrid', destino: 'Shenzhen', ciudadDestino: shenzhen._id, precio: 500, duracionHoras: 12 },
    { aerolinea: 'Hainan Airlines', origen: 'Madrid', destino: 'Lijiang (escala Pekín)', ciudadDestino: lijiang._id, precio: 650, duracionHoras: 15 },
  ]);
  console.log('Vuelos creados');

  // ========== CULTURE ARTICLES ==========
  await CultureArticle.create([
    {
      titulo: 'El Lago del Oeste: El paisaje más pintado de China',
      resumen: 'Por qué el Lago del Oeste de Hangzhou ha inspirado a poetas y artistas durante 2.000 años.',
      contenido: '<p>El Lago del Oeste (西湖) de Hangzhou ha sido fuente de inspiración para poetas, pintores y emperadores durante más de 2.000 años. Marco Polo lo describió como "el cielo en la tierra".</p><p>Sus "Diez Escenas" clásicas incluyen luna reflejada, lotos en verano, nieve sobre puentes y pagodas entre brumas. Es Patrimonio UNESCO desde 2011.</p>',
      categoria: 'HISTORIA', ciudad: hangzhou._id,
    },
    {
      titulo: 'Budismo tibetano: Guía para viajeros',
      resumen: 'Lo que necesitas saber sobre el budismo tibetano antes de visitar Lhasa.',
      contenido: '<p>El budismo tibetano es una rama única que combina enseñanzas budistas con prácticas tántricas y la antigua religión Bön. Los monasterios son centros de aprendizaje, debate y meditación.</p><p>Elementos clave: las ruedas de oración (girar en sentido horario), las banderas de oración (los 5 colores representan los elementos), las postraciones y los mantras como "Om Mani Padme Hum".</p>',
      categoria: 'TRADICIONES', ciudad: lhasa._id,
    },
    {
      titulo: 'La Ruta de la Seda: De Dunhuang al mundo',
      resumen: 'La fascinante historia de la ruta comercial más importante de la historia y su legado en Dunhuang.',
      contenido: '<p>Durante más de 1.500 años, la Ruta de la Seda conectó China con Roma. Dunhuang, en el borde del desierto del Gobi, era una parada crucial donde los mercaderes descansaban antes de cruzar el desierto.</p><p>Las Cuevas de Mogao nacieron de esta riqueza: monjes budistas crearon 492 cuevas con pinturas que mezclan estilos chino, indio, persa y griego. Un tesoro artístico sin igual.</p>',
      categoria: 'HISTORIA', ciudad: dunhuang._id,
    },
    {
      titulo: 'Los jardines clásicos chinos: Filosofía hecha paisaje',
      resumen: 'Cómo los jardines de Suzhou capturan la esencia de la filosofía china en cada piedra y cada gota de agua.',
      contenido: '<p>Los jardines clásicos chinos no son simples espacios verdes: son microcosmos filosóficos. Cada piedra, árbol, estanque y pabellón está colocado para crear armonía entre el ser humano y la naturaleza.</p><p>Suzhou tiene 9 jardines Patrimonio UNESCO. El Jardín del Administrador Humilde (拙政园) es el más famoso: construido en 1509, usa agua como elemento principal para crear sensación de infinito.</p>',
      categoria: 'ARTE', ciudad: suzhou._id,
    },
    {
      titulo: 'Los Naxi de Lijiang: La última escritura pictográfica viva',
      resumen: 'El fascinante pueblo Naxi y su escritura Dongba, la última escritura pictográfica del mundo aún en uso.',
      contenido: '<p>El pueblo Naxi de Lijiang mantiene una de las culturas más fascinantes de China. Su escritura Dongba, con más de 1.000 años de antigüedad, es la última escritura pictográfica del mundo aún en uso.</p><p>Los Dongba son sacerdotes-chamanes que realizan ceremonias con estos pictogramas sagrados. UNESCO declaró los manuscritos Dongba Memoria del Mundo en 2003.</p>',
      categoria: 'TRADICIONES', ciudad: lijiang._id,
    },
    {
      titulo: 'Guilin: El paisaje del billete de 20 yuanes',
      resumen: 'La historia detrás del paisaje más icónico de China y cómo recorrerlo.',
      contenido: '<p>Si sacas un billete de 20 yuanes, verás un paisaje de montañas kársticas reflejadas en agua. Ese lugar exacto existe: es Xingping, a orillas del río Li cerca de Yangshuo.</p><p>Las formaciones kársticas de Guilin tienen 300 millones de años. El agua del río Li es tan cristalina que refleja cada montaña como un espejo. El crucero de Guilin a Yangshuo es considerado uno de los 10 mejores viajes en barco del mundo.</p>',
      categoria: 'HISTORIA', ciudad: guilin._id,
    },
  ]);
  console.log('Artículos de cultura creados');

  console.log('\n✅ Seed de expansión completado');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Ciudades añadidas: 8 (Hangzhou, Guilin, Lhasa, Suzhou, Kunming, Lijiang, Shenzhen, Dunhuang)');
  console.log('Guías añadidas: 11');
  console.log('Actividades añadidas: ~50');
  console.log('Hoteles añadidos: 9');
  console.log('Vuelos añadidos: 7');
  console.log('Artículos añadidos: 6');

  process.exit(0);
};

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
