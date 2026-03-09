import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import City from './models/City.js';
import Activity from './models/Activity.js';
import Guide from './models/Guide.js';
import Hotel from './models/Hotel.js';
import Flight from './models/Flight.js';
import CultureArticle from './models/CultureArticle.js';

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    City.deleteMany({}),
    Activity.deleteMany({}),
    Guide.deleteMany({}),
    Hotel.deleteMany({}),
    Flight.deleteMany({}),
    CultureArticle.deleteMany({}),
  ]);
  console.log('Base de datos limpiada');

  // ========== USERS ==========
  await User.create([
    { nombre: 'Admin', email: 'admin@chinatravel.com', password: 'admin123', role: 'ADMIN' },
    { nombre: 'Comercial', email: 'comercial@chinatravel.com', password: 'comercial123', role: 'COMERCIAL' },
    { nombre: 'Usuario', email: 'user@chinatravel.com', password: 'user123', role: 'USER' },
  ]);
  console.log('Usuarios creados');

  // ========== CITIES ==========
  const cities = await City.create([
    {
      nombre: 'Pekín', nombreChino: '北京', slug: 'pekin',
      descripcion: 'Capital de China y centro político, cultural e histórico. Hogar de la Ciudad Prohibida, la Gran Muralla y templos milenarios. Pekín es una metrópolis donde conviven la historia imperial y la modernidad más vanguardista.',
      imagenPortada: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Shanghái', nombreChino: '上海', slug: 'shanghai',
      descripcion: 'La ciudad más cosmopolita de China, famosa por su skyline futurista en Pudong, el histórico Bund y una vibrante escena gastronómica. Centro financiero y cultural del país.',
      imagenPortada: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Chengdú', nombreChino: '成都', slug: 'chengdu',
      descripcion: 'Capital de Sichuan, famosa por sus pandas gigantes, su gastronomía picante y su estilo de vida relajado. Una ciudad que combina tradición con una escena cultural moderna y vibrante.',
      imagenPortada: 'https://images.unsplash.com/photo-1600112356623-90c0ad8a5224?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Chongqing', nombreChino: '重庆', slug: 'chongqing',
      descripcion: 'La "ciudad montaña" de China, construida sobre colinas junto al río Yangtsé. Famosa por su hot pot, sus impresionantes edificios sobre acantilados, su monorraíl que atraviesa edificios y su vibrante vida nocturna.',
      imagenPortada: 'https://images.unsplash.com/photo-1607500535696-51e0ea71de0e?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Harbin', nombreChino: '哈尔滨', slug: 'harbin',
      descripcion: 'La "Ciudad de Hielo" en el noreste de China. Famosa mundialmente por su Festival Internacional de Esculturas de Hielo y Nieve, su arquitectura rusa y temperaturas que llegan a -30°C en invierno.',
      imagenPortada: 'https://images.unsplash.com/photo-1548018560-c7196e4f5bba?w=800&q=80',
      destacada: true,
    },
  ]);
  console.log('Ciudades creadas');

  const [pekin, shanghai, chengdu, chongqing, harbin] = cities;

  // ========== ACTIVITIES ==========

  // --- PEKÍN ---
  const pekinActs = await Activity.create([
    { nombre: 'Ciudad Prohibida', descripcion: 'Visita guiada al palacio imperial más grande del mundo, con 980 edificios y una historia de 600 años.', ciudad: pekin._id, categoria: 'HISTORICO', duracionHoras: 4, precio: 35, consejos: ['Llega temprano para evitar multitudes', 'Lleva calzado cómodo', 'Compra las entradas online con antelación'] },
    { nombre: 'Gran Muralla (Mutianyu)', descripcion: 'Sección restaurada de la Gran Muralla, menos masificada que Badaling, con vistas espectaculares y teleférico.', ciudad: pekin._id, categoria: 'AVENTURA', duracionHoras: 6, precio: 50, consejos: ['Usa el teleférico para subir y baja andando', 'Lleva agua y snacks', 'Madruga para evitar multitudes'] },
    { nombre: 'Templo del Cielo', descripcion: 'Complejo de templos donde los emperadores rezaban por buenas cosechas. Patrimonio de la Humanidad UNESCO.', ciudad: pekin._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 15, consejos: ['Visita por la mañana para ver tai chi local', 'El eco en la Bóveda Imperial es impresionante'] },
    { nombre: 'Hutongs en rickshaw', descripcion: 'Recorrido en rickshaw por los tradicionales callejones de Pekín, visitando casas locales y patios interiores.', ciudad: pekin._id, categoria: 'CULTURAL', duracionHoras: 3, precio: 25, consejos: ['Negocia el precio antes de subir', 'Pide parar en una casa de té local'] },
    { nombre: 'Pato pekinés en Quanjude', descripcion: 'Cena con el famoso pato laqueado de Pekín en uno de los restaurantes más emblemáticos, con más de 150 años de historia.', ciudad: pekin._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 40, consejos: ['Reserva mesa con antelación', 'Pide el pato entero para 2-3 personas'] },
    { nombre: 'Mercado nocturno de Wangfujing', descripcion: 'Famoso mercado nocturno con comida callejera exótica, desde escorpiones fritos hasta brochetas de cordero.', ciudad: pekin._id, categoria: 'NOCTURNO', duracionHoras: 2, precio: 10, consejos: ['Prueba las brochetas de cordero', 'Los precios son negociables'] },
    { nombre: 'Palacio de Verano', descripcion: 'Jardín imperial a orillas del lago Kunming. Pabellones, puentes y el famoso Pasillo Largo con 14.000 pinturas.', ciudad: pekin._id, categoria: 'HISTORICO', duracionHoras: 3.5, precio: 20, consejos: ['Alquila un bote en el lago', 'La Colina de la Longevidad tiene las mejores vistas'] },
    { nombre: 'Plaza de Tiananmén', descripcion: 'La plaza pública más grande del mundo, corazón político de China. Incluye el Mausoleo de Mao y el Monumento a los Héroes del Pueblo.', ciudad: pekin._id, categoria: 'HISTORICO', duracionHoras: 1.5, precio: 0, consejos: ['La ceremonia de izado de bandera es al amanecer', 'Lleva pasaporte para los controles de seguridad'] },
    { nombre: 'Barrio artístico 798', descripcion: 'Antiguo complejo industrial reconvertido en el distrito de arte contemporáneo más importante de China. Galerías, cafés y arte callejero.', ciudad: pekin._id, categoria: 'CULTURAL', duracionHoras: 3, precio: 0, consejos: ['Muchas galerías son gratis', 'Ideal para una tarde relajada'] },
    { nombre: 'Espectáculo de Kung Fu', descripcion: 'Show de artes marciales con acrobacias increíbles en el Teatro Rojo de Pekín. Apto para toda la familia.', ciudad: pekin._id, categoria: 'NOCTURNO', duracionHoras: 1.5, precio: 35, consejos: ['Reserva asientos delanteros', 'El show es sin diálogos, ideal si no hablas chino'] },
  ]);

  // --- SHANGHÁI ---
  const shanghaiActs = await Activity.create([
    { nombre: 'El Bund', descripcion: 'Paseo por el malecón más famoso de Asia con vistas al skyline de Pudong. Arquitectura colonial europea frente a rascacielos futuristas.', ciudad: shanghai._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 0, consejos: ['Visita al atardecer para las mejores fotos', 'Vuelve de noche cuando todo se ilumina'] },
    { nombre: 'Torre de Shanghái', descripcion: 'Sube al mirador del segundo edificio más alto del mundo (632m). Vistas de 360° de toda la ciudad.', ciudad: shanghai._id, categoria: 'AVENTURA', duracionHoras: 2, precio: 30, consejos: ['Elige un día despejado', 'La entrada incluye exposición interactiva'] },
    { nombre: 'Jardín Yuyuan', descripcion: 'Jardín clásico chino del siglo XVI en el corazón de la ciudad antigua. Pabellones, estanques y bazar adyacente.', ciudad: shanghai._id, categoria: 'HISTORICO', duracionHoras: 2.5, precio: 15, consejos: ['Prueba los xiaolongbao en el bazar', 'Llega temprano'] },
    { nombre: 'Xiaolongbao en Din Tai Fung', descripcion: 'Degustación de los famosos dumplings al vapor de Shanghái en el restaurante más premiado de la especialidad.', ciudad: shanghai._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 25, consejos: ['Haz un agujero pequeño y sorbe el caldo primero'] },
    { nombre: 'Barrio francés en bicicleta', descripcion: 'Recorre en bici las calles arboladas de la antigua Concesión Francesa, con cafés, boutiques y arquitectura art déco.', ciudad: shanghai._id, categoria: 'AVENTURA', duracionHoras: 3, precio: 20, consejos: ['Alquila bici compartida con app', 'Para en Fuxing Park para descansar'] },
    { nombre: 'Crucero nocturno por el Huangpu', descripcion: 'Navegación de una hora por el río Huangpu viendo el Bund y Pudong iluminados. Una de las experiencias más románticas de China.', ciudad: shanghai._id, categoria: 'NOCTURNO', duracionHoras: 1.5, precio: 20, consejos: ['Reserva el barco VIP para mejor experiencia', 'Lleva chaqueta, en el río hace frío'] },
    { nombre: 'Museo de Shanghái', descripcion: 'Uno de los mejores museos de China con colecciones de bronces, cerámicas, caligrafía y jade de miles de años.', ciudad: shanghai._id, categoria: 'CULTURAL', duracionHoras: 3, precio: 0, consejos: ['Entrada gratuita', 'La colección de bronces es excepcional'] },
    { nombre: 'Zhujiajiao - Pueblo de agua', descripcion: 'Excursión al pueblo acuático más cercano a Shanghái. Canales, puentes de piedra y arquitectura Ming-Qing a solo 1 hora de la ciudad.', ciudad: shanghai._id, categoria: 'HISTORICO', duracionHoras: 5, precio: 25, consejos: ['Paseo en góndola por los canales', 'Prueba el cerdo estofado local'] },
    { nombre: 'Tianzifang', descripcion: 'Laberinto de callejones con tiendas de artesanía, galerías de arte y cafés en antiguas casas shikumen renovadas.', ciudad: shanghai._id, categoria: 'COMPRAS', duracionHoras: 2.5, precio: 0, consejos: ['Es fácil perderse, eso es parte de la diversión', 'Los precios son negociables'] },
    { nombre: 'Nanjing Road', descripcion: 'La calle comercial más famosa de China. 5 km de tiendas, luces de neón y ambiente vibrante, desde marcas de lujo hasta tiendas locales.', ciudad: shanghai._id, categoria: 'COMPRAS', duracionHoras: 2, precio: 0, consejos: ['Pasea por la noche cuando las luces están encendidas', 'El tramo peatonal es el más animado'] },
  ]);

  // --- CHENGDÚ ---
  const chengduActs = await Activity.create([
    { nombre: 'Centro de Pandas Gigantes', descripcion: 'Observa pandas gigantes y rojos en un entorno semi-natural. Posibilidad de ver crías en la nursería.', ciudad: chengdu._id, categoria: 'NATURALEZA', duracionHoras: 4, precio: 30, consejos: ['Llega a las 8:30 cuando los pandas están más activos', 'Los pandas bebés están en la nursería'] },
    { nombre: 'Espectáculo cambio de caras', descripcion: 'Show de la ópera de Sichuan con la tradición del bian lian: cambio instantáneo de máscaras de colores.', ciudad: chengdu._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 35, consejos: ['Reserva asientos en las primeras filas', 'Incluye degustación de té'] },
    { nombre: 'Hot pot sichuanés', descripcion: 'Experiencia gastronómica del famoso hot pot picante de Sichuan. Caldo hirviente con pimienta de Sichuan.', ciudad: chengdu._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 20, consejos: ['Pide mitad picante mitad no picante (yuanyang)', 'La pimienta de Sichuan adormece la lengua, es normal'] },
    { nombre: 'Calle Jinli', descripcion: 'Calle antigua reconstruida con arquitectura tradicional, puestos de comida, artesanía y ambiente festivo. La esencia de la vieja Chengdú.', ciudad: chengdu._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 0, consejos: ['Visita de noche cuando está iluminada', 'Prueba los dulces de azúcar soplado'] },
    { nombre: 'Templo Wuhou', descripcion: 'Templo dedicado a Zhuge Liang y Liu Bei del período de los Tres Reinos. Jardines tranquilos y museo histórico.', ciudad: chengdu._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 15, consejos: ['Lee algo sobre los Tres Reinos antes de visitar', 'El jardín bonsái es precioso'] },
    { nombre: 'Buda Gigante de Leshan', descripcion: 'Excursión al Buda de piedra más grande del mundo (71m de altura), esculpido en un acantilado junto a tres ríos. Patrimonio UNESCO.', ciudad: chengdu._id, categoria: 'HISTORICO', duracionHoras: 7, precio: 45, consejos: ['Baja por las escaleras junto al Buda para apreciar su tamaño', 'También se puede ver desde un barco'] },
    { nombre: 'Callejón ancho y estrecho', descripcion: 'Kuanzhai Xiangzi: tres callejones históricos con casas de la dinastía Qing convertidas en restaurantes, teatros de té y tiendas.', ciudad: chengdu._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 0, consejos: ['El callejón ancho tiene más restaurantes', 'Prueba el café de oreja de conejo (te limpian las orejas mientras tomas té)'] },
    { nombre: 'Monte Qingcheng', descripcion: 'Una de las cunas del taoísmo en China. Senderos entre bosques de bambú, templos taoístas y aire puro de montaña.', ciudad: chengdu._id, categoria: 'NATURALEZA', duracionHoras: 6, precio: 30, consejos: ['Lleva calzado de montaña', 'La parte trasera es más tranquila y natural'] },
    { nombre: 'Clase de cocina sichuanesa', descripcion: 'Aprende a preparar mapo tofu, kung pao chicken y dumplings en una clase práctica con chef local.', ciudad: chengdu._id, categoria: 'GASTRONOMIA', duracionHoras: 3, precio: 40, consejos: ['Incluye visita al mercado', 'Te llevas las recetas a casa'] },
  ]);

  // --- CHONGQING ---
  const chongqingActs = await Activity.create([
    { nombre: 'Hongya Cave', descripcion: 'Complejo de edificios colgantes sobre el acantilado junto al río Jialing, iluminados espectacularmente de noche. Recuerda a la película de Miyazaki "El viaje de Chihiro".', ciudad: chongqing._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 0, consejos: ['Visita de noche para las mejores fotos', 'Los pisos superiores tienen restaurantes con vistas'] },
    { nombre: 'Hot pot de Chongqing', descripcion: 'El auténtico hot pot original, más picante que el de Chengdú. Caldo rojo intenso con aceite de chile y pimienta. Experiencia extrema.', ciudad: chongqing._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 18, consejos: ['El nivel de picante aquí es otro nivel', 'Pide la versión yuanyang si eres principiante', 'Acompaña con leche de soja para calmar el picante'] },
    { nombre: 'Monorraíl de Liziba', descripcion: 'Viaje en el famoso monorraíl que atraviesa un edificio residencial. Una de las imágenes más icónicas y surrealistas de China.', ciudad: chongqing._id, categoria: 'AVENTURA', duracionHoras: 1, precio: 3, consejos: ['La estación de Liziba es donde el tren cruza el edificio', 'Graba video desde dentro y desde fuera'] },
    { nombre: 'Ciqikou - Pueblo antiguo', descripcion: 'Pueblo con más de 1.000 años de historia en la ribera del río Jialing. Calles empedradas, templos, y puestos de comida tradicional.', ciudad: chongqing._id, categoria: 'HISTORICO', duracionHoras: 3, precio: 0, consejos: ['Prueba las flores de chen mahua (dulce frito trenzado)', 'Los callejones laterales son más auténticos'] },
    { nombre: 'Crucero por el río Yangtsé', descripcion: 'Navegación por el río más largo de China con vistas a las montañas y el skyline nocturno de Chongqing.', ciudad: chongqing._id, categoria: 'NATURALEZA', duracionHoras: 3, precio: 35, consejos: ['El crucero nocturno tiene las mejores vistas de la ciudad iluminada', 'Reserva cubierta superior'] },
    { nombre: 'Dazu Rock Carvings', descripcion: 'Excursión a los relieves rupestres de Dazu (Patrimonio UNESCO). Miles de esculturas budistas, taoístas y confucianas talladas entre los siglos IX y XIII.', ciudad: chongqing._id, categoria: 'HISTORICO', duracionHoras: 7, precio: 40, consejos: ['El grupo de Baoding es el más impresionante', 'Contrata guía para entender las historias'] },
    { nombre: 'Teleférico sobre el Yangtsé', descripcion: 'Cruce del río Yangtsé en teleférico con vistas panorámicas de la ciudad construida sobre montañas. Experiencia única.', ciudad: chongqing._id, categoria: 'AVENTURA', duracionHoras: 0.5, precio: 5, consejos: ['Hay cola larga los fines de semana', 'Mejor al atardecer'] },
    { nombre: 'Jiefangbei - Centro comercial', descripcion: 'La plaza central de Chongqing rodeada de rascacielos y centros comerciales. Punto de encuentro y zona de compras más importante.', ciudad: chongqing._id, categoria: 'COMPRAS', duracionHoras: 2, precio: 0, consejos: ['La torre de la liberación es el monumento central', 'Hay comida callejera increíble alrededor'] },
    { nombre: 'Fideos de Chongqing (xiaomian)', descripcion: 'Degustación de los famosos fideos picantes xiaomian en un puesto callejero auténtico. El desayuno favorito de los locales.', ciudad: chongqing._id, categoria: 'GASTRONOMIA', duracionHoras: 1, precio: 5, consejos: ['Pídelo en un puesto pequeño, no en restaurante turístico', 'Añade vinagre negro para más sabor'] },
  ]);

  // --- HARBIN ---
  const harbinActs = await Activity.create([
    { nombre: 'Festival de Hielo y Nieve', descripcion: 'El festival de esculturas de hielo más grande del mundo. Edificios, castillos y monumentos de hielo iluminados con luces LED de colores. Abierto de diciembre a febrero.', ciudad: harbin._id, categoria: 'CULTURAL', duracionHoras: 4, precio: 45, consejos: ['Visita de noche cuando las luces están encendidas', 'Abriga MUCHO, la temperatura llega a -30°C', 'Lleva baterías extra, el frío las agota rápido'] },
    { nombre: 'Sun Island Snow Sculptures', descripcion: 'Exposición de esculturas gigantes de nieve en la Isla del Sol. Obras de arte monumentales talladas por artistas de todo el mundo.', ciudad: harbin._id, categoria: 'CULTURAL', duracionHoras: 3, precio: 30, consejos: ['Mejor por la mañana con luz natural', 'Lleva gafas de sol, la nieve refleja mucho'] },
    { nombre: 'Calle Zhongyang (Central Street)', descripcion: 'Calle peatonal de 1,4 km con arquitectura rusa y europea. Tiendas, restaurantes y heladerías que sirven helado ¡a -20°C!', ciudad: harbin._id, categoria: 'COMPRAS', duracionHoras: 2.5, precio: 0, consejos: ['Sí, los locales comen helado en invierno a -20°C, ¡pruébalo!', 'La arquitectura art nouveau es preciosa'] },
    { nombre: 'Catedral de Santa Sofía', descripcion: 'Impresionante catedral ortodoxa rusa de estilo bizantino, herencia de la época del ferrocarril transiberiano. Hoy museo de arquitectura.', ciudad: harbin._id, categoria: 'HISTORICO', duracionHoras: 1.5, precio: 10, consejos: ['La plaza frente a la catedral es perfecta para fotos', 'De noche está iluminada'] },
    { nombre: 'Tigres siberianos de Harbin', descripcion: 'Visita al Centro de Cría del Tigre Siberiano, el mayor del mundo. Observa estos majestuosos felinos en un entorno nevado.', ciudad: harbin._id, categoria: 'NATURALEZA', duracionHoras: 2.5, precio: 25, consejos: ['El safari en autobús es la mejor experiencia', 'Los tigres están más activos en invierno'] },
    { nombre: 'Baño termal en Yabuli', descripcion: 'Relájate en aguas termales naturales al aire libre rodeado de nieve. Experiencia de contraste térmico inolvidable.', ciudad: harbin._id, categoria: 'AVENTURA', duracionHoras: 3, precio: 35, consejos: ['Lleva chanclas para caminar sobre la nieve', 'El pelo se congela al salir, ¡foto obligatoria!'] },
    { nombre: 'Esquí en Yabuli', descripcion: 'La estación de esquí más grande de China, sede de los Juegos Asiáticos de Invierno. Pistas para todos los niveles.', ciudad: harbin._id, categoria: 'AVENTURA', duracionHoras: 5, precio: 50, consejos: ['Alquiler de equipo incluido', 'Hay pistas para principiantes'] },
    { nombre: 'Comida rusa en Harbin', descripcion: 'Degustación de la gastronomía ruso-china única de Harbin: borscht, pan negro, embutidos y el famoso helado Madier.', ciudad: harbin._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 20, consejos: ['El restaurante Huamei es el más emblemático', 'Prueba el kvass (bebida fermentada rusa)'] },
    { nombre: 'Aldea de la Nieve (Xuexiang)', descripcion: 'Excursión a la pintoresca aldea cubierta de nieve virgen. Casas con techos nevados como en un cuento de hadas. Escenario de varias películas chinas.', ciudad: harbin._id, categoria: 'NATURALEZA', duracionHoras: 8, precio: 55, consejos: ['Es un viaje largo (5h en coche), merece la pena', 'Quédate a dormir en la aldea para la experiencia completa'] },
  ]);

  console.log('Actividades creadas');

  // ========== GUIDES ==========
  const guides = [];

  // --- PEKÍN: 3 guías ---
  guides.push({
    titulo: 'Pekín Imperial - Lo Esencial',
    descripcion: 'Descubre lo mejor de la capital china en 3 días: desde la majestuosa Ciudad Prohibida hasta la Gran Muralla, pasando por la gastronomía local y los hutongs tradicionales. Un viaje completo por la historia imperial de China.',
    ciudad: pekin._id,
    duracionDias: 3,
    precio: 299,
    imagen: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Historia Imperial', actividades: [
        { actividad: pekinActs[7]._id, orden: 1, horaInicio: '08:30', horaFin: '10:00' },
        { actividad: pekinActs[0]._id, orden: 2, horaInicio: '10:30', horaFin: '14:30' },
        { actividad: pekinActs[2]._id, orden: 3, horaInicio: '15:30', horaFin: '18:00' },
        { actividad: pekinActs[4]._id, orden: 4, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 2, titulo: 'La Gran Muralla', actividades: [
        { actividad: pekinActs[1]._id, orden: 1, horaInicio: '07:30', horaFin: '13:30' },
        { actividad: pekinActs[3]._id, orden: 2, horaInicio: '15:30', horaFin: '18:30' },
        { actividad: pekinActs[5]._id, orden: 3, horaInicio: '20:00', horaFin: '22:00' },
      ]},
      { numeroDia: 3, titulo: 'Arte y Jardines', actividades: [
        { actividad: pekinActs[6]._id, orden: 1, horaInicio: '09:00', horaFin: '12:30' },
        { actividad: pekinActs[8]._id, orden: 2, horaInicio: '14:00', horaFin: '17:00' },
        { actividad: pekinActs[9]._id, orden: 3, horaInicio: '19:30', horaFin: '21:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Pekín Express - Fin de Semana',
    descripcion: 'Un recorrido intenso de 2 días por los imprescindibles de Pekín. Perfecto para quienes tienen poco tiempo pero no quieren perderse lo esencial de la capital china.',
    ciudad: pekin._id,
    duracionDias: 2,
    precio: 199,
    imagen: 'https://images.unsplash.com/photo-1529921879218-f99546d03a27?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Pekín Histórico', actividades: [
        { actividad: pekinActs[7]._id, orden: 1, horaInicio: '08:30', horaFin: '10:00' },
        { actividad: pekinActs[0]._id, orden: 2, horaInicio: '10:30', horaFin: '14:30' },
        { actividad: pekinActs[4]._id, orden: 3, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 2, titulo: 'La Gran Muralla y Hutongs', actividades: [
        { actividad: pekinActs[1]._id, orden: 1, horaInicio: '07:30', horaFin: '13:30' },
        { actividad: pekinActs[3]._id, orden: 2, horaInicio: '16:00', horaFin: '19:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Pekín Completo - 5 Días',
    descripcion: 'El circuito más completo por Pekín. 5 días para explorar cada rincón de la capital: palacios, murallas, templos, arte contemporáneo, gastronomía y vida nocturna. Sin prisas.',
    ciudad: pekin._id,
    duracionDias: 5,
    precio: 459,
    imagen: 'https://images.unsplash.com/photo-1584266032559-fe81b45d3169?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Bienvenida a Pekín', actividades: [
        { actividad: pekinActs[7]._id, orden: 1, horaInicio: '09:00', horaFin: '10:30' },
        { actividad: pekinActs[0]._id, orden: 2, horaInicio: '11:00', horaFin: '15:00' },
        { actividad: pekinActs[4]._id, orden: 3, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 2, titulo: 'La Gran Muralla', actividades: [
        { actividad: pekinActs[1]._id, orden: 1, horaInicio: '07:30', horaFin: '13:30' },
        { actividad: pekinActs[5]._id, orden: 2, horaInicio: '20:00', horaFin: '22:00' },
      ]},
      { numeroDia: 3, titulo: 'Templos y Jardines', actividades: [
        { actividad: pekinActs[2]._id, orden: 1, horaInicio: '08:30', horaFin: '11:00' },
        { actividad: pekinActs[6]._id, orden: 2, horaInicio: '13:00', horaFin: '16:30' },
        { actividad: pekinActs[9]._id, orden: 3, horaInicio: '19:30', horaFin: '21:00' },
      ]},
      { numeroDia: 4, titulo: 'Hutongs y Arte', actividades: [
        { actividad: pekinActs[3]._id, orden: 1, horaInicio: '09:30', horaFin: '12:30' },
        { actividad: pekinActs[8]._id, orden: 2, horaInicio: '14:00', horaFin: '17:00' },
      ]},
      { numeroDia: 5, titulo: 'Día Libre y Despedida', actividades: [
        { actividad: pekinActs[5]._id, orden: 1, horaInicio: '11:00', horaFin: '13:00' },
      ]},
    ],
  });

  // --- SHANGHÁI: 3 guías ---
  guides.push({
    titulo: 'Shanghái Moderna y Clásica',
    descripcion: 'Descubre el contraste único de Shanghái en 3 días: rascacielos futuristas frente a jardines centenarios, dumplings al vapor junto a cocina de autor. La ciudad que nunca duerme.',
    ciudad: shanghai._id,
    duracionDias: 3,
    precio: 319,
    imagen: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Iconos de Shanghái', actividades: [
        { actividad: shanghaiActs[0]._id, orden: 1, horaInicio: '10:00', horaFin: '12:00' },
        { actividad: shanghaiActs[1]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
        { actividad: shanghaiActs[3]._id, orden: 3, horaInicio: '18:00', horaFin: '19:30' },
        { actividad: shanghaiActs[5]._id, orden: 4, horaInicio: '20:30', horaFin: '22:00' },
      ]},
      { numeroDia: 2, titulo: 'Tradición y Cultura', actividades: [
        { actividad: shanghaiActs[2]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: shanghaiActs[6]._id, orden: 2, horaInicio: '13:00', horaFin: '16:00' },
        { actividad: shanghaiActs[8]._id, orden: 3, horaInicio: '17:00', horaFin: '19:30' },
      ]},
      { numeroDia: 3, titulo: 'Aventura y Compras', actividades: [
        { actividad: shanghaiActs[4]._id, orden: 1, horaInicio: '09:30', horaFin: '12:30' },
        { actividad: shanghaiActs[9]._id, orden: 2, horaInicio: '15:00', horaFin: '17:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Shanghái Express - 2 Días',
    descripcion: 'Lo mejor de Shanghái en un fin de semana: el Bund, Pudong, xiaolongbao y un crucero nocturno por el río Huangpu.',
    ciudad: shanghai._id,
    duracionDias: 2,
    precio: 219,
    imagen: 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'El Bund y Pudong', actividades: [
        { actividad: shanghaiActs[0]._id, orden: 1, horaInicio: '10:00', horaFin: '12:00' },
        { actividad: shanghaiActs[1]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
        { actividad: shanghaiActs[5]._id, orden: 3, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Ciudad Antigua y Gastronomía', actividades: [
        { actividad: shanghaiActs[2]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: shanghaiActs[3]._id, orden: 2, horaInicio: '12:00', horaFin: '13:30' },
        { actividad: shanghaiActs[9]._id, orden: 3, horaInicio: '15:00', horaFin: '17:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Shanghái y Alrededores - 4 Días',
    descripcion: 'Shanghái a fondo más una excursión al pueblo acuático de Zhujiajiao. Cultura, gastronomía, historia y naturaleza en 4 días completos.',
    ciudad: shanghai._id,
    duracionDias: 4,
    precio: 419,
    imagen: 'https://images.unsplash.com/photo-1474181628009-58356aaafef4?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada y Bund', actividades: [
        { actividad: shanghaiActs[0]._id, orden: 1, horaInicio: '16:00', horaFin: '18:00' },
        { actividad: shanghaiActs[5]._id, orden: 2, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Shanghái Histórica', actividades: [
        { actividad: shanghaiActs[2]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: shanghaiActs[6]._id, orden: 2, horaInicio: '13:00', horaFin: '16:00' },
        { actividad: shanghaiActs[3]._id, orden: 3, horaInicio: '18:00', horaFin: '19:30' },
      ]},
      { numeroDia: 3, titulo: 'Pueblo de Agua', actividades: [
        { actividad: shanghaiActs[7]._id, orden: 1, horaInicio: '09:00', horaFin: '14:00' },
        { actividad: shanghaiActs[8]._id, orden: 2, horaInicio: '16:00', horaFin: '18:30' },
      ]},
      { numeroDia: 4, titulo: 'Moderna y Despedida', actividades: [
        { actividad: shanghaiActs[1]._id, orden: 1, horaInicio: '10:00', horaFin: '12:00' },
        { actividad: shanghaiActs[4]._id, orden: 2, horaInicio: '14:00', horaFin: '17:00' },
      ]},
    ],
  });

  // --- CHENGDÚ: 3 guías ---
  guides.push({
    titulo: 'Chengdú - Pandas y Sabores',
    descripcion: 'Un viaje de 3 días al corazón de Sichuan: pandas gigantes, hot pot legendario, espectáculos de ópera y templos milenarios. Una experiencia que despierta todos los sentidos.',
    ciudad: chengdu._id,
    duracionDias: 3,
    precio: 279,
    imagen: 'https://images.unsplash.com/photo-1600112356623-90c0ad8a5224?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Pandas y Cultura', actividades: [
        { actividad: chengduActs[0]._id, orden: 1, horaInicio: '08:00', horaFin: '12:00' },
        { actividad: chengduActs[3]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: chengduActs[2]._id, orden: 3, horaInicio: '18:30', horaFin: '20:30' },
      ]},
      { numeroDia: 2, titulo: 'Templos y Ópera', actividades: [
        { actividad: chengduActs[4]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: chengduActs[6]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: chengduActs[1]._id, orden: 3, horaInicio: '19:30', horaFin: '21:30' },
      ]},
      { numeroDia: 3, titulo: 'Cocina y Naturaleza', actividades: [
        { actividad: chengduActs[8]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: chengduActs[7]._id, orden: 2, horaInicio: '14:00', horaFin: '20:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Chengdú Express - 2 Días',
    descripcion: 'Los imprescindibles de Chengdú en un fin de semana: pandas por la mañana, hot pot al mediodía y cambio de caras por la noche.',
    ciudad: chengdu._id,
    duracionDias: 2,
    precio: 189,
    imagen: 'https://images.unsplash.com/photo-1564577160324-112d603f750f?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Pandas y Gastronomía', actividades: [
        { actividad: chengduActs[0]._id, orden: 1, horaInicio: '08:00', horaFin: '12:00' },
        { actividad: chengduActs[2]._id, orden: 2, horaInicio: '18:00', horaFin: '20:00' },
        { actividad: chengduActs[1]._id, orden: 3, horaInicio: '20:30', horaFin: '22:30' },
      ]},
      { numeroDia: 2, titulo: 'Templos y Callejones', actividades: [
        { actividad: chengduActs[4]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: chengduActs[3]._id, orden: 2, horaInicio: '12:00', horaFin: '14:30' },
        { actividad: chengduActs[6]._id, orden: 3, horaInicio: '15:30', horaFin: '18:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Chengdú y el Buda de Leshan - 4 Días',
    descripcion: 'Circuito completo por Chengdú y sus alrededores. Incluye excursión al Buda Gigante de Leshan (Patrimonio UNESCO), Monte Qingcheng, pandas y la mejor gastronomía sichuanesa.',
    ciudad: chengdu._id,
    duracionDias: 4,
    precio: 399,
    imagen: 'https://images.unsplash.com/photo-1598887142487-3c854d51eabb?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada y Centro', actividades: [
        { actividad: chengduActs[3]._id, orden: 1, horaInicio: '15:00', horaFin: '17:30' },
        { actividad: chengduActs[2]._id, orden: 2, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 2, titulo: 'Pandas y Ópera', actividades: [
        { actividad: chengduActs[0]._id, orden: 1, horaInicio: '08:00', horaFin: '12:00' },
        { actividad: chengduActs[4]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
        { actividad: chengduActs[1]._id, orden: 3, horaInicio: '19:30', horaFin: '21:30' },
      ]},
      { numeroDia: 3, titulo: 'Buda Gigante de Leshan', actividades: [
        { actividad: chengduActs[5]._id, orden: 1, horaInicio: '08:00', horaFin: '15:00' },
        { actividad: chengduActs[8]._id, orden: 2, horaInicio: '17:00', horaFin: '20:00' },
      ]},
      { numeroDia: 4, titulo: 'Monte Qingcheng', actividades: [
        { actividad: chengduActs[7]._id, orden: 1, horaInicio: '08:00', horaFin: '14:00' },
        { actividad: chengduActs[6]._id, orden: 2, horaInicio: '16:00', horaFin: '18:30' },
      ]},
    ],
  });

  // --- CHONGQING: 3 guías ---
  guides.push({
    titulo: 'Chongqing - La Ciudad Montaña',
    descripcion: '3 días en la ciudad más espectacular de China: edificios colgantes sobre acantilados, hot pot de fuego, monorraíl atravesando edificios y cruceros por el Yangtsé.',
    ciudad: chongqing._id,
    duracionDias: 3,
    precio: 269,
    imagen: 'https://images.unsplash.com/photo-1607500535696-51e0ea71de0e?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Bienvenida Ardiente', actividades: [
        { actividad: chongqingActs[0]._id, orden: 1, horaInicio: '15:00', horaFin: '17:30' },
        { actividad: chongqingActs[1]._id, orden: 2, horaInicio: '18:30', horaFin: '20:30' },
        { actividad: chongqingActs[4]._id, orden: 3, horaInicio: '21:00', horaFin: '23:00' },
      ]},
      { numeroDia: 2, titulo: 'Exploración Urbana', actividades: [
        { actividad: chongqingActs[2]._id, orden: 1, horaInicio: '09:00', horaFin: '10:00' },
        { actividad: chongqingActs[3]._id, orden: 2, horaInicio: '10:30', horaFin: '13:30' },
        { actividad: chongqingActs[6]._id, orden: 3, horaInicio: '15:00', horaFin: '15:30' },
        { actividad: chongqingActs[7]._id, orden: 4, horaInicio: '16:00', horaFin: '18:00' },
      ]},
      { numeroDia: 3, titulo: 'Arte Rupestre de Dazu', actividades: [
        { actividad: chongqingActs[5]._id, orden: 1, horaInicio: '08:00', horaFin: '15:00' },
        { actividad: chongqingActs[8]._id, orden: 2, horaInicio: '17:00', horaFin: '18:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Chongqing Nocturna - 2 Días',
    descripcion: 'Chongqing brilla de noche. Un circuito de 2 días centrado en las experiencias nocturnas: Hongya Cave iluminada, crucero por el Yangtsé, hot pot y vida urbana.',
    ciudad: chongqing._id,
    duracionDias: 2,
    precio: 179,
    imagen: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada y Hot Pot', actividades: [
        { actividad: chongqingActs[2]._id, orden: 1, horaInicio: '14:00', horaFin: '15:00' },
        { actividad: chongqingActs[0]._id, orden: 2, horaInicio: '16:00', horaFin: '18:30' },
        { actividad: chongqingActs[1]._id, orden: 3, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 2, titulo: 'Pueblo Antiguo y Crucero', actividades: [
        { actividad: chongqingActs[3]._id, orden: 1, horaInicio: '09:30', horaFin: '12:30' },
        { actividad: chongqingActs[6]._id, orden: 2, horaInicio: '16:00', horaFin: '16:30' },
        { actividad: chongqingActs[4]._id, orden: 3, horaInicio: '20:00', horaFin: '23:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Chongqing Completo - 5 Días',
    descripcion: 'El circuito definitivo por Chongqing: ciudad, arte rupestre de Dazu (UNESCO), crucero por el Yangtsé, gastronomía picante y la experiencia del monorraíl más surrealista del mundo.',
    ciudad: chongqing._id,
    duracionDias: 5,
    precio: 449,
    imagen: 'https://images.unsplash.com/photo-1598887142487-3c854d51eabb?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada a la Ciudad Montaña', actividades: [
        { actividad: chongqingActs[7]._id, orden: 1, horaInicio: '15:00', horaFin: '17:00' },
        { actividad: chongqingActs[0]._id, orden: 2, horaInicio: '18:00', horaFin: '20:30' },
        { actividad: chongqingActs[1]._id, orden: 3, horaInicio: '21:00', horaFin: '23:00' },
      ]},
      { numeroDia: 2, titulo: 'Transporte Insólito', actividades: [
        { actividad: chongqingActs[8]._id, orden: 1, horaInicio: '08:30', horaFin: '09:30' },
        { actividad: chongqingActs[2]._id, orden: 2, horaInicio: '10:00', horaFin: '11:00' },
        { actividad: chongqingActs[6]._id, orden: 3, horaInicio: '11:30', horaFin: '12:00' },
        { actividad: chongqingActs[3]._id, orden: 4, horaInicio: '14:00', horaFin: '17:00' },
      ]},
      { numeroDia: 3, titulo: 'Arte Rupestre de Dazu', actividades: [
        { actividad: chongqingActs[5]._id, orden: 1, horaInicio: '08:00', horaFin: '15:00' },
      ]},
      { numeroDia: 4, titulo: 'Río Yangtsé', actividades: [
        { actividad: chongqingActs[4]._id, orden: 1, horaInicio: '10:00', horaFin: '13:00' },
        { actividad: chongqingActs[7]._id, orden: 2, horaInicio: '15:00', horaFin: '17:00' },
      ]},
      { numeroDia: 5, titulo: 'Despedida Picante', actividades: [
        { actividad: chongqingActs[8]._id, orden: 1, horaInicio: '09:00', horaFin: '10:00' },
      ]},
    ],
  });

  // --- HARBIN: 3 guías ---
  guides.push({
    titulo: 'Harbin - Reino del Hielo',
    descripcion: 'Vive el invierno más espectacular del mundo en 3 días: esculturas de hielo gigantes iluminadas, nieve infinita, tigres siberianos, aguas termales rodeadas de nieve y gastronomía ruso-china.',
    ciudad: harbin._id,
    duracionDias: 3,
    precio: 349,
    imagen: 'https://images.unsplash.com/photo-1548018560-c7196e4f5bba?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada al Hielo', actividades: [
        { actividad: harbinActs[2]._id, orden: 1, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: harbinActs[3]._id, orden: 2, horaInicio: '17:00', horaFin: '18:30' },
        { actividad: harbinActs[0]._id, orden: 3, horaInicio: '19:30', horaFin: '23:30' },
      ]},
      { numeroDia: 2, titulo: 'Nieve y Tigres', actividades: [
        { actividad: harbinActs[1]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: harbinActs[4]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: harbinActs[7]._id, orden: 3, horaInicio: '18:00', horaFin: '20:00' },
      ]},
      { numeroDia: 3, titulo: 'Termas y Esquí', actividades: [
        { actividad: harbinActs[5]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: harbinActs[6]._id, orden: 2, horaInicio: '14:00', horaFin: '19:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Harbin Express - 2 Días',
    descripcion: 'Lo esencial de Harbin en un fin de semana invernal: el Festival de Hielo de noche, esculturas de nieve de día, arquitectura rusa y gastronomía única.',
    ciudad: harbin._id,
    duracionDias: 2,
    precio: 229,
    imagen: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Hielo y Fuego', actividades: [
        { actividad: harbinActs[2]._id, orden: 1, horaInicio: '13:00', horaFin: '15:30' },
        { actividad: harbinActs[3]._id, orden: 2, horaInicio: '16:00', horaFin: '17:30' },
        { actividad: harbinActs[7]._id, orden: 3, horaInicio: '18:00', horaFin: '20:00' },
        { actividad: harbinActs[0]._id, orden: 4, horaInicio: '20:30', horaFin: '23:30' },
      ]},
      { numeroDia: 2, titulo: 'Nieve y Tigres', actividades: [
        { actividad: harbinActs[1]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: harbinActs[4]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Harbin y Aldea de la Nieve - 5 Días',
    descripcion: 'La experiencia invernal definitiva: Festival de Hielo, esquí en Yabuli, aguas termales, tigres siberianos y excursión a la mágica Aldea de la Nieve (Xuexiang). Un viaje de cuento de hadas helado.',
    ciudad: harbin._id,
    duracionDias: 5,
    precio: 549,
    imagen: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Bienvenida a Harbin', actividades: [
        { actividad: harbinActs[2]._id, orden: 1, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: harbinActs[3]._id, orden: 2, horaInicio: '17:00', horaFin: '18:30' },
        { actividad: harbinActs[0]._id, orden: 3, horaInicio: '19:30', horaFin: '23:30' },
      ]},
      { numeroDia: 2, titulo: 'Nieve y Fauna', actividades: [
        { actividad: harbinActs[1]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: harbinActs[4]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: harbinActs[7]._id, orden: 3, horaInicio: '18:00', horaFin: '20:00' },
      ]},
      { numeroDia: 3, titulo: 'Esquí en Yabuli', actividades: [
        { actividad: harbinActs[6]._id, orden: 1, horaInicio: '09:00', horaFin: '14:00' },
        { actividad: harbinActs[5]._id, orden: 2, horaInicio: '16:00', horaFin: '19:00' },
      ]},
      { numeroDia: 4, titulo: 'Aldea de la Nieve', actividades: [
        { actividad: harbinActs[8]._id, orden: 1, horaInicio: '07:00', horaFin: '15:00' },
      ]},
      { numeroDia: 5, titulo: 'Despedida Helada', actividades: [
        { actividad: harbinActs[2]._id, orden: 1, horaInicio: '10:00', horaFin: '12:30' },
        { actividad: harbinActs[0]._id, orden: 2, horaInicio: '19:00', horaFin: '22:00' },
      ]},
    ],
  });

  await Guide.create(guides);
  console.log('Guías creadas (15 guías para 5 ciudades)');

  // ========== HOTELS ==========
  await Hotel.create([
    { nombre: 'Hotel Pekín Imperial', ciudad: pekin._id, estrellas: 5, precioPorNoche: 120, descripcion: 'Hotel de lujo junto a la Ciudad Prohibida con spa y restaurante gourmet.' },
    { nombre: 'Hutong Boutique Inn', ciudad: pekin._id, estrellas: 3, precioPorNoche: 45, descripcion: 'Encantador hotel boutique en un hutong tradicional restaurado.' },
    { nombre: 'The Bund Riverside Hotel', ciudad: shanghai._id, estrellas: 5, precioPorNoche: 150, descripcion: 'Vistas panorámicas al Bund y Pudong desde cada habitación.' },
    { nombre: 'Shanghai Garden Hotel', ciudad: shanghai._id, estrellas: 4, precioPorNoche: 80, descripcion: 'Hotel con jardín en la Concesión Francesa. Tranquilo y elegante.' },
    { nombre: 'Chengdu Panda Inn', ciudad: chengdu._id, estrellas: 4, precioPorNoche: 55, descripcion: 'Hotel temático de pandas con decoración divertida cerca del centro.' },
    { nombre: 'Jinli Heritage Hotel', ciudad: chengdu._id, estrellas: 5, precioPorNoche: 95, descripcion: 'Hotel boutique de lujo junto a la calle Jinli con estilo tradicional sichuanés.' },
    { nombre: 'Chongqing Hilltop Hotel', ciudad: chongqing._id, estrellas: 4, precioPorNoche: 65, descripcion: 'Hotel con vistas al río Yangtsé desde la cima de la colina.' },
    { nombre: 'Hongya Cave Hotel', ciudad: chongqing._id, estrellas: 3, precioPorNoche: 40, descripcion: 'Hotel económico junto a Hongya Cave con vistas nocturnas espectaculares.' },
    { nombre: 'Harbin Ice Hotel', ciudad: harbin._id, estrellas: 4, precioPorNoche: 70, descripcion: 'Hotel temático de hielo con calefacción de primera. A 5 min del Festival de Hielo.' },
    { nombre: 'Sofia Art Hotel', ciudad: harbin._id, estrellas: 5, precioPorNoche: 110, descripcion: 'Hotel de estilo ruso junto a la Catedral de Santa Sofía. Elegancia y confort.' },
  ]);
  console.log('Hoteles creados');

  // ========== FLIGHTS ==========
  await Flight.create([
    { aerolinea: 'Air China', origen: 'Madrid', destino: 'Pekín', ciudadDestino: pekin._id, precio: 550, duracionHoras: 11 },
    { aerolinea: 'China Eastern', origen: 'Madrid', destino: 'Shanghái', ciudadDestino: shanghai._id, precio: 520, duracionHoras: 12 },
    { aerolinea: 'Iberia', origen: 'Madrid', destino: 'Shanghái', ciudadDestino: shanghai._id, precio: 620, duracionHoras: 11.5 },
    { aerolinea: 'Air China', origen: 'Barcelona', destino: 'Pekín', ciudadDestino: pekin._id, precio: 570, duracionHoras: 11.5 },
    { aerolinea: 'Sichuan Airlines', origen: 'Madrid', destino: 'Chengdú', ciudadDestino: chengdu._id, precio: 580, duracionHoras: 12 },
    { aerolinea: 'China Southern', origen: 'Madrid', destino: 'Chongqing', ciudadDestino: chongqing._id, precio: 560, duracionHoras: 12.5 },
    { aerolinea: 'Hainan Airlines', origen: 'Madrid', destino: 'Pekín (escala Harbin)', ciudadDestino: harbin._id, precio: 620, duracionHoras: 14 },
    { aerolinea: 'Air China', origen: 'Barcelona', destino: 'Shanghái', ciudadDestino: shanghai._id, precio: 540, duracionHoras: 12 },
  ]);
  console.log('Vuelos creados');

  // ========== CULTURE ARTICLES ==========
  await CultureArticle.create([
    {
      titulo: 'El Año Nuevo Chino: La fiesta más importante de Asia',
      resumen: 'Todo lo que necesitas saber sobre la celebración más grande del mundo: tradiciones, comida, decoraciones y cómo vivirlo.',
      contenido: '<p>El Año Nuevo Chino (春节) es la celebración más importante del calendario chino, con festividades que duran 15 días. Las calles se llenan de decoraciones rojas y doradas, se realizan danzas del león y del dragón, y las familias se reúnen para cenar juntas.</p><p>Los fuegos artificiales iluminan el cielo y los niños reciben sobres rojos (hongbao) con dinero de la suerte. Si visitas China durante esta época, prepárate para una experiencia inolvidable.</p>',
      categoria: 'FESTIVALES',
      ciudad: pekin._id,
    },
    {
      titulo: 'Sichuan: La cocina más picante de China',
      resumen: 'La pimienta de Sichuan, el ma la y los platos imprescindibles de la provincia más gastronómica de China.',
      contenido: '<p>La cocina de Sichuan (四川菜) es famosa por su uso audaz de la pimienta de Sichuan (花椒), que produce una sensación de adormecimiento conocida como "ma". El sabor ma la combina este adormecimiento con el picante del chile.</p><p>El hot pot sichuanés es el plato más emblemático. Otros imprescindibles: mapo tofu, kung pao chicken y dan dan noodles.</p>',
      categoria: 'GASTRONOMIA',
      ciudad: chengdu._id,
    },
    {
      titulo: 'El Hot Pot de Chongqing: Fuego líquido',
      resumen: 'La historia del hot pot original de Chongqing y por qué es diferente al de Chengdú.',
      contenido: '<p>Chongqing es la cuna del hot pot chino. Los trabajadores del puerto del Yangtsé inventaron este plato para calentarse en invierno, usando las partes menos nobles del buey cocinadas en caldo picante.</p><p>A diferencia del hot pot de Chengdú (más suave), el de Chongqing usa más aceite y chile, resultando en un caldo rojo intenso que es un desafío para los no iniciados. Se dice que si sobrevives a un hot pot de Chongqing, puedes con cualquier picante del mundo.</p>',
      categoria: 'GASTRONOMIA',
      ciudad: chongqing._id,
    },
    {
      titulo: 'Harbin: La increíble ciudad de hielo',
      resumen: 'Cómo una ciudad china se convirtió en la capital mundial de las esculturas de hielo.',
      contenido: '<p>Cada invierno, Harbin se transforma en un mundo de fantasía helada. El Festival Internacional de Esculturas de Hielo y Nieve comenzó en 1963 y se ha convertido en el mayor del mundo.</p><p>Artistas de todo el planeta tallan edificios, castillos y monumentos gigantes en bloques de hielo extraídos del río Songhua. Por la noche, luces LED de colores iluminan las esculturas creando un espectáculo mágico a temperaturas de -30°C.</p>',
      categoria: 'FESTIVALES',
      ciudad: harbin._id,
    },
    {
      titulo: 'La ceremonia del té: Ritual milenario',
      resumen: 'Todo sobre el gongfu cha, los tipos de té chino y la etiqueta para participar en una ceremonia tradicional.',
      contenido: '<p>El té es la bebida nacional de China y su ceremonia (茶道) refleja la filosofía y espiritualidad china. China produce miles de variedades agrupadas en seis familias: verde, blanco, amarillo, oolong, rojo y pu-erh.</p><p>Cuando alguien te sirve té, toca la mesa con dos dedos como gesto de agradecimiento. Es una tradición de la dinastía Qing.</p>',
      categoria: 'TRADICIONES',
    },
    {
      titulo: 'Frases básicas en mandarín para viajeros',
      resumen: 'Las 30 frases esenciales en chino mandarín que todo viajero español debería conocer.',
      contenido: '<p><strong>Saludos:</strong> Nǐ hǎo (你好) - Hola | Xièxie (谢谢) - Gracias | Zàijiàn (再见) - Adiós</p><p><strong>Básicos:</strong> Duōshao qián? (多少钱?) - ¿Cuánto cuesta? | Wǒ bù dǒng (我不懂) - No entiendo | Cèsuǒ zài nǎlǐ? (厕所在哪里?) - ¿Dónde está el baño?</p><p><strong>Comida:</strong> Hǎo chī (好吃) - Delicioso | Bú là (不辣) - Sin picante | Mǎi dān (买单) - La cuenta</p>',
      categoria: 'IDIOMA',
    },
    {
      titulo: 'La Gran Muralla: Historia y consejos prácticos',
      resumen: 'Historia de la construcción más impresionante de la humanidad y guía práctica para visitarla.',
      contenido: '<p>La Gran Muralla China (长城) se extiende más de 21.000 km, construida a lo largo de más de 2.000 años. Las secciones más accesibles desde Pekín son Mutianyu (recomendada), Badaling (más turística) y Jinshanling (para senderistas).</p><p>Consejos: lleva agua, calzado de montaña, protector solar y ve temprano.</p>',
      categoria: 'HISTORIA',
      ciudad: pekin._id,
    },
  ]);
  console.log('Artículos de cultura creados');

  console.log('\n✓ Seed completado exitosamente');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Ciudades: 5 (Pekín, Shanghái, Chengdú, Chongqing, Harbin)');
  console.log('Guías: 15 (3 por ciudad)');
  console.log('Actividades: 47');
  console.log('Hoteles: 10');
  console.log('Vuelos: 8');
  console.log('Artículos: 7');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Credenciales:');
  console.log('  Admin: admin@chinatravel.com / admin123');
  console.log('  Comercial: comercial@chinatravel.com / comercial123');
  console.log('  Usuario: user@chinatravel.com / user123');

  process.exit(0);
};

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
