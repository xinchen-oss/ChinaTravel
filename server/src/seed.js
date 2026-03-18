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
      imagenPortada: 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Chengdú', nombreChino: '成都', slug: 'chengdu',
      descripcion: 'Capital de Sichuan, famosa por sus pandas gigantes, su gastronomía picante y su estilo de vida relajado. Una ciudad que combina tradición con una escena cultural moderna y vibrante.',
      imagenPortada: 'https://images.unsplash.com/photo-1564577160324-112d603f750f?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Chongqing', nombreChino: '重庆', slug: 'chongqing',
      descripcion: 'La "ciudad montaña" de China, construida sobre colinas junto al río Yangtsé. Famosa por su hot pot, sus impresionantes edificios sobre acantilados, su monorraíl que atraviesa edificios y su vibrante vida nocturna.',
      imagenPortada: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Harbin', nombreChino: '哈尔滨', slug: 'harbin',
      descripcion: 'La "Ciudad de Hielo" en el noreste de China. Famosa mundialmente por su Festival Internacional de Esculturas de Hielo y Nieve, su arquitectura rusa y temperaturas que llegan a -30°C en invierno.',
      imagenPortada: 'https://images.unsplash.com/photo-1548018560-c7196e4f5bba?w=800&q=80',
      destacada: true,
    },
    {
      nombre: "Xi'an", nombreChino: '西安', slug: 'xian',
      descripcion: 'Antigua capital de 13 dinastías y punto de partida de la Ruta de la Seda. Hogar del legendario Ejército de Guerreros de Terracota, murallas medievales intactas y el vibrante barrio musulmán con la mejor comida callejera de China.',
      imagenPortada: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Cantón (Guangzhou)', nombreChino: '广州', slug: 'guangzhou',
      descripcion: 'Capital gastronómica de China y cuna del dim sum. Metrópolis subtropical con 2.200 años de historia, famosa por su cocina cantonesa, la Torre Canton y su papel como puerta comercial del sur de China.',
      imagenPortada: 'https://images.unsplash.com/photo-1583996874892-c47fa3e3aa45?w=800&q=80',
      destacada: false,
    },
    {
      nombre: 'Hangzhou', nombreChino: '杭州', slug: 'hangzhou',
      descripcion: 'La ciudad más romántica de China, declarada "paraíso en la tierra" por Marco Polo. Famosa por el poético Lago del Oeste, las plantaciones de té Longjing, sus templos budistas y una escena tecnológica puntera (sede de Alibaba).',
      imagenPortada: 'https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Guilin', nombreChino: '桂林', slug: 'guilin',
      descripcion: 'Paisajes de montañas kársticas que parecen sacados de una pintura china. Famosa por el crucero por el río Li hasta Yangshuo, los arrozales en terrazas de Longji y cuevas espectaculares.',
      imagenPortada: 'https://images.unsplash.com/photo-1537531383496-f4749b02e080?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Lhasa', nombreChino: '拉萨', slug: 'lhasa',
      descripcion: 'Capital del Tíbet, a 3.650 metros de altitud: "el techo del mundo". Ciudad sagrada del budismo tibetano, hogar del majestuoso Palacio Potala, monasterios centenarios y una espiritualidad que transforma a quien la visita.',
      imagenPortada: 'https://images.unsplash.com/photo-1461823385004-d7660947a7c0?w=800&q=80',
      destacada: false,
    },
    {
      nombre: 'Dali', nombreChino: '大理', slug: 'dali',
      descripcion: 'Ciudad antigua en la provincia de Yunnan, junto al lago Erhai y al pie de la cordillera Cangshan. Cultura Bai, pueblos pesqueros, templos budistas y un ambiente bohemio entre montañas y agua cristalina.',
      imagenPortada: 'https://images.unsplash.com/photo-1559070169-a3077159ee16?w=800&q=80',
      destacada: false,
    },
    {
      nombre: 'Xiamen', nombreChino: '厦门', slug: 'xiamen',
      descripcion: 'Ciudad costera subtropical con la encantadora isla peatonal de Gulangyu (Patrimonio UNESCO), arquitectura colonial, templos budistas sobre el mar y la mejor cultura del té del sur de Fujian.',
      imagenPortada: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80',
      destacada: false,
    },
    {
      nombre: 'Suzhou', nombreChino: '苏州', slug: 'suzhou',
      descripcion: 'La "Venecia de Oriente" con jardines clásicos Patrimonio UNESCO, canales navegables, pagodas y la tradición de la seda más antigua de China. Ciudad de poetas y artesanos.',
      imagenPortada: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80',
      destacada: false,
    },
    {
      nombre: 'Lijiang', nombreChino: '丽江', slug: 'lijiang',
      descripcion: 'Ciudad antigua Naxi a los pies de la Montaña del Dragón de Jade (5.596m). Calles empedradas, canales, puentes de piedra y cultura milenaria Naxi en la provincia de Yunnan.',
      imagenPortada: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Zhangjiajie', nombreChino: '张家界', slug: 'zhangjiajie',
      descripcion: 'Pilares de arenisca que inspiraron las montañas flotantes de Avatar. Puente de cristal a 300m de altura, bosques de niebla y paisajes que desafían la imaginación.',
      imagenPortada: 'https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Kunming', nombreChino: '昆明', slug: 'kunming',
      descripcion: 'La "Ciudad de la Eterna Primavera" con clima perfecto todo el año. Puerta de entrada a Yunnan con el Bosque de Piedra, mercados de flores y diversidad étnica única.',
      imagenPortada: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80',
      destacada: false,
    },
    {
      nombre: 'Nanjing', nombreChino: '南京', slug: 'nanjing',
      descripcion: 'Antigua capital de seis dinastías a orillas del río Yangtsé. Murallas imperiales, el Mausoleo de Sun Yat-sen, lagos de lotos y una escena universitaria vibrante.',
      imagenPortada: 'https://images.unsplash.com/photo-1583425423320-1a6d856b4b02?w=800&q=80',
      destacada: false,
    },
    {
      nombre: 'Dunhuang', nombreChino: '敦煌', slug: 'dunhuang',
      descripcion: 'Oasis en el desierto del Gobi y joya de la Ruta de la Seda. Las Cuevas de Mogao con 1.000 años de arte budista (UNESCO), dunas de arena dorada y lagos en media luna.',
      imagenPortada: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Sanya', nombreChino: '三亚', slug: 'sanya',
      descripcion: 'El "Hawái de China" en la isla tropical de Hainan. Playas de arena blanca, templos budistas sobre el mar, bosques tropicales y la estatua de Guanyin más grande del mundo.',
      imagenPortada: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80',
      destacada: false,
    },
    {
      nombre: 'Pingyao', nombreChino: '平遥', slug: 'pingyao',
      descripcion: 'Ciudad amurallada de la dinastía Ming perfectamente conservada (UNESCO). El primer banco de China, casas patio centenarias y un viaje al pasado imperial sin filtros.',
      imagenPortada: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800&q=80',
      destacada: false,
    },
  ]);
  console.log('Ciudades creadas');

  const [pekin, shanghai, chengdu, chongqing, harbin, xian, guangzhou, hangzhou, guilin, lhasa, dali, xiamen, suzhou, lijiang, zhangjiajie, kunming, nanjing, dunhuang, sanya, pingyao] = cities;

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

  // --- XI'AN ---
  const xianActs = await Activity.create([
    { nombre: 'Guerreros de Terracota', descripcion: 'Visita al mausoleo del emperador Qin Shi Huang con más de 8.000 soldados de arcilla a tamaño real, cada uno con un rostro diferente. Patrimonio UNESCO.', ciudad: xian._id, categoria: 'HISTORICO', duracionHoras: 4, precio: 40, consejos: ['Contrata guía para entender la historia', 'La fosa 1 es la más impresionante', 'Hay 3 fosas abiertas al público'] },
    { nombre: 'Muralla de Xi\'an en bicicleta', descripcion: 'Recorre los 14 km de la muralla medieval mejor conservada de China montado en bicicleta. Vistas panorámicas de la ciudad antigua y moderna.', ciudad: xian._id, categoria: 'AVENTURA', duracionHoras: 2.5, precio: 15, consejos: ['Alquila la bici en la puerta sur', 'Al atardecer es espectacular', 'Hay tándems disponibles'] },
    { nombre: 'Barrio musulmán de Xi\'an', descripcion: 'Laberinto de callejones con la mejor comida callejera de China: roujiamo (hamburguesa china), fideos biang biang y cordero a la brasa. La Gran Mezquita combina arquitectura china e islámica.', ciudad: xian._id, categoria: 'GASTRONOMIA', duracionHoras: 3, precio: 10, consejos: ['Prueba el roujiamo (hamburguesa china)', 'Los fideos biang biang son enormes', 'La Gran Mezquita es preciosa'] },
    { nombre: 'Pagoda del Gran Ganso Salvaje', descripcion: 'Pagoda budista del siglo VII donde el monje Xuanzang tradujo los sutras traídos de India. Fuentes musicales espectaculares por la noche.', ciudad: xian._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 12, consejos: ['El espectáculo de fuentes es a las 20:30', 'Sube a la pagoda para vistas de la ciudad'] },
    { nombre: 'Espectáculo Tang Dynasty', descripcion: 'Show de música y danza de la dinastía Tang con cena imperial. Trajes espectaculares y coreografías históricas en un teatro lujoso.', ciudad: xian._id, categoria: 'NOCTURNO', duracionHoras: 2.5, precio: 45, consejos: ['Reserva con cena incluida', 'Los trajes son impresionantes'] },
    { nombre: 'Templo Famen', descripcion: 'Excursión al templo que alberga una reliquia del dedo de Buda. Arquitectura moderna espectacular y tesoros de la dinastía Tang.', ciudad: xian._id, categoria: 'CULTURAL', duracionHoras: 5, precio: 30, consejos: ['Está a 2 horas de Xi\'an', 'El museo subterráneo es fascinante'] },
    { nombre: 'Monte Huashan', descripcion: 'Una de las cinco montañas sagradas de China. Senderos tallados en acantilados verticales con cadenas. El "sendero más peligroso del mundo" para los valientes.', ciudad: xian._id, categoria: 'AVENTURA', duracionHoras: 8, precio: 35, consejos: ['El teleférico ahorra 3 horas de subida', 'El sendero de tablones no es para todos', 'Madruga para ver el amanecer'] },
    { nombre: 'Clase de fabricación de dumplings', descripcion: 'Aprende a hacer los famosos jiaozi de Xi\'an con un maestro local. Más de 20 formas y rellenos diferentes.', ciudad: xian._id, categoria: 'GASTRONOMIA', duracionHoras: 2.5, precio: 25, consejos: ['Te llevas recetas a casa', 'Los dumplings de Xi\'an son diferentes a los del norte'] },
    { nombre: 'Torre de la Campana y el Tambor', descripcion: 'Dos torres icónicas del centro de Xi\'an, iluminadas espectacularmente de noche. Espectáculos de campanas y tambores durante el día.', ciudad: xian._id, categoria: 'HISTORICO', duracionHoras: 1.5, precio: 8, consejos: ['Compra entrada combinada', 'De noche la iluminación es increíble'] },
  ]);

  // --- CANTÓN (GUANGZHOU) ---
  const guangzhouActs = await Activity.create([
    { nombre: 'Dim Sum en Cantón', descripcion: 'Desayuno tradicional cantonés con dim sum en un restaurante histórico. Carros con vaporeras de har gow, siu mai, char siu bao y decenas de variedades.', ciudad: guangzhou._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 20, consejos: ['Ve temprano, los mejores restaurantes llenan', 'Señala los carros que pasan para elegir', 'Prueba los pies de fénix (garras de pollo)'] },
    { nombre: 'Torre Canton (Canton Tower)', descripcion: 'Sube a la torre de telecomunicaciones más alta de China (600m). Mirador giratorio, paseo al aire libre en la corona y caída libre desde la cima.', ciudad: guangzhou._id, categoria: 'AVENTURA', duracionHoras: 2.5, precio: 25, consejos: ['El paseo exterior es para valientes', 'De noche las vistas del río Perla son mágicas'] },
    { nombre: 'Isla Shamian', descripcion: 'Antigua concesión colonial con arquitectura europea, jardines y ambiente tranquilo. Un oasis de calma en la bulliciosa Cantón con cafés y galerías.', ciudad: guangzhou._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 0, consejos: ['Perfecta para pasear sin prisa', 'Los edificios coloniales están bien conservados'] },
    { nombre: 'Templo ancestral de la familia Chen', descripcion: 'Obra maestra de la arquitectura cantonesa del siglo XIX. Techos decorados con figuras de cerámica, tallas en madera y piedra increíblemente detalladas.', ciudad: guangzhou._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 10, consejos: ['Las figuras del techo son miniaturas increíbles', 'Es el mejor ejemplo de arquitectura cantonesa'] },
    { nombre: 'Crucero nocturno por el río Perla', descripcion: 'Navegación por el río Perla con vistas al skyline iluminado de Cantón, la Torre Canton de colores y los puentes brillantes.', ciudad: guangzhou._id, categoria: 'NOCTURNO', duracionHoras: 1.5, precio: 18, consejos: ['Reserva cubierta superior', 'Las luces empiezan a las 19:00'] },
    { nombre: 'Mercado de medicina Qingping', descripcion: 'Visita al fascinante mercado de medicina tradicional china. Hierbas, raíces, hongos secos y remedios ancestrales de miles de años.', ciudad: guangzhou._id, categoria: 'CULTURAL', duracionHoras: 1.5, precio: 0, consejos: ['No compres sin saber qué es', 'Es una experiencia sensorial única'] },
    { nombre: 'Pato asado cantonés', descripcion: 'Degustación del famoso pato asado cantonés en un restaurante local con piel crujiente y carne jugosa. Diferente al pato pekinés, con sabor más suave.', ciudad: guangzhou._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 22, consejos: ['El pato se asa con miel y especias', 'Pide también char siu (cerdo BBQ cantonés)'] },
    { nombre: 'Jardín Yuexiu y la estatua de los Cinco Carneros', descripcion: 'El mayor parque urbano de Cantón con la emblemática estatua de los Cinco Carneros, símbolo de la ciudad. Incluye la Torre Zhenhai del siglo XIV.', ciudad: guangzhou._id, categoria: 'NATURALEZA', duracionHoras: 2.5, precio: 0, consejos: ['Visita el Museo de Guangzhou dentro del parque', 'La torre tiene vistas panorámicas'] },
    { nombre: 'Calle Beijing Lu (Peatonal)', descripcion: 'La calle comercial más antigua de Cantón con 2.000 años de historia. Excavaciones arqueológicas bajo cristal muestran las diferentes capas de la calle a lo largo de los siglos.', ciudad: guangzhou._id, categoria: 'COMPRAS', duracionHoras: 2, precio: 0, consejos: ['Las ruinas bajo cristal son fascinantes', 'La comida callejera de los laterales es mejor que la de la calle principal'] },
  ]);

  // --- HANGZHOU ---
  const hangzhouActs = await Activity.create([
    { nombre: 'Lago del Oeste en barco', descripcion: 'Navegación por el legendario Lago del Oeste (Patrimonio UNESCO), rodeado de templos, pagodas y jardines. El lago que inspiró a poetas durante 1.000 años.', ciudad: hangzhou._id, categoria: 'NATURALEZA', duracionHoras: 2.5, precio: 15, consejos: ['El atardecer en el lago es mágico', 'La niebla matinal crea un paisaje de pintura'] },
    { nombre: 'Plantaciones de té Longjing', descripcion: 'Visita a las plantaciones del té verde más famoso de China. Recogida de hojas, tostado artesanal y ceremonia del té con vistas a colinas verdes.', ciudad: hangzhou._id, categoria: 'CULTURAL', duracionHoras: 3, precio: 25, consejos: ['La mejor época es en primavera (marzo-abril)', 'Compra té directamente a los agricultores'] },
    { nombre: 'Templo Lingyin', descripcion: 'Uno de los templos budistas más antiguos y grandes de China (328 d.C.). Estatua de Buda de 20m en madera de alcanfor y cuevas con grabados rupestres.', ciudad: hangzhou._id, categoria: 'HISTORICO', duracionHoras: 3, precio: 20, consejos: ['Los grabados de la Roca del Pico Volador son impresionantes', 'Llega temprano para evitar multitudes'] },
    { nombre: 'Calle Hefang', descripcion: 'Calle peatonal histórica con farmacias centenarias, tiendas de artesanía, puestos de comida y espectáculos callejeros. La esencia de la vieja Hangzhou.', ciudad: hangzhou._id, categoria: 'COMPRAS', duracionHoras: 2, precio: 0, consejos: ['La farmacia Huqingyu tiene 140 años', 'Prueba los dulces de azúcar soplado'] },
    { nombre: 'Espectáculo Impression West Lake', descripcion: 'Show nocturno sobre el agua del Lago del Oeste dirigido por Zhang Yimou. Cientos de actores, luces y música sobre el lago. Espectacular.', ciudad: hangzhou._id, categoria: 'NOCTURNO', duracionHoras: 1.5, precio: 40, consejos: ['Solo de marzo a noviembre', 'Las entradas se agotan, reserva con anticipación'] },
    { nombre: 'Pagoda de las Seis Armonías', descripcion: 'Pagoda octogonal del siglo X junto al río Qiantang. 60 metros de altura con vistas al río donde se produce la famosa marea del equinoccio.', ciudad: hangzhou._id, categoria: 'HISTORICO', duracionHoras: 1.5, precio: 10, consejos: ['Si vas en septiembre puedes ver la gran marea', 'Sube todos los pisos para las mejores vistas'] },
    { nombre: 'Cocina de Hangzhou: Dongpo Rou', descripcion: 'Degustación del emblemático cerdo Dongpo (estofado durante 2 horas con salsa de soja y vino) y otras especialidades locales como pollo del mendigo.', ciudad: hangzhou._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 30, consejos: ['El restaurante Louwailou junto al lago es el más famoso', 'Prueba también el pescado del Lago del Oeste con vinagre'] },
    { nombre: 'Paseo en bicicleta por el Lago del Oeste', descripcion: 'Circuito de 15 km alrededor del Lago del Oeste pasando por puentes, pagodas, jardines de lotos y calzadas históricas.', ciudad: hangzhou._id, categoria: 'AVENTURA', duracionHoras: 3, precio: 8, consejos: ['Las bicicletas públicas son gratuitas la primera hora', 'La Calzada Su es la más bonita'] },
    { nombre: 'Museo Nacional del Té', descripcion: 'El único museo del mundo dedicado exclusivamente al té. Historia, variedades, utensilios y ceremonia del té incluida.', ciudad: hangzhou._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 0, consejos: ['Entrada gratuita', 'La degustación de tés raros es de pago pero merece la pena'] },
  ]);

  // --- GUILIN ---
  const guilinActs = await Activity.create([
    { nombre: 'Crucero por el río Li', descripcion: 'Navegación de 4 horas entre Guilin y Yangshuo entre montañas kársticas cubiertas de vegetación. El paisaje que aparece en el billete de 20 yuanes.', ciudad: guilin._id, categoria: 'NATURALEZA', duracionHoras: 5, precio: 45, consejos: ['Lleva cámara con buena batería', 'El tramo Xingping es el más fotogénico', 'Hay barcos VIP con terraza'] },
    { nombre: 'Yangshuo en bicicleta', descripcion: 'Pedalea entre arrozales, ríos y montañas kársticas en los alrededores de Yangshuo. Pueblos rurales, puentes de bambú y búfalos de agua.', ciudad: guilin._id, categoria: 'AVENTURA', duracionHoras: 4, precio: 12, consejos: ['El recorrido del río Yulong es el más bonito', 'Para en Moon Hill para una subida rápida'] },
    { nombre: 'Arrozales en terrazas de Longji', descripcion: 'Excursión a las espectaculares terrazas de arroz de la "Espina Dorsal del Dragón", esculpidas en montañas durante 700 años por las minorías Zhuang y Yao.', ciudad: guilin._id, categoria: 'NATURALEZA', duracionHoras: 8, precio: 40, consejos: ['Junio (verde) y octubre (dorado) son las mejores épocas', 'Duerme en el pueblo para ver el amanecer'] },
    { nombre: 'Cueva de la Flauta de Caña', descripcion: 'Cueva kárstica iluminada con luces multicolor. Estalactitas, estalagmitas y formaciones de 180 millones de años que parecen esculturas fantásticas.', ciudad: guilin._id, categoria: 'NATURALEZA', duracionHoras: 1.5, precio: 15, consejos: ['Las luces crean un efecto surrealista', 'Hay inscripciones de hace 1.300 años en las paredes'] },
    { nombre: 'Espectáculo Impression Liu Sanjie', descripcion: 'Show nocturno al aire libre sobre el río Li dirigido por Zhang Yimou. 600 actores locales con las montañas kársticas reales como escenario natural.', ciudad: guilin._id, categoria: 'NOCTURNO', duracionHoras: 1.5, precio: 35, consejos: ['Reserva asientos VIP del centro', 'Se hace en Yangshuo, no en Guilin ciudad'] },
    { nombre: 'Rafting en el río Yulong', descripcion: 'Descenso tranquilo en balsa de bambú por el río Yulong, entre montañas kársticas, puentes antiguos y vegetación exuberante. Extremadamente relajante.', ciudad: guilin._id, categoria: 'AVENTURA', duracionHoras: 2.5, precio: 20, consejos: ['Más tranquilo que el río Li', 'Lleva protección solar', 'Los barqueros cantan canciones folk'] },
    { nombre: 'Colina de la Trompa de Elefante', descripcion: 'El símbolo de Guilin: una colina con forma de elefante bebiendo agua del río. Pagoda en la cima y cueva con inscripciones budistas.', ciudad: guilin._id, categoria: 'HISTORICO', duracionHoras: 1.5, precio: 10, consejos: ['Las mejores fotos son desde el otro lado del río', 'Al atardecer la luz es perfecta'] },
    { nombre: 'Mercado nocturno de Yangshuo', descripcion: 'Animado mercado con comida callejera local, artesanías y bares en la calle West Street. Fish beer, caracoles de río y brochetas de todo tipo.', ciudad: guilin._id, categoria: 'NOCTURNO', duracionHoras: 2.5, precio: 8, consejos: ['Prueba el fish beer (cerveza con pez)', 'West Street es muy turística pero divertida'] },
    { nombre: 'Clase de pintura china en Yangshuo', descripcion: 'Aprende acuarela china tradicional con un artista local usando el paisaje kárstico como inspiración. Te llevas tu obra a casa.', ciudad: guilin._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 20, consejos: ['No necesitas experiencia previa', 'El profesor habla algo de inglés'] },
  ]);

  // --- LHASA ---
  const lhasaActs = await Activity.create([
    { nombre: 'Palacio Potala', descripcion: 'Residencia de invierno del Dalai Lama durante 300 años. 1.000 habitaciones, 13 pisos sobre una colina roja a 3.700m de altitud. Patrimonio UNESCO.', ciudad: lhasa._id, categoria: 'HISTORICO', duracionHoras: 3, precio: 35, consejos: ['Solo se permiten 1 hora dentro, no te detengas', 'Sube despacio por la altitud', 'Entradas limitadas, reserva con días de anticipación'] },
    { nombre: 'Templo de Jokhang y Barkhor', descripcion: 'El templo más sagrado del budismo tibetano rodeado del circuito de peregrinación Barkhor. Peregrinos postrándose, ruedas de oración y mercado tibetano.', ciudad: lhasa._id, categoria: 'CULTURAL', duracionHoras: 3, precio: 15, consejos: ['Camina en sentido horario como los peregrinos', 'El mercado Barkhor tiene artesanía tibetana auténtica'] },
    { nombre: 'Monasterio de Sera - Debate de monjes', descripcion: 'Asiste al famoso debate filosófico de los monjes budistas en el patio del monasterio de Sera. Palmas, gritos y argumentos sobre la doctrina budista.', ciudad: lhasa._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 10, consejos: ['Los debates son a las 15:00', 'Es un espectáculo fascinante aunque no entiendas tibetano'] },
    { nombre: 'Lago Namtso', descripcion: 'Excursión al lago sagrado más alto del mundo (4.718m). Aguas turquesas rodeadas de montañas nevadas y banderas de oración. Paisaje de otro planeta.', ciudad: lhasa._id, categoria: 'NATURALEZA', duracionHoras: 10, precio: 50, consejos: ['Aclimatarse 2 días antes en Lhasa', 'Lleva ropa muy abrigada', 'La altitud puede causar mareos'] },
    { nombre: 'Té de mantequilla de yak', descripcion: 'Degustación del tradicional té tibetano con mantequilla de yak y tsampa (harina de cebada tostada). Una experiencia gustativa única en una casa de té local.', ciudad: lhasa._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 8, consejos: ['El sabor es salado, no dulce', 'Se bebe para combatir el frío y la altitud'] },
    { nombre: 'Monasterio de Drepung', descripcion: 'El mayor monasterio tibetano, que albergó hasta 10.000 monjes. Enorme complejo en la ladera de la montaña con vistas espectaculares de Lhasa.', ciudad: lhasa._id, categoria: 'HISTORICO', duracionHoras: 3, precio: 12, consejos: ['La cocina del monasterio es fascinante', 'Sube hasta la cima para las mejores vistas'] },
    { nombre: 'Kora alrededor del Potala', descripcion: 'Caminata de peregrinación alrededor del Palacio Potala girando ruedas de oración junto a peregrinos tibetanos. Experiencia espiritual profunda.', ciudad: lhasa._id, categoria: 'CULTURAL', duracionHoras: 1.5, precio: 0, consejos: ['Siempre en sentido horario', 'Al amanecer es más espiritual'] },
    { nombre: 'Comida tibetana: momos y thukpa', descripcion: 'Cena de cocina tibetana auténtica: momos (dumplings tibetanos de yak), thukpa (sopa de fideos) y chang (cerveza de cebada tibetana).', ciudad: lhasa._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 15, consejos: ['Los momos de yak son los más auténticos', 'El chang es suave y ligeramente ácido'] },
  ]);

  // --- DALI ---
  const daliActs = await Activity.create([
    { nombre: 'Ciudad antigua de Dali', descripcion: 'Paseo por la ciudad amurallada con puertas monumentales, calles empedradas, casas Bai blancas, tiendas de artesanía y cafés con vistas a las montañas Cangshan.', ciudad: dali._id, categoria: 'CULTURAL', duracionHoras: 3, precio: 0, consejos: ['La calle Renmin Lu es la principal', 'Sube a la puerta sur para vistas panorámicas'] },
    { nombre: 'Lago Erhai en bicicleta', descripcion: 'Circuito en bicicleta por las orillas del lago Erhai, pasando por pueblos pesqueros Bai, templos y campos de flores con las montañas Cangshan de fondo.', ciudad: dali._id, categoria: 'AVENTURA', duracionHoras: 5, precio: 15, consejos: ['El tramo Caicun-Xizhou es el más bonito', 'Las bicicletas eléctricas están disponibles'] },
    { nombre: 'Tres Pagodas de Chongsheng', descripcion: 'Complejo budista con tres pagodas del siglo IX reflejadas en un estanque. El monumento más icónico de Dali con las montañas Cangshan detrás.', ciudad: dali._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 20, consejos: ['Las mejores fotos son desde el estanque reflectante', 'El templo detrás tiene un museo interesante'] },
    { nombre: 'Mercado de Xizhou', descripcion: 'Mercado matinal del pueblo Bai de Xizhou con productos frescos, hierbas, queso de cabra local y el famoso "abanico de leche" (rushan), un queso frito único de Yunnan.', ciudad: dali._id, categoria: 'GASTRONOMIA', duracionHoras: 2.5, precio: 5, consejos: ['El rushan (abanico de leche) es imprescindible', 'Ve temprano para verlo en plena actividad'] },
    { nombre: 'Senderismo en Cangshan', descripcion: 'Caminata por los senderos de la cordillera Cangshan (4.122m) entre bosques de rododendros, cascadas y vistas del lago Erhai. Teleférico disponible.', ciudad: dali._id, categoria: 'NATURALEZA', duracionHoras: 6, precio: 25, consejos: ['El teleférico te sube a 3.900m', 'Lleva ropa abrigada, arriba hace frío'] },
    { nombre: 'Ceremonia del té Bai "Tres Sabores"', descripcion: 'Ritual tradicional del pueblo Bai: tres tazas de té que representan amargo, dulce y el sabor del recuerdo. Acompañado de danza y música Bai.', ciudad: dali._id, categoria: 'CULTURAL', duracionHoras: 1.5, precio: 12, consejos: ['Es una experiencia filosófica, no solo gastronómica', 'Se hace en casas familiares Bai'] },
    { nombre: 'Pueblo pesquero de Shuanglang', descripcion: 'Encantador pueblo en la orilla este del lago Erhai con hostales boutique, cafés frente al agua y atardeceres legendarios sobre las montañas.', ciudad: dali._id, categoria: 'NATURALEZA', duracionHoras: 3, precio: 0, consejos: ['Los atardeceres son los mejores de Yunnan', 'Quédate a cenar pescado fresco del lago'] },
    { nombre: 'Tie-dye Bai (batik)', descripcion: 'Taller de teñido por reserva (tie-dye) con artesanas del pueblo Bai en Zhoucheng. Aprende la técnica milenaria y crea tu propia pieza.', ciudad: dali._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 18, consejos: ['Te llevas tu creación a casa', 'Zhoucheng es "la capital del tie-dye"'] },
    { nombre: 'Cervecería artesanal Bad Monkey', descripcion: 'Degustación de cervezas artesanales con ingredientes de Yunnan (té pu-erh, pimienta de Sichuan, miel de montaña) en un ambiente bohemio.', ciudad: dali._id, categoria: 'NOCTURNO', duracionHoras: 2, precio: 15, consejos: ['La cerveza de té pu-erh es única', 'Terraza con vistas a las montañas'] },
  ]);

  // --- XIAMEN ---
  const xiamenActs = await Activity.create([
    { nombre: 'Isla de Gulangyu', descripcion: 'Isla peatonal Patrimonio UNESCO con arquitectura colonial, jardines tropicales, playas y el sonido de pianos desde las ventanas. Sin coches ni motos.', ciudad: xiamen._id, categoria: 'CULTURAL', duracionHoras: 5, precio: 15, consejos: ['Reserva el ferry con anticipación', 'Piérdete por los callejones, cada uno tiene sorpresas'] },
    { nombre: 'Templo budista Nanputuo', descripcion: 'Templo budista del siglo VII al pie del Monte Wulao. Uno de los centros más importantes del budismo en el sur de China, con vegetarian restaurant legendario.', ciudad: xiamen._id, categoria: 'HISTORICO', duracionHoras: 2.5, precio: 0, consejos: ['Entrada gratuita', 'El restaurante vegetariano del templo es increíble'] },
    { nombre: 'Ruta costera de Xiamen (Huandao Lu)', descripcion: 'Paseo o ciclismo por la ruta costera de 40 km con playas, esculturas al aire libre, parques y vistas al estrecho de Taiwán.', ciudad: xiamen._id, categoria: 'AVENTURA', duracionHoras: 3, precio: 8, consejos: ['Alquila bicicleta eléctrica', 'La sección de Zengcuo\'an es la más bonita'] },
    { nombre: 'Cultura del té Fujian (Oolong)', descripcion: 'Visita a una casa de té tradicional de Fujian para aprender sobre el té oolong Tieguanyin: cultivo, procesado y ceremonia gongfu cha.', ciudad: xiamen._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 20, consejos: ['El Tieguanyin es el té más famoso de Fujian', 'Compra té directamente, es más barato que en tiendas'] },
    { nombre: 'Marisco en Zengcuo\'an', descripcion: 'Cena de mariscos frescos en el pintoresco pueblo de artistas Zengcuo\'an: ostras a la brasa, gambas borrachas, sopa de almejas y pulpo.', ciudad: xiamen._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 25, consejos: ['Los restaurantes frente al mar son los mejores', 'Las ostras se asan con ajo y vermicelli'] },
    { nombre: 'Jardín botánico Wanshi', descripcion: 'Jardín tropical con más de 6.000 especies, bosques de bambú, cascadas y el famoso "Rain Fog Forest" con niebla artificial entre helechos gigantes.', ciudad: xiamen._id, categoria: 'NATURALEZA', duracionHoras: 3, precio: 8, consejos: ['El Rain Fog Forest es perfecto para fotos', 'Los cactus gigantes son impresionantes'] },
    { nombre: 'Tulou de Fujian (excursión)', descripcion: 'Excursión a las casas comunitarias circulares Tulou de los Hakka (Patrimonio UNESCO). Fortalezas de tierra con hasta 800 personas viviendo dentro. Arquitectura única en el mundo.', ciudad: xiamen._id, categoria: 'HISTORICO', duracionHoras: 9, precio: 50, consejos: ['Están a 3 horas de Xiamen', 'Los Tulou circulares son los más impresionantes', 'Algunos aún están habitados'] },
    { nombre: 'Calle Zhongshan (peatonal)', descripcion: 'Calle histórica con arquitectura qilou (edificios con soportales) estilo del sureste asiático, tiendas locales y puestos de comida callejera.', ciudad: xiamen._id, categoria: 'COMPRAS', duracionHoras: 2, precio: 0, consejos: ['La arquitectura qilou es única del sur de China', 'Prueba el satay noodle (mee satay)'] },
    { nombre: 'Piano Museum en Gulangyu', descripcion: 'Colección de más de 100 pianos antiguos de todo el mundo. Gulangyu es conocida como "la isla de la música" con el mayor número de pianos per cápita de China.', ciudad: xiamen._id, categoria: 'CULTURAL', duracionHoras: 1.5, precio: 10, consejos: ['Hay pianos del siglo XVIII', 'A veces hay conciertos en vivo'] },
  ]);

  // --- SUZHOU ---
  const suzhouActs = await Activity.create([
    { nombre: 'Jardín del Administrador Humilde', descripcion: 'El mayor y más famoso jardín clásico de Suzhou (UNESCO). Estanques, pabellones, puentes y una armonía perfecta entre agua, piedra y vegetación.', ciudad: suzhou._id, categoria: 'HISTORICO', duracionHoras: 2.5, precio: 20, consejos: ['Es el jardín más grande de Suzhou', 'Llega temprano para evitar multitudes'] },
    { nombre: 'Canales de Suzhou en góndola', descripcion: 'Navegación por los canales históricos de Suzhou en barca tradicional. Casas blancas con tejados negros, puentes de piedra y vida local a orillas del agua.', ciudad: suzhou._id, categoria: 'CULTURAL', duracionHoras: 1.5, precio: 15, consejos: ['El tramo de Pingjiang Lu es el más bonito', 'Al atardecer la luz es mágica'] },
    { nombre: 'Museo de la Seda de Suzhou', descripcion: 'Historia de 5.000 años de seda china: desde el gusano hasta el vestido imperial. Demostración en vivo de telares tradicionales.', ciudad: suzhou._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 0, consejos: ['Entrada gratuita', 'La tienda tiene seda de calidad a buen precio'] },
    { nombre: 'Calle Pingjiang Lu', descripcion: 'Calle peatonal junto al canal con casas de la dinastía Ming, tiendas artesanales, cafeterías y música callejera. La esencia romántica de Suzhou.', ciudad: suzhou._id, categoria: 'COMPRAS', duracionHoras: 2.5, precio: 0, consejos: ['Los helados con forma de jardín son famosos', 'Prueba el tofu apestoso (chou doufu)'] },
    { nombre: 'Jardín del Maestro de las Redes', descripcion: 'El jardín más elegante de Suzhou, pequeño pero perfecto. Espectáculo nocturno de ópera kunqu en el jardín bajo la luz de las linternas.', ciudad: suzhou._id, categoria: 'NOCTURNO', duracionHoras: 2, precio: 15, consejos: ['El show nocturno de kunqu es imprescindible', 'Solo de abril a noviembre'] },
    { nombre: 'Colina del Tigre', descripcion: 'La "torre inclinada de China": pagoda de 1.000 años con inclinación de 3°. Leyendas de espadas enterradas, jardines y la tumba del rey de Wu.', ciudad: suzhou._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 12, consejos: ['La pagoda se inclina más que la de Pisa', 'Los jardines de bonsái son preciosos'] },
    { nombre: 'Tongli - Pueblo de agua', descripcion: 'Pueblo acuático a 20 min de Suzhou con 15 puentes de piedra sobre canales. Menos turístico que Zhouzhuang, con ambiente auténtico y casas centenarias.', ciudad: suzhou._id, categoria: 'HISTORICO', duracionHoras: 4, precio: 20, consejos: ['El Jardín de la Reflexión es Patrimonio UNESCO', 'Prueba los trotitas (cerdo estofado de Tongli)'] },
    { nombre: 'Gastronomía de Suzhou', descripcion: 'Degustación de la refinada cocina suzhouesa: fideos de cangrejo, costillas agridulces, pescado de mandarín y el famoso pastel de osmanthus.', ciudad: suzhou._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 25, consejos: ['La cocina de Suzhou es dulce y delicada', 'Los fideos de cangrejo son de temporada (otoño)'] },
  ]);

  // --- LIJIANG ---
  const lijiangActs = await Activity.create([
    { nombre: 'Ciudad antigua de Lijiang', descripcion: 'Laberinto de calles empedradas, canales cristalinos y casas de madera Naxi con tejados curvos. Patrimonio UNESCO con 800 años de historia.', ciudad: lijiang._id, categoria: 'CULTURAL', duracionHoras: 3, precio: 0, consejos: ['Piérdete por los callejones alejados del centro', 'De noche los bares con música Naxi son mágicos'] },
    { nombre: 'Montaña del Dragón de Jade', descripcion: 'Excursión a 4.680m (teleférico) en la montaña sagrada Naxi con glaciar, praderas alpinas y vistas del pico nevado de 5.596m.', ciudad: lijiang._id, categoria: 'AVENTURA', duracionHoras: 6, precio: 45, consejos: ['Compra oxígeno embotellado antes de subir', 'La altitud se nota mucho, ve despacio'] },
    { nombre: 'Espectáculo Impression Lijiang', descripcion: 'Show al aire libre de Zhang Yimou a 3.100m de altitud con la Montaña del Dragón de Jade como telón de fondo. 500 actores de minorías étnicas locales.', ciudad: lijiang._id, categoria: 'NOCTURNO', duracionHoras: 1.5, precio: 35, consejos: ['El espectáculo es por la tarde, no de noche', 'Lleva chaqueta, a esa altitud refresca'] },
    { nombre: 'Garganta del Salto del Tigre', descripcion: 'Una de las gargantas más profundas del mundo (3.900m). Trekking de 2 días o excursión de 1 día por senderos con vistas vertiginosas al río Yangtsé.', ciudad: lijiang._id, categoria: 'AVENTURA', duracionHoras: 8, precio: 30, consejos: ['El sendero alto tiene las mejores vistas', 'Lleva calzado de montaña y agua'] },
    { nombre: 'Estanque del Dragón Negro', descripcion: 'Parque con estanque de aguas cristalinas reflejando la Montaña del Dragón de Jade. La foto más icónica de Lijiang con el puente y la pagoda.', ciudad: lijiang._id, categoria: 'NATURALEZA', duracionHoras: 2, precio: 0, consejos: ['La mejor foto es por la mañana temprano', 'El museo Dongba está dentro del parque'] },
    { nombre: 'Cultura Naxi y música Dongba', descripcion: 'Concierto de la orquesta Naxi con instrumentos ancestrales y música Dongba de 500 años de antigüedad. Una tradición al borde de la extinción.', ciudad: lijiang._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 20, consejos: ['Los músicos tienen más de 70 años', 'Es una de las tradiciones más antiguas vivas'] },
    { nombre: 'Lago Lugu - Reino Mosuo', descripcion: 'Excursión al lago Lugu, hogar de los Mosuo, la última sociedad matriarcal del mundo. Aguas turquesas, canoas y cultura fascinante.', ciudad: lijiang._id, categoria: 'NATURALEZA', duracionHoras: 10, precio: 55, consejos: ['Está a 5h de Lijiang, merece pernoctar', 'Las canoas Mosuo (zhucao) son experiencia obligada'] },
    { nombre: 'Pueblo de Baisha y frescos', descripcion: 'Pequeño pueblo Naxi con frescos budistas del siglo XV y un famoso doctor herbalista. Menos turístico, más auténtico que Lijiang.', ciudad: lijiang._id, categoria: 'HISTORICO', duracionHoras: 2.5, precio: 8, consejos: ['Los frescos mezclan budismo, taoísmo y religión Dongba', 'Se llega en bici desde Lijiang en 30 min'] },
  ]);

  // --- ZHANGJIAJIE ---
  const zhangjiajieActs = await Activity.create([
    { nombre: 'Parque Nacional de Zhangjiajie', descripcion: 'Los pilares de arenisca que inspiraron Pandora en Avatar. Más de 3.000 columnas de piedra entre nubes y vegetación subtropical. Patrimonio UNESCO.', ciudad: zhangjiajie._id, categoria: 'NATURALEZA', duracionHoras: 7, precio: 40, consejos: ['Compra billete para 4 días', 'El ascensor Bailong (326m) es espectacular', 'Madruga para evitar multitudes'] },
    { nombre: 'Puente de cristal de Zhangjiajie', descripcion: 'El puente de cristal más largo y alto del mundo: 430m de largo a 300m sobre el cañón. Suelo transparente con vistas vertiginosas.', ciudad: zhangjiajie._id, categoria: 'AVENTURA', duracionHoras: 2, precio: 30, consejos: ['No mires abajo si tienes vértigo', 'Reserva con antelación, aforo limitado'] },
    { nombre: 'Montaña Tianmen', descripcion: 'Cueva natural gigante en la cima de la montaña (1.518m). Acceso por el teleférico más largo del mundo (7,5 km) y la carretera de 99 curvas.', ciudad: zhangjiajie._id, categoria: 'AVENTURA', duracionHoras: 5, precio: 35, consejos: ['La pasarela de cristal del acantilado es terrorífica', 'Las 999 escaleras hasta la cueva son un reto'] },
    { nombre: 'Arroyo del Látigo Dorado', descripcion: 'Senderismo de 7,5 km por un cañón entre pilares de piedra y vegetación exuberante. El recorrido más bonito y tranquilo del parque, junto a un arroyo cristalino.', ciudad: zhangjiajie._id, categoria: 'NATURALEZA', duracionHoras: 4, precio: 0, consejos: ['Incluido en la entrada del parque', 'Es más tranquilo que la zona de Avatar', 'Hay monos salvajes, no les des comida'] },
    { nombre: 'Ascensor Bailong (Elevador de los 100 Dragones)', descripcion: 'El ascensor exterior más alto del mundo (326m) empotrado en un acantilado. Sube en 2 minutos con vistas panorámicas de los pilares de Avatar.', ciudad: zhangjiajie._id, categoria: 'AVENTURA', duracionHoras: 0.5, precio: 10, consejos: ['Las vistas desde arriba son espectaculares', 'Hay cola larga, ve temprano'] },
    { nombre: 'Espectáculo Tianmen Fox Fairy', descripcion: 'Musical al aire libre en la montaña Tianmen con efectos especiales, danza, fuego y la leyenda del zorro celestial. El espectáculo más impresionante de Hunan.', ciudad: zhangjiajie._id, categoria: 'NOCTURNO', duracionHoras: 1.5, precio: 30, consejos: ['Se representa en la montaña real', 'Lleva chaqueta para la noche'] },
    { nombre: 'Pueblo antiguo de Fenghuang', descripcion: 'Excursión a la "Ciudad del Fénix", pueblo sobre pilotes junto al río Tuojiang. Casas de madera de 300 años, puentes cubiertos y cultura Miao.', ciudad: zhangjiajie._id, categoria: 'HISTORICO', duracionHoras: 9, precio: 35, consejos: ['Está a 4h de Zhangjiajie', 'De noche las casas iluminadas se reflejan en el río'] },
    { nombre: 'Cocina de Hunan (Xiang cai)', descripcion: 'Degustación de la cocina hunanesa: más picante que Sichuan pero sin la pimienta adormecedora. Cerdo rojo de Mao, pescado con chile y tofu ahumado.', ciudad: zhangjiajie._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 18, consejos: ['El cerdo rojo de Mao (su plato favorito) es emblemático', 'La cocina Miao usa muchos encurtidos'] },
  ]);

  // --- KUNMING ---
  const kunmingActs = await Activity.create([
    { nombre: 'Bosque de Piedra (Shilin)', descripcion: 'Formaciones kársticas de 270 millones de años que parecen un bosque petrificado. Laberintos de piedra, cuevas y leyendas del pueblo Sani. Patrimonio UNESCO.', ciudad: kunming._id, categoria: 'NATURALEZA', duracionHoras: 5, precio: 30, consejos: ['El bosque menor es más tranquilo', 'La leyenda de Ashima es preciosa'] },
    { nombre: 'Mercado de flores de Dounan', descripcion: 'El mayor mercado de flores de Asia: millones de flores frescas subastadas cada noche. Rosas, orquídeas, lotos y variedades que no existen en Europa.', ciudad: kunming._id, categoria: 'COMPRAS', duracionHoras: 2.5, precio: 0, consejos: ['La subasta nocturna es fascinante', 'Las rosas de Kunming son famosas mundialmente'] },
    { nombre: 'Templo de Yuantong', descripcion: 'El templo budista más importante de Kunming con 1.200 años de historia. Estanque de lotos, puente de piedra y arquitectura de múltiples dinastías.', ciudad: kunming._id, categoria: 'HISTORICO', duracionHoras: 1.5, precio: 5, consejos: ['Los lotos florecen en verano', 'Es el templo más activo de Kunming'] },
    { nombre: 'Lago Dian en bicicleta', descripcion: 'Pedalea por las orillas del lago Dian (300 km²) entre campos de flores, humedales con aves y vistas a las montañas del oeste. Clima primaveral todo el año.', ciudad: kunming._id, categoria: 'AVENTURA', duracionHoras: 4, precio: 10, consejos: ['El tramo Haigeng Park es el más bonito', 'En invierno llegan gaviotas de Siberia'] },
    { nombre: 'Pueblo étnico de Yunnan', descripcion: 'Parque cultural con réplicas de aldeas de las 25 etnias de Yunnan. Danzas, artesanía, gastronomía y tradiciones de cada pueblo en un solo lugar.', ciudad: kunming._id, categoria: 'CULTURAL', duracionHoras: 4, precio: 20, consejos: ['Los espectáculos de danza son a horas fijas', 'La zona Dai tiene comida exótica'] },
    { nombre: 'Pollo al vapor en olla de barro (Qiguoji)', descripcion: 'Degustación del plato más famoso de Kunming: pollo cocinado al vapor en una olla de barro especial que condensa los sabores. Caldo cristalino y delicado.', ciudad: kunming._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 20, consejos: ['El restaurante Jianxin es el más tradicional', 'El caldo se forma solo con el vapor del pollo'] },
    { nombre: 'Montañas del Oeste (Xishan)', descripcion: 'Senderismo por las montañas que bordean el lago Dian. Templos taoístas y budistas tallados en acantilados, cuevas y vistas panorámicas del lago.', ciudad: kunming._id, categoria: 'NATURALEZA', duracionHoras: 4, precio: 15, consejos: ['La Puerta del Dragón tiene vistas increíbles', 'Se puede subir en teleférico'] },
    { nombre: 'Fideos cruzando el puente (Guoqiao Mixian)', descripcion: 'El plato más icónico de Yunnan: caldo hirviente con aceite que mantiene el calor, donde tú añades los ingredientes uno a uno. Ritual y sabor.', ciudad: kunming._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 12, consejos: ['El caldo parece frío pero quema', 'Añade primero la carne cruda para que se cocine'] },
  ]);

  // --- NANJING ---
  const nanjingActs = await Activity.create([
    { nombre: 'Mausoleo de Sun Yat-sen', descripcion: 'Monumento al padre de la China moderna en la ladera de la Montaña Púrpura. 392 escalones flanqueados por cipreses hasta el mausoleo de mármol blanco y azul.', ciudad: nanjing._id, categoria: 'HISTORICO', duracionHoras: 2.5, precio: 0, consejos: ['Entrada gratuita pero necesitas reservar', 'Los 392 escalones tienen significado simbólico'] },
    { nombre: 'Templo de Confucio (Fuzimiao)', descripcion: 'Complejo de templos, mercados y restaurantes junto al río Qinhuai. Barcas iluminadas por la noche y la mejor comida callejera de Nanjing.', ciudad: nanjing._id, categoria: 'NOCTURNO', duracionHoras: 3, precio: 0, consejos: ['De noche las barcas iluminadas son preciosas', 'Prueba el pato salado de Nanjing'] },
    { nombre: 'Muralla de Nanjing', descripcion: 'La muralla de ciudad más larga del mundo (35 km). Secciones restauradas permiten caminar o pedalear sobre ella con vistas a la ciudad y el lago Xuanwu.', ciudad: nanjing._id, categoria: 'AVENTURA', duracionHoras: 3, precio: 10, consejos: ['La sección de la Puerta Zhonghua es la más espectacular', 'Se puede recorrer en bicicleta'] },
    { nombre: 'Memorial de la Masacre de Nanjing', descripcion: 'Museo conmemorativo sobre los eventos de 1937. Un lugar para la reflexión y el recuerdo. Arquitectura sobrecogedora y exposición muy bien documentada.', ciudad: nanjing._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 0, consejos: ['Entrada gratuita, cerrado los lunes', 'Es una experiencia emocionalmente intensa'] },
    { nombre: 'Lago Xuanwu', descripcion: 'Lago urbano rodeado de murallas, templos y jardines. Paseos en bote, isla central con jardín botánico y vistas al skyline de Nanjing.', ciudad: nanjing._id, categoria: 'NATURALEZA', duracionHoras: 2.5, precio: 0, consejos: ['Los lotos florecen en julio-agosto', 'La isla central tiene un zoo pequeño'] },
    { nombre: 'Pato salado de Nanjing', descripcion: 'Degustación del plato estrella: pato marinado en sal durante días y cocido lentamente. Piel sedosa, carne tierna y sabor suave. El anti-pato pekinés.', ciudad: nanjing._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 18, consejos: ['El restaurante Jiming Temple es muy popular', 'Prueba también las bolas de pato salado'] },
    { nombre: 'Montaña Púrpura (Zijinshan)', descripcion: 'Parque forestal con el mausoleo Ming Xiaoling (UNESCO), el observatorio astronómico y senderos entre bosques de ginkgo dorados en otoño.', ciudad: nanjing._id, categoria: 'NATURALEZA', duracionHoras: 5, precio: 15, consejos: ['En otoño los ginkgos dorados son espectaculares', 'El camino sagrado con estatuas de piedra es impresionante'] },
    { nombre: 'Avenida de los plátanos (Yihe Lu)', descripcion: 'Paseo por la avenida arbolada más bonita de China con edificios de la época republicana, embajadas históricas y cafés escondidos entre mansiones.', ciudad: nanjing._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 0, consejos: ['En otoño las hojas doradas cubren la calle', 'El palacio presidencial está aquí'] },
  ]);

  // --- DUNHUANG ---
  const dunhuangActs = await Activity.create([
    { nombre: 'Cuevas de Mogao', descripcion: 'El mayor tesoro de arte budista del mundo: 492 cuevas con frescos y esculturas de 1.000 años. Patrimonio UNESCO y una de las maravillas artísticas de la humanidad.', ciudad: dunhuang._id, categoria: 'HISTORICO', duracionHoras: 4, precio: 40, consejos: ['Reserva con semanas de anticipación', 'La película introductoria es esencial', 'No se permiten fotos dentro'] },
    { nombre: 'Dunas de Mingsha y Lago de la Media Luna', descripcion: 'Dunas de arena dorada de 250m junto a un oasis con forma de media luna que no se seca desde hace 2.000 años. Paseo en camello al atardecer.', ciudad: dunhuang._id, categoria: 'AVENTURA', duracionHoras: 4, precio: 25, consejos: ['El paseo en camello al atardecer es obligatorio', 'Las dunas "cantan" cuando el viento las mueve'] },
    { nombre: 'Paso de Yumen (Paso de Jade)', descripcion: 'Ruinas del paso fronterizo de la Ruta de la Seda donde los viajeros se despedían de China. Restos de la Gran Muralla de barro en el desierto del Gobi.', ciudad: dunhuang._id, categoria: 'HISTORICO', duracionHoras: 3, precio: 15, consejos: ['Los restos de la muralla de barro son impresionantes', 'Está a 80 km de Dunhuang'] },
    { nombre: 'Mercado nocturno de Shazhou', descripcion: 'Mercado nocturno con comida de la Ruta de la Seda: cordero asado, fideos tirados a mano, frutas del oasis y cerveza del desierto bajo las estrellas.', ciudad: dunhuang._id, categoria: 'NOCTURNO', duracionHoras: 2.5, precio: 10, consejos: ['Los fideos tirados a mano son espectáculo y comida', 'Prueba el burro asado (especialidad local)'] },
    { nombre: 'Yardang National Geopark', descripcion: 'Formaciones rocosas erosionadas por el viento en el desierto del Gobi. "La ciudad fantasma del diablo" con formas surrealistas al atardecer.', ciudad: dunhuang._id, categoria: 'NATURALEZA', duracionHoras: 4, precio: 20, consejos: ['Al atardecer las rocas cambian de color', 'El viento hace sonidos extraños entre las rocas'] },
    { nombre: 'Paseo en camello por el Gobi', descripcion: 'Travesía en camello por el desierto del Gobi como los antiguos mercaderes de la Ruta de la Seda. Silencio absoluto y cielos estrellados incomparables.', ciudad: dunhuang._id, categoria: 'AVENTURA', duracionHoras: 3, precio: 30, consejos: ['El amanecer en el desierto es mágico', 'Lleva protección solar y pañuelo para la arena'] },
    { nombre: 'Cuevas del Buda Occidental (Xiqianfo)', descripcion: 'Cuevas budistas menos conocidas que Mogao pero igualmente bellas. Frescos de la dinastía Tang con colores vibrantes y menos turistas.', ciudad: dunhuang._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 15, consejos: ['Más tranquilo que Mogao', 'Los frescos Tang están mejor conservados aquí'] },
    { nombre: 'Observación de estrellas en el Gobi', descripcion: 'Noche de astronomía en el desierto del Gobi, uno de los cielos más limpios de China. Vía Láctea, constelaciones y silencio absoluto.', ciudad: dunhuang._id, categoria: 'NOCTURNO', duracionHoras: 3, precio: 20, consejos: ['Luna nueva = mejores estrellas', 'Lleva ropa de abrigo, el desierto se enfría mucho'] },
  ]);

  // --- SANYA ---
  const sanyaActs = await Activity.create([
    { nombre: 'Playa de Yalong Bay', descripcion: 'La playa más bella de China: 7 km de arena blanca, aguas turquesas y resorts de lujo. Snorkel, kayak y relax tropical.', ciudad: sanya._id, categoria: 'NATURALEZA', duracionHoras: 5, precio: 0, consejos: ['El agua es más cristalina que en las otras playas', 'Los deportes acuáticos se alquilan en la playa'] },
    { nombre: 'Guanyin del Mar del Sur', descripcion: 'La estatua de Guanyin más grande del mundo (108m), sobre una isla artificial. Templo budista Nanshan con jardines tropicales y vegetarianismo.', ciudad: sanya._id, categoria: 'CULTURAL', duracionHoras: 3, precio: 30, consejos: ['Es más alta que la Estatua de la Libertad', 'El buffet vegetariano del templo es famoso'] },
    { nombre: 'Isla Wuzhizhou - Snorkel', descripcion: 'Isla paradisíaca con los mejores corales de China. Snorkel, buceo, motos de agua y playas vírgenes de arena blanca.', ciudad: sanya._id, categoria: 'AVENTURA', duracionHoras: 6, precio: 45, consejos: ['El buceo con visibilidad de 27m es increíble', 'Reserva el ferry con anticipación'] },
    { nombre: 'Bosque tropical Yanoda', descripcion: 'Selva tropical con pasarelas elevadas entre árboles gigantes, cascadas, puentes colgantes y tirolinas sobre el dosel forestal.', ciudad: sanya._id, categoria: 'NATURALEZA', duracionHoras: 4, precio: 25, consejos: ['La tirolina es emocionante', 'Lleva repelente de mosquitos'] },
    { nombre: 'Mariscos en Dadonghai', descripcion: 'Cena de mariscos tropicales frescos en la bahía de Dadonghai: langosta, cangrejo de las palmeras, vieiras a la brasa y pescado al vapor con jengibre.', ciudad: sanya._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 35, consejos: ['Compra el marisco tú mismo en el mercado', 'Los restaurantes lo cocinan por un precio fijo'] },
    { nombre: 'Fin del Cielo (Tianya Haijiao)', descripcion: 'Rocas gigantes en la playa grabadas con caracteres que significan "fin del cielo, esquina del mar". Lugar legendario de poesía y romance chino.', ciudad: sanya._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 15, consejos: ['Es más simbólico que espectacular', 'Las puestas de sol son preciosas'] },
    { nombre: 'Surf en Houhai', descripcion: 'Clases de surf en la bahía de Houhai, el pueblo surfero más popular de China. Olas suaves perfectas para principiantes y ambiente relajado.', ciudad: sanya._id, categoria: 'AVENTURA', duracionHoras: 3, precio: 30, consejos: ['Las olas son suaves, ideal para aprender', 'El pueblo tiene bares de playa con música'] },
    { nombre: 'Coco fresco en Hainan', descripcion: 'Ruta por plantaciones de coco con degustación de coco fresco, pollo al coco (plato típico de Hainan), arroz al coco y postre de coco.', ciudad: sanya._id, categoria: 'GASTRONOMIA', duracionHoras: 2.5, precio: 15, consejos: ['El pollo al coco de Hainan es el mejor de China', 'El arroz al coco de postre es adictivo'] },
  ]);

  // --- PINGYAO ---
  const pingyaoActs = await Activity.create([
    { nombre: 'Muralla de Pingyao', descripcion: 'Recinto amurallado del siglo XIV perfectamente conservado. 6 km de muralla con 72 torres de vigía y vistas a la ciudad antigua desde arriba.', ciudad: pingyao._id, categoria: 'HISTORICO', duracionHoras: 2.5, precio: 15, consejos: ['El circuito completo son 6 km', 'Al atardecer las vistas son espectaculares'] },
    { nombre: 'Primer banco de China (Rishengchang)', descripcion: 'Visita al primer banco de la historia de China (1823). Arquitectura patio Shanxi, bóvedas y la historia de cómo Pingyao financió el imperio Qing.', ciudad: pingyao._id, categoria: 'HISTORICO', duracionHoras: 1.5, precio: 10, consejos: ['El sistema de transferencias era revolucionario', 'Las casas patio son arquitectura clásica Shanxi'] },
    { nombre: 'Calle Ming-Qing', descripcion: 'Calle principal de Pingyao con tiendas centenarias, casas patio, linternas rojas y vendedores ambulantes. Como viajar 200 años atrás.', ciudad: pingyao._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 0, consejos: ['Las tiendas de lacas y papel recortado son auténticas', 'Prueba la carne de burro (especialidad local)'] },
    { nombre: 'Vinagre de Pingyao', descripcion: 'Visita a una fábrica artesanal del famoso vinagre negro de Shanxi, fermentado durante años. Degustación de diferentes añadas como si fuera vino.', ciudad: pingyao._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 8, consejos: ['El vinagre de 8 años es como un balsámico', 'Se usa en todos los platos de Shanxi'] },
    { nombre: 'Templo Shuanglin', descripcion: 'Templo con más de 2.000 esculturas de arcilla pintada de las dinastías Song a Qing. Llamado "el museo de las esculturas pintadas".', ciudad: pingyao._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 10, consejos: ['Las esculturas están increíblemente conservadas', 'Está a 7 km de la ciudad, ve en taxi'] },
    { nombre: 'Espectáculo Pingyao Encounter', descripcion: 'Show inmersivo donde caminas entre actores dentro de escenarios que recrean la vida en la dinastía Qing. Teatro experimental único en China.', ciudad: pingyao._id, categoria: 'NOCTURNO', duracionHoras: 1.5, precio: 25, consejos: ['Es teatro inmersivo, tú caminas y eliges tu ruta', 'Cada experiencia es diferente'] },
    { nombre: 'Noche en casa patio tradicional', descripcion: 'Experiencia de dormir en una auténtica casa patio (siheyuan) de la dinastía Qing con cama kang (cama caliente de ladrillo), patio interior y farolillos.', ciudad: pingyao._id, categoria: 'CULTURAL', duracionHoras: 12, precio: 35, consejos: ['La cama kang se calienta por debajo con carbón', 'Pide la habitación con vista al patio'] },
    { nombre: 'Gastronomía de Shanxi: fideos', descripcion: 'Taller y degustación de los famosos fideos de Shanxi: cortados con cuchillo (daoxiaomian), tirados (lamian) y cat ear noodles (maoerduo).', ciudad: pingyao._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 15, consejos: ['Los fideos cortados con cuchillo son un espectáculo', 'Shanxi tiene más de 300 tipos de fideos'] },
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
    imagen: 'https://images.unsplash.com/photo-1584266032559-fe81b45d3169?w=800&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1474181628009-58356aaafef4?w=800&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=800&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=800&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=800&q=80',
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

  // --- XI'AN: 3 guías ---
  guides.push({
    titulo: "Xi'an Histórica - Guerreros y Murallas",
    descripcion: 'Sumérgete en 3.000 años de historia china: el Ejército de Terracota, la Ruta de la Seda, murallas medievales en bicicleta y la mejor comida callejera de China en el barrio musulmán.',
    ciudad: xian._id, duracionDias: 3, precio: 289,
    imagen: 'https://images.unsplash.com/photo-1591122947157-26bad3a117d2?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Guerreros de Terracota', actividades: [
        { actividad: xianActs[0]._id, orden: 1, horaInicio: '08:30', horaFin: '12:30' },
        { actividad: xianActs[3]._id, orden: 2, horaInicio: '14:30', horaFin: '16:30' },
        { actividad: xianActs[4]._id, orden: 3, horaInicio: '19:30', horaFin: '22:00' },
      ]},
      { numeroDia: 2, titulo: 'Murallas y Barrio Musulmán', actividades: [
        { actividad: xianActs[1]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: xianActs[2]._id, orden: 2, horaInicio: '12:00', horaFin: '15:00' },
        { actividad: xianActs[8]._id, orden: 3, horaInicio: '16:00', horaFin: '17:30' },
      ]},
      { numeroDia: 3, titulo: 'Templos y Dumplings', actividades: [
        { actividad: xianActs[5]._id, orden: 1, horaInicio: '08:00', horaFin: '13:00' },
        { actividad: xianActs[7]._id, orden: 2, horaInicio: '15:00', horaFin: '17:30' },
      ]},
    ],
  });

  guides.push({
    titulo: "Xi'an Express - 2 Días",
    descripcion: 'Los imprescindibles de Xi\'an en un fin de semana: los legendarios Guerreros de Terracota, la muralla en bici y el sabor del barrio musulmán.',
    ciudad: xian._id, duracionDias: 2, precio: 199,
    imagen: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Terracota y Muralla', actividades: [
        { actividad: xianActs[0]._id, orden: 1, horaInicio: '08:30', horaFin: '12:30' },
        { actividad: xianActs[1]._id, orden: 2, horaInicio: '15:00', horaFin: '17:30' },
        { actividad: xianActs[4]._id, orden: 3, horaInicio: '19:30', horaFin: '22:00' },
      ]},
      { numeroDia: 2, titulo: 'Barrio Musulmán y Pagoda', actividades: [
        { actividad: xianActs[2]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: xianActs[3]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
      ]},
    ],
  });

  guides.push({
    titulo: "Xi'an Aventurera - Monte Huashan - 4 Días",
    descripcion: 'Historia y adrenalina: Guerreros de Terracota, barrio musulmán, murallas y la escalada al Monte Huashan, una de las montañas más peligrosas y bellas del mundo.',
    ciudad: xian._id, duracionDias: 4, precio: 389,
    imagen: 'https://images.unsplash.com/photo-1586007600822-3d78e2bb43fe?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada y Centro', actividades: [
        { actividad: xianActs[8]._id, orden: 1, horaInicio: '14:00', horaFin: '15:30' },
        { actividad: xianActs[2]._id, orden: 2, horaInicio: '16:00', horaFin: '19:00' },
      ]},
      { numeroDia: 2, titulo: 'Terracota y Show', actividades: [
        { actividad: xianActs[0]._id, orden: 1, horaInicio: '08:30', horaFin: '12:30' },
        { actividad: xianActs[3]._id, orden: 2, horaInicio: '14:30', horaFin: '16:30' },
        { actividad: xianActs[4]._id, orden: 3, horaInicio: '19:30', horaFin: '22:00' },
      ]},
      { numeroDia: 3, titulo: 'Monte Huashan', actividades: [
        { actividad: xianActs[6]._id, orden: 1, horaInicio: '07:00', horaFin: '15:00' },
      ]},
      { numeroDia: 4, titulo: 'Muralla y Dumplings', actividades: [
        { actividad: xianActs[1]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: xianActs[7]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
      ]},
    ],
  });

  // --- CANTÓN: 3 guías ---
  guides.push({
    titulo: 'Cantón Gastronómico - 3 Días',
    descripcion: 'La capital mundial del dim sum en 3 días: desayunos de vaporeras, pato asado cantonés, crucero nocturno por el río Perla y arquitectura colonial. Un festín para los sentidos.',
    ciudad: guangzhou._id, duracionDias: 3, precio: 259,
    imagen: 'https://images.unsplash.com/photo-1589254065878-42c2a0fd6ae0?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Dim Sum y Torre Canton', actividades: [
        { actividad: guangzhouActs[0]._id, orden: 1, horaInicio: '08:00', horaFin: '10:00' },
        { actividad: guangzhouActs[1]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: guangzhouActs[4]._id, orden: 3, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Historia y Cultura', actividades: [
        { actividad: guangzhouActs[3]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: guangzhouActs[2]._id, orden: 2, horaInicio: '11:30', horaFin: '13:30' },
        { actividad: guangzhouActs[5]._id, orden: 3, horaInicio: '14:30', horaFin: '16:00' },
        { actividad: guangzhouActs[6]._id, orden: 4, horaInicio: '18:30', horaFin: '20:00' },
      ]},
      { numeroDia: 3, titulo: 'Parque y Compras', actividades: [
        { actividad: guangzhouActs[7]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: guangzhouActs[8]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Cantón Express - 2 Días',
    descripcion: 'Lo esencial de Cantón en 48 horas: dim sum de ensueño, torre Canton, isla Shamian colonial y crucero nocturno por el río Perla.',
    ciudad: guangzhou._id, duracionDias: 2, precio: 179,
    imagen: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Gastronomía y Vistas', actividades: [
        { actividad: guangzhouActs[0]._id, orden: 1, horaInicio: '08:00', horaFin: '10:00' },
        { actividad: guangzhouActs[1]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: guangzhouActs[4]._id, orden: 3, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Historia Colonial', actividades: [
        { actividad: guangzhouActs[2]._id, orden: 1, horaInicio: '09:30', horaFin: '11:30' },
        { actividad: guangzhouActs[3]._id, orden: 2, horaInicio: '13:00', horaFin: '15:00' },
        { actividad: guangzhouActs[6]._id, orden: 3, horaInicio: '18:00', horaFin: '19:30' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Cantón y Hong Kong Puerta a Puerta - 5 Días',
    descripcion: 'Circuito completo por Cantón con excursión gastronómica extendida. Dim sum, pato cantonés, medicina china, arquitectura colonial, parques y mercados durante 5 días inolvidables.',
    ciudad: guangzhou._id, duracionDias: 5, precio: 429,
    imagen: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada y Río Perla', actividades: [
        { actividad: guangzhouActs[2]._id, orden: 1, horaInicio: '15:00', horaFin: '17:00' },
        { actividad: guangzhouActs[4]._id, orden: 2, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Dim Sum y Torre', actividades: [
        { actividad: guangzhouActs[0]._id, orden: 1, horaInicio: '08:00', horaFin: '10:00' },
        { actividad: guangzhouActs[1]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
      ]},
      { numeroDia: 3, titulo: 'Cultura e Historia', actividades: [
        { actividad: guangzhouActs[3]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: guangzhouActs[5]._id, orden: 2, horaInicio: '12:00', horaFin: '13:30' },
        { actividad: guangzhouActs[7]._id, orden: 3, horaInicio: '15:00', horaFin: '17:30' },
      ]},
      { numeroDia: 4, titulo: 'Gastronomía Profunda', actividades: [
        { actividad: guangzhouActs[6]._id, orden: 1, horaInicio: '12:00', horaFin: '13:30' },
        { actividad: guangzhouActs[8]._id, orden: 2, horaInicio: '15:00', horaFin: '17:00' },
      ]},
      { numeroDia: 5, titulo: 'Último Dim Sum', actividades: [
        { actividad: guangzhouActs[0]._id, orden: 1, horaInicio: '08:00', horaFin: '10:00' },
      ]},
    ],
  });

  // --- HANGZHOU: 3 guías ---
  guides.push({
    titulo: 'Hangzhou - Paraíso en la Tierra',
    descripcion: 'Marco Polo la llamó la ciudad más bella del mundo. 3 días entre el Lago del Oeste, templos budistas, plantaciones de té y una gastronomía refinada.',
    ciudad: hangzhou._id, duracionDias: 3, precio: 299,
    imagen: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'El Lago del Oeste', actividades: [
        { actividad: hangzhouActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: hangzhouActs[7]._id, orden: 2, horaInicio: '14:00', horaFin: '17:00' },
        { actividad: hangzhouActs[4]._id, orden: 3, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Templos y Té', actividades: [
        { actividad: hangzhouActs[2]._id, orden: 1, horaInicio: '08:30', horaFin: '11:30' },
        { actividad: hangzhouActs[1]._id, orden: 2, horaInicio: '13:00', horaFin: '16:00' },
        { actividad: hangzhouActs[6]._id, orden: 3, horaInicio: '18:00', horaFin: '20:00' },
      ]},
      { numeroDia: 3, titulo: 'Cultura y Compras', actividades: [
        { actividad: hangzhouActs[8]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: hangzhouActs[3]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
        { actividad: hangzhouActs[5]._id, orden: 3, horaInicio: '16:30', horaFin: '18:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Hangzhou Express - 2 Días',
    descripcion: 'Lago del Oeste, té Longjing y cocina de Hangzhou: lo esencial en un fin de semana perfecto.',
    ciudad: hangzhou._id, duracionDias: 2, precio: 209,
    imagen: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Lago y Espectáculo', actividades: [
        { actividad: hangzhouActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: hangzhouActs[6]._id, orden: 2, horaInicio: '12:30', horaFin: '14:30' },
        { actividad: hangzhouActs[4]._id, orden: 3, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Té y Templos', actividades: [
        { actividad: hangzhouActs[1]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: hangzhouActs[2]._id, orden: 2, horaInicio: '14:00', horaFin: '17:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Hangzhou Completo - 4 Días',
    descripcion: 'El circuito más completo por Hangzhou: cada rincón del Lago del Oeste, plantaciones de té, templos budistas, museos, pagodas y la mejor gastronomía del este de China.',
    ciudad: hangzhou._id, duracionDias: 4, precio: 399,
    imagen: 'https://images.unsplash.com/photo-1548427607-d0f8fda39066?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'El Lago del Oeste', actividades: [
        { actividad: hangzhouActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: hangzhouActs[5]._id, orden: 2, horaInicio: '14:00', horaFin: '15:30' },
        { actividad: hangzhouActs[4]._id, orden: 3, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Té y Templos', actividades: [
        { actividad: hangzhouActs[1]._id, orden: 1, horaInicio: '08:30', horaFin: '11:30' },
        { actividad: hangzhouActs[2]._id, orden: 2, horaInicio: '13:00', horaFin: '16:00' },
        { actividad: hangzhouActs[6]._id, orden: 3, horaInicio: '18:00', horaFin: '20:00' },
      ]},
      { numeroDia: 3, titulo: 'Bicicleta y Museo', actividades: [
        { actividad: hangzhouActs[7]._id, orden: 1, horaInicio: '08:30', horaFin: '11:30' },
        { actividad: hangzhouActs[8]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
      ]},
      { numeroDia: 4, titulo: 'Compras y Despedida', actividades: [
        { actividad: hangzhouActs[3]._id, orden: 1, horaInicio: '10:00', horaFin: '12:00' },
      ]},
    ],
  });

  // --- GUILIN: 3 guías ---
  guides.push({
    titulo: 'Guilin y Yangshuo - Paisajes de Pintura',
    descripcion: '3 días entre las montañas kársticas más bellas del mundo: crucero por el río Li, arrozales en terrazas, rafting, cuevas y espectáculos nocturnos sobre el agua.',
    ciudad: guilin._id, duracionDias: 3, precio: 309,
    imagen: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Guilin Ciudad', actividades: [
        { actividad: guilinActs[6]._id, orden: 1, horaInicio: '09:00', horaFin: '10:30' },
        { actividad: guilinActs[3]._id, orden: 2, horaInicio: '11:00', horaFin: '12:30' },
        { actividad: guilinActs[8]._id, orden: 3, horaInicio: '14:30', horaFin: '17:00' },
      ]},
      { numeroDia: 2, titulo: 'Crucero Río Li', actividades: [
        { actividad: guilinActs[0]._id, orden: 1, horaInicio: '08:30', horaFin: '13:30' },
        { actividad: guilinActs[7]._id, orden: 2, horaInicio: '16:00', horaFin: '18:30' },
        { actividad: guilinActs[4]._id, orden: 3, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 3, titulo: 'Yangshuo Aventura', actividades: [
        { actividad: guilinActs[1]._id, orden: 1, horaInicio: '08:30', horaFin: '12:30' },
        { actividad: guilinActs[5]._id, orden: 2, horaInicio: '14:30', horaFin: '17:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Guilin Express - 2 Días',
    descripcion: 'Crucero por el río Li y exploración de Yangshuo en un fin de semana entre paisajes de ensueño.',
    ciudad: guilin._id, duracionDias: 2, precio: 219,
    imagen: 'https://images.unsplash.com/photo-1529937944600-d31ec1010777?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Guilin y Río Li', actividades: [
        { actividad: guilinActs[6]._id, orden: 1, horaInicio: '08:00', horaFin: '09:30' },
        { actividad: guilinActs[0]._id, orden: 2, horaInicio: '10:00', horaFin: '15:00' },
        { actividad: guilinActs[4]._id, orden: 3, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Yangshuo', actividades: [
        { actividad: guilinActs[1]._id, orden: 1, horaInicio: '08:30', horaFin: '12:30' },
        { actividad: guilinActs[7]._id, orden: 2, horaInicio: '15:00', horaFin: '17:30' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Guilin Completo con Terrazas de Longji - 5 Días',
    descripcion: 'La experiencia definitiva de Guilin: río Li, Yangshuo, arrozales en terrazas de Longji, cuevas, rafting y arte. Naturaleza en estado puro durante 5 días.',
    ciudad: guilin._id, duracionDias: 5, precio: 479,
    imagen: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada a Guilin', actividades: [
        { actividad: guilinActs[6]._id, orden: 1, horaInicio: '14:00', horaFin: '15:30' },
        { actividad: guilinActs[3]._id, orden: 2, horaInicio: '16:00', horaFin: '17:30' },
      ]},
      { numeroDia: 2, titulo: 'Terrazas de Longji', actividades: [
        { actividad: guilinActs[2]._id, orden: 1, horaInicio: '07:00', horaFin: '15:00' },
      ]},
      { numeroDia: 3, titulo: 'Crucero Río Li', actividades: [
        { actividad: guilinActs[0]._id, orden: 1, horaInicio: '08:30', horaFin: '13:30' },
        { actividad: guilinActs[7]._id, orden: 2, horaInicio: '16:00', horaFin: '18:30' },
        { actividad: guilinActs[4]._id, orden: 3, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 4, titulo: 'Yangshuo Activo', actividades: [
        { actividad: guilinActs[1]._id, orden: 1, horaInicio: '08:30', horaFin: '12:30' },
        { actividad: guilinActs[5]._id, orden: 2, horaInicio: '14:30', horaFin: '17:00' },
      ]},
      { numeroDia: 5, titulo: 'Arte y Despedida', actividades: [
        { actividad: guilinActs[8]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
      ]},
    ],
  });

  // --- LHASA: 3 guías ---
  guides.push({
    titulo: 'Lhasa Espiritual - 3 Días',
    descripcion: 'Viaje al techo del mundo: Palacio Potala, templos sagrados, debates de monjes y paisajes tibetanos que transforman el alma. Una experiencia espiritual única.',
    ciudad: lhasa._id, duracionDias: 3, precio: 399,
    imagen: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Aclimatación y Templos', actividades: [
        { actividad: lhasaActs[1]._id, orden: 1, horaInicio: '10:00', horaFin: '13:00' },
        { actividad: lhasaActs[4]._id, orden: 2, horaInicio: '15:00', horaFin: '16:30' },
        { actividad: lhasaActs[6]._id, orden: 3, horaInicio: '17:00', horaFin: '18:30' },
      ]},
      { numeroDia: 2, titulo: 'Palacio Potala', actividades: [
        { actividad: lhasaActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: lhasaActs[2]._id, orden: 2, horaInicio: '15:00', horaFin: '17:30' },
        { actividad: lhasaActs[7]._id, orden: 3, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 3, titulo: 'Monasterios y Naturaleza', actividades: [
        { actividad: lhasaActs[5]._id, orden: 1, horaInicio: '08:30', horaFin: '11:30' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Lhasa Express - 2 Días',
    descripcion: 'Los imprescindibles del Tíbet en 2 días: Potala, Jokhang, Barkhor y la espiritualidad tibetana condensada.',
    ciudad: lhasa._id, duracionDias: 2, precio: 289,
    imagen: 'https://images.unsplash.com/photo-1476900543704-4312b7810781?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Templos Sagrados', actividades: [
        { actividad: lhasaActs[1]._id, orden: 1, horaInicio: '10:00', horaFin: '13:00' },
        { actividad: lhasaActs[4]._id, orden: 2, horaInicio: '15:00', horaFin: '16:30' },
        { actividad: lhasaActs[6]._id, orden: 3, horaInicio: '17:00', horaFin: '18:30' },
      ]},
      { numeroDia: 2, titulo: 'Palacio Potala', actividades: [
        { actividad: lhasaActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: lhasaActs[2]._id, orden: 2, horaInicio: '15:00', horaFin: '17:30' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Lhasa y Lago Namtso - 5 Días',
    descripcion: 'Tíbet en profundidad: Potala, monasterios, debate de monjes, lago sagrado Namtso a 4.700m y la espiritualidad más pura del planeta.',
    ciudad: lhasa._id, duracionDias: 5, precio: 599,
    imagen: 'https://images.unsplash.com/photo-1503641926155-5c17619a9e10?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Aclimatación', actividades: [
        { actividad: lhasaActs[4]._id, orden: 1, horaInicio: '14:00', horaFin: '15:30' },
        { actividad: lhasaActs[6]._id, orden: 2, horaInicio: '17:00', horaFin: '18:30' },
      ]},
      { numeroDia: 2, titulo: 'Potala y Jokhang', actividades: [
        { actividad: lhasaActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: lhasaActs[1]._id, orden: 2, horaInicio: '14:00', horaFin: '17:00' },
        { actividad: lhasaActs[7]._id, orden: 3, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 3, titulo: 'Monasterios', actividades: [
        { actividad: lhasaActs[5]._id, orden: 1, horaInicio: '08:30', horaFin: '11:30' },
        { actividad: lhasaActs[2]._id, orden: 2, horaInicio: '15:00', horaFin: '17:30' },
      ]},
      { numeroDia: 4, titulo: 'Lago Namtso', actividades: [
        { actividad: lhasaActs[3]._id, orden: 1, horaInicio: '06:00', horaFin: '16:00' },
      ]},
      { numeroDia: 5, titulo: 'Despedida', actividades: [
        { actividad: lhasaActs[6]._id, orden: 1, horaInicio: '07:00', horaFin: '08:30' },
      ]},
    ],
  });

  // --- DALI: 3 guías ---
  guides.push({
    titulo: 'Dali Bohemia - 3 Días',
    descripcion: 'Yunnan alternativo: ciudad antigua, lago Erhai, cultura Bai, montañas Cangshan, tie-dye artesanal y cerveza artesanal con vistas a las montañas.',
    ciudad: dali._id, duracionDias: 3, precio: 239,
    imagen: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Ciudad Antigua', actividades: [
        { actividad: daliActs[0]._id, orden: 1, horaInicio: '10:00', horaFin: '13:00' },
        { actividad: daliActs[2]._id, orden: 2, horaInicio: '14:30', horaFin: '16:30' },
        { actividad: daliActs[8]._id, orden: 3, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 2, titulo: 'Lago Erhai', actividades: [
        { actividad: daliActs[1]._id, orden: 1, horaInicio: '08:30', horaFin: '13:30' },
        { actividad: daliActs[6]._id, orden: 2, horaInicio: '15:00', horaFin: '18:00' },
      ]},
      { numeroDia: 3, titulo: 'Cultura Bai', actividades: [
        { actividad: daliActs[3]._id, orden: 1, horaInicio: '08:00', horaFin: '10:30' },
        { actividad: daliActs[7]._id, orden: 2, horaInicio: '11:00', horaFin: '13:30' },
        { actividad: daliActs[5]._id, orden: 3, horaInicio: '15:00', horaFin: '16:30' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Dali Express - 2 Días',
    descripcion: 'Ciudad antigua, Tres Pagodas y lago Erhai en un fin de semana entre montañas y agua.',
    ciudad: dali._id, duracionDias: 2, precio: 169,
    imagen: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Ciudad y Pagodas', actividades: [
        { actividad: daliActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: daliActs[2]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
        { actividad: daliActs[8]._id, orden: 3, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 2, titulo: 'Lago Erhai', actividades: [
        { actividad: daliActs[1]._id, orden: 1, horaInicio: '08:30', horaFin: '13:30' },
        { actividad: daliActs[6]._id, orden: 2, horaInicio: '15:00', horaFin: '18:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Dali y Cangshan - 4 Días',
    descripcion: 'Dali en profundidad: trekking por Cangshan, lago Erhai en bicicleta, artesanía Bai, mercados locales y atardeceres desde Shuanglang.',
    ciudad: dali._id, duracionDias: 4, precio: 329,
    imagen: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada y Ciudad', actividades: [
        { actividad: daliActs[0]._id, orden: 1, horaInicio: '14:00', horaFin: '17:00' },
        { actividad: daliActs[8]._id, orden: 2, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 2, titulo: 'Cangshan', actividades: [
        { actividad: daliActs[4]._id, orden: 1, horaInicio: '08:00', horaFin: '14:00' },
        { actividad: daliActs[5]._id, orden: 2, horaInicio: '16:00', horaFin: '17:30' },
      ]},
      { numeroDia: 3, titulo: 'Lago y Pueblos', actividades: [
        { actividad: daliActs[1]._id, orden: 1, horaInicio: '08:30', horaFin: '13:30' },
        { actividad: daliActs[6]._id, orden: 2, horaInicio: '15:00', horaFin: '18:00' },
      ]},
      { numeroDia: 4, titulo: 'Mercado y Artesanía', actividades: [
        { actividad: daliActs[3]._id, orden: 1, horaInicio: '08:00', horaFin: '10:30' },
        { actividad: daliActs[7]._id, orden: 2, horaInicio: '11:00', horaFin: '13:30' },
      ]},
    ],
  });

  // --- XIAMEN: 3 guías ---
  guides.push({
    titulo: 'Xiamen y Gulangyu - 3 Días',
    descripcion: 'Isla de pianos, templos sobre el mar, tulou circulares y mariscos frescos. 3 días en la joya costera del sur de Fujian.',
    ciudad: xiamen._id, duracionDias: 3, precio: 279,
    imagen: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Gulangyu', actividades: [
        { actividad: xiamenActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '14:00' },
        { actividad: xiamenActs[8]._id, orden: 2, horaInicio: '14:30', horaFin: '16:00' },
        { actividad: xiamenActs[4]._id, orden: 3, horaInicio: '18:30', horaFin: '20:30' },
      ]},
      { numeroDia: 2, titulo: 'Templos y Té', actividades: [
        { actividad: xiamenActs[1]._id, orden: 1, horaInicio: '08:30', horaFin: '11:00' },
        { actividad: xiamenActs[3]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: xiamenActs[5]._id, orden: 3, horaInicio: '17:00', horaFin: '20:00' },
      ]},
      { numeroDia: 3, titulo: 'Costa y Compras', actividades: [
        { actividad: xiamenActs[2]._id, orden: 1, horaInicio: '08:30', horaFin: '11:30' },
        { actividad: xiamenActs[7]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Xiamen Express - 2 Días',
    descripcion: 'Gulangyu y lo mejor de Xiamen en un fin de semana junto al mar.',
    ciudad: xiamen._id, duracionDias: 2, precio: 189,
    imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Isla de Gulangyu', actividades: [
        { actividad: xiamenActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '14:00' },
        { actividad: xiamenActs[8]._id, orden: 2, horaInicio: '14:30', horaFin: '16:00' },
        { actividad: xiamenActs[4]._id, orden: 3, horaInicio: '18:30', horaFin: '20:30' },
      ]},
      { numeroDia: 2, titulo: 'Templos y Costa', actividades: [
        { actividad: xiamenActs[1]._id, orden: 1, horaInicio: '08:30', horaFin: '11:00' },
        { actividad: xiamenActs[2]._id, orden: 2, horaInicio: '14:00', horaFin: '17:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Xiamen y Tulou de Fujian - 4 Días',
    descripcion: 'Costa, islas, té oolong y las increíbles casas circulares Tulou del pueblo Hakka (Patrimonio UNESCO). Xiamen y la esencia profunda de Fujian.',
    ciudad: xiamen._id, duracionDias: 4, precio: 369,
    imagen: 'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada y Gulangyu', actividades: [
        { actividad: xiamenActs[0]._id, orden: 1, horaInicio: '10:00', horaFin: '15:00' },
        { actividad: xiamenActs[4]._id, orden: 2, horaInicio: '18:30', horaFin: '20:30' },
      ]},
      { numeroDia: 2, titulo: 'Tulou de Fujian', actividades: [
        { actividad: xiamenActs[6]._id, orden: 1, horaInicio: '07:00', horaFin: '16:00' },
      ]},
      { numeroDia: 3, titulo: 'Templos y Té', actividades: [
        { actividad: xiamenActs[1]._id, orden: 1, horaInicio: '08:30', horaFin: '11:00' },
        { actividad: xiamenActs[3]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: xiamenActs[5]._id, orden: 3, horaInicio: '17:00', horaFin: '20:00' },
      ]},
      { numeroDia: 4, titulo: 'Costa y Despedida', actividades: [
        { actividad: xiamenActs[2]._id, orden: 1, horaInicio: '08:30', horaFin: '11:30' },
        { actividad: xiamenActs[7]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
      ]},
    ],
  });

  // --- SUZHOU: 3 guías ---
  guides.push({
    titulo: 'Suzhou - Jardines y Canales',
    descripcion: '3 días en la Venecia de Oriente: jardines Patrimonio UNESCO, canales en góndola, ópera kunqu nocturna y la tradición milenaria de la seda.',
    ciudad: suzhou._id, duracionDias: 3, precio: 279,
    imagen: 'https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Jardines Clásicos', actividades: [
        { actividad: suzhouActs[0]._id, orden: 1, horaInicio: '08:30', horaFin: '11:00' },
        { actividad: suzhouActs[3]._id, orden: 2, horaInicio: '13:00', horaFin: '15:30' },
        { actividad: suzhouActs[4]._id, orden: 3, horaInicio: '19:30', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Canales y Seda', actividades: [
        { actividad: suzhouActs[1]._id, orden: 1, horaInicio: '09:00', horaFin: '10:30' },
        { actividad: suzhouActs[2]._id, orden: 2, horaInicio: '11:00', horaFin: '13:00' },
        { actividad: suzhouActs[5]._id, orden: 3, horaInicio: '14:30', horaFin: '16:30' },
        { actividad: suzhouActs[7]._id, orden: 4, horaInicio: '18:00', horaFin: '20:00' },
      ]},
      { numeroDia: 3, titulo: 'Pueblo de Agua', actividades: [
        { actividad: suzhouActs[6]._id, orden: 1, horaInicio: '09:00', horaFin: '13:00' },
      ]},
    ],
  });
  guides.push({
    titulo: 'Suzhou Express - 2 Días',
    descripcion: 'Lo mejor de Suzhou en un fin de semana: jardín UNESCO, canales en góndola y ópera kunqu bajo las estrellas.',
    ciudad: suzhou._id, duracionDias: 2, precio: 189,
    imagen: 'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Jardines y Canales', actividades: [
        { actividad: suzhouActs[0]._id, orden: 1, horaInicio: '08:30', horaFin: '11:00' },
        { actividad: suzhouActs[1]._id, orden: 2, horaInicio: '14:00', horaFin: '15:30' },
        { actividad: suzhouActs[4]._id, orden: 3, horaInicio: '19:30', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Colina y Gastronomía', actividades: [
        { actividad: suzhouActs[5]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: suzhouActs[3]._id, orden: 2, horaInicio: '13:00', horaFin: '15:30' },
        { actividad: suzhouActs[7]._id, orden: 3, horaInicio: '18:00', horaFin: '20:00' },
      ]},
    ],
  });
  guides.push({
    titulo: 'Suzhou y Tongli - 4 Días',
    descripcion: 'Suzhou a fondo: todos los jardines UNESCO, canales, seda, ópera kunqu, gastronomía refinada y excursión al pueblo acuático de Tongli.',
    ciudad: suzhou._id, duracionDias: 4, precio: 369,
    imagen: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Jardín y Ópera', actividades: [
        { actividad: suzhouActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: suzhouActs[3]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: suzhouActs[4]._id, orden: 3, horaInicio: '19:30', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Canales y Seda', actividades: [
        { actividad: suzhouActs[1]._id, orden: 1, horaInicio: '09:00', horaFin: '10:30' },
        { actividad: suzhouActs[2]._id, orden: 2, horaInicio: '11:00', horaFin: '13:00' },
        { actividad: suzhouActs[5]._id, orden: 3, horaInicio: '14:30', horaFin: '16:30' },
      ]},
      { numeroDia: 3, titulo: 'Tongli', actividades: [
        { actividad: suzhouActs[6]._id, orden: 1, horaInicio: '09:00', horaFin: '13:00' },
        { actividad: suzhouActs[7]._id, orden: 2, horaInicio: '18:00', horaFin: '20:00' },
      ]},
      { numeroDia: 4, titulo: 'Libre y Despedida', actividades: [
        { actividad: suzhouActs[3]._id, orden: 1, horaInicio: '10:00', horaFin: '12:30' },
      ]},
    ],
  });

  // --- LIJIANG: 3 guías ---
  guides.push({
    titulo: 'Lijiang - Ciudad Naxi y Montaña de Jade',
    descripcion: '3 días en el corazón de Yunnan: ciudad antigua Naxi, Montaña del Dragón de Jade a 4.680m, música ancestral y la garganta más profunda del mundo.',
    ciudad: lijiang._id, duracionDias: 3, precio: 319,
    imagen: 'https://images.unsplash.com/photo-1446292532430-3e76f6ab6444?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Ciudad Antigua', actividades: [
        { actividad: lijiangActs[0]._id, orden: 1, horaInicio: '10:00', horaFin: '13:00' },
        { actividad: lijiangActs[4]._id, orden: 2, horaInicio: '14:30', horaFin: '16:30' },
        { actividad: lijiangActs[5]._id, orden: 3, horaInicio: '19:30', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Montaña del Dragón', actividades: [
        { actividad: lijiangActs[1]._id, orden: 1, horaInicio: '08:00', horaFin: '14:00' },
        { actividad: lijiangActs[2]._id, orden: 2, horaInicio: '15:30', horaFin: '17:00' },
      ]},
      { numeroDia: 3, titulo: 'Baisha y Alrededores', actividades: [
        { actividad: lijiangActs[7]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
      ]},
    ],
  });
  guides.push({
    titulo: 'Lijiang Express - 2 Días',
    descripcion: 'Ciudad antigua Naxi y Montaña del Dragón de Jade en un intenso fin de semana en Yunnan.',
    ciudad: lijiang._id, duracionDias: 2, precio: 219,
    imagen: 'https://images.unsplash.com/photo-1500259571355-332da5cb07aa?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Ciudad y Cultura', actividades: [
        { actividad: lijiangActs[0]._id, orden: 1, horaInicio: '10:00', horaFin: '13:00' },
        { actividad: lijiangActs[4]._id, orden: 2, horaInicio: '14:30', horaFin: '16:30' },
        { actividad: lijiangActs[5]._id, orden: 3, horaInicio: '19:30', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Montaña', actividades: [
        { actividad: lijiangActs[1]._id, orden: 1, horaInicio: '08:00', horaFin: '14:00' },
        { actividad: lijiangActs[2]._id, orden: 2, horaInicio: '15:30', horaFin: '17:00' },
      ]},
    ],
  });
  guides.push({
    titulo: 'Lijiang Aventurera - Garganta y Lago Lugu - 5 Días',
    descripcion: 'Yunnan salvaje: ciudad antigua, Montaña de Jade, Garganta del Salto del Tigre, Lago Lugu con los Mosuo y música Dongba. Aventura y cultura.',
    ciudad: lijiang._id, duracionDias: 5, precio: 499,
    imagen: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada', actividades: [
        { actividad: lijiangActs[0]._id, orden: 1, horaInicio: '14:00', horaFin: '17:00' },
        { actividad: lijiangActs[5]._id, orden: 2, horaInicio: '19:30', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Montaña del Dragón', actividades: [
        { actividad: lijiangActs[1]._id, orden: 1, horaInicio: '08:00', horaFin: '14:00' },
        { actividad: lijiangActs[2]._id, orden: 2, horaInicio: '15:30', horaFin: '17:00' },
      ]},
      { numeroDia: 3, titulo: 'Garganta del Tigre', actividades: [
        { actividad: lijiangActs[3]._id, orden: 1, horaInicio: '07:00', horaFin: '15:00' },
      ]},
      { numeroDia: 4, titulo: 'Lago Lugu', actividades: [
        { actividad: lijiangActs[6]._id, orden: 1, horaInicio: '06:00', horaFin: '16:00' },
      ]},
      { numeroDia: 5, titulo: 'Baisha', actividades: [
        { actividad: lijiangActs[7]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: lijiangActs[4]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
      ]},
    ],
  });

  // --- ZHANGJIAJIE: 3 guías ---
  guides.push({
    titulo: 'Zhangjiajie - Montañas de Avatar',
    descripcion: '3 días entre los pilares de piedra que inspiraron Pandora: parque nacional, puente de cristal, Montaña Tianmen y la gastronomía picante de Hunan.',
    ciudad: zhangjiajie._id, duracionDias: 3, precio: 329,
    imagen: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Pilares de Avatar', actividades: [
        { actividad: zhangjiajieActs[0]._id, orden: 1, horaInicio: '07:30', horaFin: '14:30' },
        { actividad: zhangjiajieActs[4]._id, orden: 2, horaInicio: '14:30', horaFin: '15:00' },
        { actividad: zhangjiajieActs[7]._id, orden: 3, horaInicio: '18:00', horaFin: '20:00' },
      ]},
      { numeroDia: 2, titulo: 'Tianmen y Cristal', actividades: [
        { actividad: zhangjiajieActs[2]._id, orden: 1, horaInicio: '08:00', horaFin: '13:00' },
        { actividad: zhangjiajieActs[1]._id, orden: 2, horaInicio: '15:00', horaFin: '17:00' },
        { actividad: zhangjiajieActs[5]._id, orden: 3, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 3, titulo: 'Arroyo y Naturaleza', actividades: [
        { actividad: zhangjiajieActs[3]._id, orden: 1, horaInicio: '08:00', horaFin: '12:00' },
      ]},
    ],
  });
  guides.push({
    titulo: 'Zhangjiajie Express - 2 Días',
    descripcion: 'Los pilares de Avatar y la Montaña Tianmen en un fin de semana de vértigo.',
    ciudad: zhangjiajie._id, duracionDias: 2, precio: 229,
    imagen: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Parque Nacional', actividades: [
        { actividad: zhangjiajieActs[0]._id, orden: 1, horaInicio: '07:30', horaFin: '14:30' },
        { actividad: zhangjiajieActs[4]._id, orden: 2, horaInicio: '14:30', horaFin: '15:00' },
        { actividad: zhangjiajieActs[7]._id, orden: 3, horaInicio: '18:00', horaFin: '20:00' },
      ]},
      { numeroDia: 2, titulo: 'Tianmen', actividades: [
        { actividad: zhangjiajieActs[2]._id, orden: 1, horaInicio: '08:00', horaFin: '13:00' },
        { actividad: zhangjiajieActs[1]._id, orden: 2, horaInicio: '15:00', horaFin: '17:00' },
      ]},
    ],
  });
  guides.push({
    titulo: 'Zhangjiajie y Fenghuang - 5 Días',
    descripcion: 'Avatar, puente de cristal, Tianmen, la ciudad del Fénix sobre pilotes y la gastronomía picante de Hunan. Naturaleza e historia en 5 días épicos.',
    ciudad: zhangjiajie._id, duracionDias: 5, precio: 479,
    imagen: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada y Arroyo', actividades: [
        { actividad: zhangjiajieActs[3]._id, orden: 1, horaInicio: '13:00', horaFin: '17:00' },
        { actividad: zhangjiajieActs[7]._id, orden: 2, horaInicio: '18:30', horaFin: '20:30' },
      ]},
      { numeroDia: 2, titulo: 'Pilares de Avatar', actividades: [
        { actividad: zhangjiajieActs[0]._id, orden: 1, horaInicio: '07:30', horaFin: '14:30' },
        { actividad: zhangjiajieActs[4]._id, orden: 2, horaInicio: '14:30', horaFin: '15:00' },
      ]},
      { numeroDia: 3, titulo: 'Tianmen y Puente', actividades: [
        { actividad: zhangjiajieActs[2]._id, orden: 1, horaInicio: '08:00', horaFin: '13:00' },
        { actividad: zhangjiajieActs[1]._id, orden: 2, horaInicio: '15:00', horaFin: '17:00' },
        { actividad: zhangjiajieActs[5]._id, orden: 3, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 4, titulo: 'Fenghuang', actividades: [
        { actividad: zhangjiajieActs[6]._id, orden: 1, horaInicio: '07:00', horaFin: '16:00' },
      ]},
      { numeroDia: 5, titulo: 'Libre', actividades: [
        { actividad: zhangjiajieActs[3]._id, orden: 1, horaInicio: '08:00', horaFin: '12:00' },
      ]},
    ],
  });

  // --- KUNMING: 3 guías ---
  guides.push({
    titulo: 'Kunming - Eterna Primavera',
    descripcion: '3 días en la ciudad más agradable de China: Bosque de Piedra, lago Dian, diversidad étnica, mercados de flores y gastronomía única de Yunnan.',
    ciudad: kunming._id, duracionDias: 3, precio: 259,
    imagen: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Bosque de Piedra', actividades: [
        { actividad: kunmingActs[0]._id, orden: 1, horaInicio: '08:00', horaFin: '13:00' },
        { actividad: kunmingActs[5]._id, orden: 2, horaInicio: '18:00', horaFin: '19:30' },
      ]},
      { numeroDia: 2, titulo: 'Ciudad y Cultura', actividades: [
        { actividad: kunmingActs[2]._id, orden: 1, horaInicio: '09:00', horaFin: '10:30' },
        { actividad: kunmingActs[4]._id, orden: 2, horaInicio: '13:00', horaFin: '17:00' },
        { actividad: kunmingActs[7]._id, orden: 3, horaInicio: '18:30', horaFin: '20:00' },
      ]},
      { numeroDia: 3, titulo: 'Lago y Montañas', actividades: [
        { actividad: kunmingActs[3]._id, orden: 1, horaInicio: '08:30', horaFin: '12:30' },
        { actividad: kunmingActs[6]._id, orden: 2, horaInicio: '14:00', horaFin: '18:00' },
      ]},
    ],
  });
  guides.push({
    titulo: 'Kunming Express - 2 Días',
    descripcion: 'Bosque de Piedra y lo esencial de Kunming en un fin de semana primaveral.',
    ciudad: kunming._id, duracionDias: 2, precio: 179,
    imagen: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Bosque de Piedra', actividades: [
        { actividad: kunmingActs[0]._id, orden: 1, horaInicio: '08:00', horaFin: '13:00' },
        { actividad: kunmingActs[5]._id, orden: 2, horaInicio: '18:00', horaFin: '19:30' },
      ]},
      { numeroDia: 2, titulo: 'Lago y Flores', actividades: [
        { actividad: kunmingActs[3]._id, orden: 1, horaInicio: '09:00', horaFin: '13:00' },
        { actividad: kunmingActs[1]._id, orden: 2, horaInicio: '16:00', horaFin: '18:30' },
      ]},
    ],
  });
  guides.push({
    titulo: 'Kunming Completo - 4 Días',
    descripcion: 'Kunming al completo: Bosque de Piedra, pueblo étnico, mercado de flores, montañas, lago Dian y toda la gastronomía de Yunnan.',
    ciudad: kunming._id, duracionDias: 4, precio: 349,
    imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Bosque de Piedra', actividades: [
        { actividad: kunmingActs[0]._id, orden: 1, horaInicio: '08:00', horaFin: '13:00' },
        { actividad: kunmingActs[7]._id, orden: 2, horaInicio: '18:30', horaFin: '20:00' },
      ]},
      { numeroDia: 2, titulo: 'Cultura Étnica', actividades: [
        { actividad: kunmingActs[2]._id, orden: 1, horaInicio: '09:00', horaFin: '10:30' },
        { actividad: kunmingActs[4]._id, orden: 2, horaInicio: '13:00', horaFin: '17:00' },
        { actividad: kunmingActs[5]._id, orden: 3, horaInicio: '18:30', horaFin: '20:00' },
      ]},
      { numeroDia: 3, titulo: 'Naturaleza', actividades: [
        { actividad: kunmingActs[3]._id, orden: 1, horaInicio: '08:30', horaFin: '12:30' },
        { actividad: kunmingActs[6]._id, orden: 2, horaInicio: '14:00', horaFin: '18:00' },
      ]},
      { numeroDia: 4, titulo: 'Flores y Despedida', actividades: [
        { actividad: kunmingActs[1]._id, orden: 1, horaInicio: '10:00', horaFin: '12:30' },
      ]},
    ],
  });

  // --- NANJING: 3 guías ---
  guides.push({
    titulo: 'Nanjing - Capital de Seis Dinastías',
    descripcion: '3 días de historia y naturaleza: mausoleo de Sun Yat-sen, murallas imperiales, templo de Confucio iluminado y la montaña Púrpura.',
    ciudad: nanjing._id, duracionDias: 3, precio: 269,
    imagen: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Montaña Púrpura', actividades: [
        { actividad: nanjingActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: nanjingActs[6]._id, orden: 2, horaInicio: '13:00', horaFin: '18:00' },
      ]},
      { numeroDia: 2, titulo: 'Muralla y Lago', actividades: [
        { actividad: nanjingActs[2]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: nanjingActs[4]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: nanjingActs[1]._id, orden: 3, horaInicio: '19:00', horaFin: '22:00' },
      ]},
      { numeroDia: 3, titulo: 'Historia y Gastronomía', actividades: [
        { actividad: nanjingActs[3]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: nanjingActs[7]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
        { actividad: nanjingActs[5]._id, orden: 3, horaInicio: '18:00', horaFin: '19:30' },
      ]},
    ],
  });
  guides.push({
    titulo: 'Nanjing Express - 2 Días',
    descripcion: 'Mausoleo de Sun Yat-sen, muralla y templo nocturno de Confucio en un fin de semana histórico.',
    ciudad: nanjing._id, duracionDias: 2, precio: 179,
    imagen: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Montaña y Mausoleo', actividades: [
        { actividad: nanjingActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: nanjingActs[2]._id, orden: 2, horaInicio: '14:00', horaFin: '17:00' },
        { actividad: nanjingActs[1]._id, orden: 3, horaInicio: '19:00', horaFin: '22:00' },
      ]},
      { numeroDia: 2, titulo: 'Lago y Gastronomía', actividades: [
        { actividad: nanjingActs[4]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: nanjingActs[5]._id, orden: 2, horaInicio: '12:30', horaFin: '14:00' },
        { actividad: nanjingActs[7]._id, orden: 3, horaInicio: '15:00', horaFin: '17:00' },
      ]},
    ],
  });
  guides.push({
    titulo: 'Nanjing Completo - 4 Días',
    descripcion: 'Todo Nanjing: mausoleo, muralla, lago, montaña Púrpura, memorial, templo nocturno y los ginkgos dorados de otoño.',
    ciudad: nanjing._id, duracionDias: 4, precio: 359,
    imagen: 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Montaña Púrpura', actividades: [
        { actividad: nanjingActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: nanjingActs[6]._id, orden: 2, horaInicio: '13:00', horaFin: '18:00' },
      ]},
      { numeroDia: 2, titulo: 'Muralla y Memorial', actividades: [
        { actividad: nanjingActs[2]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: nanjingActs[3]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
        { actividad: nanjingActs[5]._id, orden: 3, horaInicio: '18:00', horaFin: '19:30' },
      ]},
      { numeroDia: 3, titulo: 'Lago y Avenida', actividades: [
        { actividad: nanjingActs[4]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: nanjingActs[7]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
        { actividad: nanjingActs[1]._id, orden: 3, horaInicio: '19:00', horaFin: '22:00' },
      ]},
      { numeroDia: 4, titulo: 'Despedida', actividades: [
        { actividad: nanjingActs[5]._id, orden: 1, horaInicio: '12:00', horaFin: '13:30' },
      ]},
    ],
  });

  // --- DUNHUANG: 3 guías ---
  guides.push({
    titulo: 'Dunhuang - Ruta de la Seda',
    descripcion: '3 días en el oasis del Gobi: las Cuevas de Mogao (1.000 años de arte budista), dunas doradas, camellos al atardecer y estrellas en el desierto.',
    ciudad: dunhuang._id, duracionDias: 3, precio: 369,
    imagen: 'https://images.unsplash.com/photo-1465056836900-8f1e940f1904?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Cuevas de Mogao', actividades: [
        { actividad: dunhuangActs[0]._id, orden: 1, horaInicio: '08:00', horaFin: '12:00' },
        { actividad: dunhuangActs[3]._id, orden: 2, horaInicio: '19:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Dunas y Desierto', actividades: [
        { actividad: dunhuangActs[1]._id, orden: 1, horaInicio: '08:00', horaFin: '12:00' },
        { actividad: dunhuangActs[5]._id, orden: 2, horaInicio: '15:00', horaFin: '18:00' },
        { actividad: dunhuangActs[7]._id, orden: 3, horaInicio: '21:00', horaFin: '24:00' },
      ]},
      { numeroDia: 3, titulo: 'Gobi y Paso de Jade', actividades: [
        { actividad: dunhuangActs[2]._id, orden: 1, horaInicio: '08:00', horaFin: '11:00' },
        { actividad: dunhuangActs[4]._id, orden: 2, horaInicio: '14:00', horaFin: '18:00' },
      ]},
    ],
  });
  guides.push({
    titulo: 'Dunhuang Express - 2 Días',
    descripcion: 'Mogao y dunas: lo esencial de la Ruta de la Seda en un fin de semana en el desierto del Gobi.',
    ciudad: dunhuang._id, duracionDias: 2, precio: 259,
    imagen: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Mogao', actividades: [
        { actividad: dunhuangActs[0]._id, orden: 1, horaInicio: '08:00', horaFin: '12:00' },
        { actividad: dunhuangActs[6]._id, orden: 2, horaInicio: '14:30', horaFin: '17:00' },
        { actividad: dunhuangActs[3]._id, orden: 3, horaInicio: '19:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Dunas', actividades: [
        { actividad: dunhuangActs[1]._id, orden: 1, horaInicio: '08:00', horaFin: '12:00' },
        { actividad: dunhuangActs[5]._id, orden: 2, horaInicio: '15:00', horaFin: '18:00' },
      ]},
    ],
  });
  guides.push({
    titulo: 'Dunhuang y el Gobi - 5 Días',
    descripcion: 'La experiencia completa de la Ruta de la Seda: Mogao, dunas, camellos, Paso de Jade, Yardang, estrellas y la magia del desierto durante 5 días.',
    ciudad: dunhuang._id, duracionDias: 5, precio: 529,
    imagen: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada al Oasis', actividades: [
        { actividad: dunhuangActs[3]._id, orden: 1, horaInicio: '19:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Cuevas de Mogao', actividades: [
        { actividad: dunhuangActs[0]._id, orden: 1, horaInicio: '08:00', horaFin: '12:00' },
        { actividad: dunhuangActs[6]._id, orden: 2, horaInicio: '14:30', horaFin: '17:00' },
      ]},
      { numeroDia: 3, titulo: 'Dunas y Desierto', actividades: [
        { actividad: dunhuangActs[1]._id, orden: 1, horaInicio: '08:00', horaFin: '12:00' },
        { actividad: dunhuangActs[5]._id, orden: 2, horaInicio: '15:00', horaFin: '18:00' },
        { actividad: dunhuangActs[7]._id, orden: 3, horaInicio: '21:00', horaFin: '24:00' },
      ]},
      { numeroDia: 4, titulo: 'Gobi Profundo', actividades: [
        { actividad: dunhuangActs[2]._id, orden: 1, horaInicio: '08:00', horaFin: '11:00' },
        { actividad: dunhuangActs[4]._id, orden: 2, horaInicio: '14:00', horaFin: '18:00' },
      ]},
      { numeroDia: 5, titulo: 'Amanecer y Despedida', actividades: [
        { actividad: dunhuangActs[5]._id, orden: 1, horaInicio: '05:30', horaFin: '08:30' },
      ]},
    ],
  });

  // --- SANYA: 3 guías ---
  guides.push({
    titulo: 'Sanya Tropical - 3 Días',
    descripcion: '3 días en el Hawái de China: playas de arena blanca, snorkel en Wuzhizhou, selva tropical, templo de Guanyin y mariscos frescos.',
    ciudad: sanya._id, duracionDias: 3, precio: 299,
    imagen: 'https://images.unsplash.com/photo-1496950866446-3253e1470e8e?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Playa y Templo', actividades: [
        { actividad: sanyaActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '14:00' },
        { actividad: sanyaActs[1]._id, orden: 2, horaInicio: '15:00', horaFin: '18:00' },
        { actividad: sanyaActs[4]._id, orden: 3, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 2, titulo: 'Isla Wuzhizhou', actividades: [
        { actividad: sanyaActs[2]._id, orden: 1, horaInicio: '08:00', horaFin: '14:00' },
        { actividad: sanyaActs[6]._id, orden: 2, horaInicio: '15:30', horaFin: '18:30' },
      ]},
      { numeroDia: 3, titulo: 'Selva y Coco', actividades: [
        { actividad: sanyaActs[3]._id, orden: 1, horaInicio: '08:30', horaFin: '12:30' },
        { actividad: sanyaActs[7]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
      ]},
    ],
  });
  guides.push({
    titulo: 'Sanya Express - 2 Días',
    descripcion: 'Playa, snorkel y mariscos: lo mejor de la isla tropical de Hainan en un fin de semana.',
    ciudad: sanya._id, duracionDias: 2, precio: 209,
    imagen: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Playa y Guanyin', actividades: [
        { actividad: sanyaActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '14:00' },
        { actividad: sanyaActs[1]._id, orden: 2, horaInicio: '15:00', horaFin: '18:00' },
        { actividad: sanyaActs[4]._id, orden: 3, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 2, titulo: 'Isla y Surf', actividades: [
        { actividad: sanyaActs[2]._id, orden: 1, horaInicio: '08:00', horaFin: '14:00' },
        { actividad: sanyaActs[6]._id, orden: 2, horaInicio: '15:30', horaFin: '18:30' },
      ]},
    ],
  });
  guides.push({
    titulo: 'Sanya Aventura Tropical - 5 Días',
    descripcion: 'Hainan completo: todas las playas, isla Wuzhizhou, selva, surf, templo de Guanyin, ruta del coco y atardeceres tropicales durante 5 días.',
    ciudad: sanya._id, duracionDias: 5, precio: 459,
    imagen: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada y Playa', actividades: [
        { actividad: sanyaActs[0]._id, orden: 1, horaInicio: '14:00', horaFin: '18:00' },
        { actividad: sanyaActs[4]._id, orden: 2, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 2, titulo: 'Isla Wuzhizhou', actividades: [
        { actividad: sanyaActs[2]._id, orden: 1, horaInicio: '08:00', horaFin: '14:00' },
        { actividad: sanyaActs[5]._id, orden: 2, horaInicio: '16:00', horaFin: '18:00' },
      ]},
      { numeroDia: 3, titulo: 'Guanyin y Selva', actividades: [
        { actividad: sanyaActs[1]._id, orden: 1, horaInicio: '08:30', horaFin: '11:30' },
        { actividad: sanyaActs[3]._id, orden: 2, horaInicio: '13:00', horaFin: '17:00' },
      ]},
      { numeroDia: 4, titulo: 'Surf y Coco', actividades: [
        { actividad: sanyaActs[6]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: sanyaActs[7]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
      ]},
      { numeroDia: 5, titulo: 'Playa Libre', actividades: [
        { actividad: sanyaActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '14:00' },
      ]},
    ],
  });

  // --- PINGYAO: 3 guías ---
  guides.push({
    titulo: 'Pingyao - Viaje al Pasado Imperial',
    descripcion: '3 días en la ciudad amurallada más auténtica de China: murallas Ming, primer banco, templos, vinagre artesanal, fideos y teatro inmersivo.',
    ciudad: pingyao._id, duracionDias: 3, precio: 239,
    imagen: 'https://images.unsplash.com/photo-1527549993586-dff825b37782?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Muralla y Centro', actividades: [
        { actividad: pingyaoActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: pingyaoActs[1]._id, orden: 2, horaInicio: '13:00', horaFin: '14:30' },
        { actividad: pingyaoActs[2]._id, orden: 3, horaInicio: '15:00', horaFin: '17:00' },
        { actividad: pingyaoActs[5]._id, orden: 4, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Templos y Vinagre', actividades: [
        { actividad: pingyaoActs[4]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: pingyaoActs[3]._id, orden: 2, horaInicio: '14:00', horaFin: '15:30' },
        { actividad: pingyaoActs[7]._id, orden: 3, horaInicio: '17:00', horaFin: '19:00' },
      ]},
      { numeroDia: 3, titulo: 'Casa Patio', actividades: [
        { actividad: pingyaoActs[6]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
      ]},
    ],
  });
  guides.push({
    titulo: 'Pingyao Express - 2 Días',
    descripcion: 'Murallas, banco imperial y teatro inmersivo: la esencia de la China Ming en un fin de semana.',
    ciudad: pingyao._id, duracionDias: 2, precio: 169,
    imagen: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Muralla y Banco', actividades: [
        { actividad: pingyaoActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: pingyaoActs[1]._id, orden: 2, horaInicio: '13:00', horaFin: '14:30' },
        { actividad: pingyaoActs[2]._id, orden: 3, horaInicio: '15:00', horaFin: '17:00' },
        { actividad: pingyaoActs[5]._id, orden: 4, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Vinagre y Fideos', actividades: [
        { actividad: pingyaoActs[3]._id, orden: 1, horaInicio: '09:30', horaFin: '11:00' },
        { actividad: pingyaoActs[7]._id, orden: 2, horaInicio: '12:00', horaFin: '14:00' },
      ]},
    ],
  });
  guides.push({
    titulo: 'Pingyao y Templos de Shanxi - 4 Días',
    descripcion: 'La China más profunda: murallas, bancos imperiales, templos de esculturas pintadas, vinagre, fideos cortados con cuchillo y noches en casas patio Qing.',
    ciudad: pingyao._id, duracionDias: 4, precio: 329,
    imagen: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Muralla y Centro', actividades: [
        { actividad: pingyaoActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: pingyaoActs[1]._id, orden: 2, horaInicio: '13:00', horaFin: '14:30' },
        { actividad: pingyaoActs[2]._id, orden: 3, horaInicio: '15:00', horaFin: '17:00' },
      ]},
      { numeroDia: 2, titulo: 'Templos', actividades: [
        { actividad: pingyaoActs[4]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: pingyaoActs[3]._id, orden: 2, horaInicio: '14:00', horaFin: '15:30' },
        { actividad: pingyaoActs[5]._id, orden: 3, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 3, titulo: 'Gastronomía', actividades: [
        { actividad: pingyaoActs[7]._id, orden: 1, horaInicio: '10:00', horaFin: '12:00' },
        { actividad: pingyaoActs[6]._id, orden: 2, horaInicio: '15:00', horaFin: '17:00' },
      ]},
      { numeroDia: 4, titulo: 'Paseo Final', actividades: [
        { actividad: pingyaoActs[2]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
      ]},
    ],
  });

  await Guide.create(guides);
  console.log('Guías creadas (60 guías para 20 ciudades)');

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
    { nombre: 'Xi\'an Terracotta Hotel', ciudad: xian._id, estrellas: 4, precioPorNoche: 60, descripcion: 'Hotel con decoración de la dinastía Tang junto a la muralla sur.' },
    { nombre: 'Bell Tower Heritage Inn', ciudad: xian._id, estrellas: 3, precioPorNoche: 35, descripcion: 'Alojamiento céntrico junto a la Torre de la Campana con azotea panorámica.' },
    { nombre: 'White Swan Hotel', ciudad: guangzhou._id, estrellas: 5, precioPorNoche: 130, descripcion: 'Hotel icónico en la isla Shamian con jardín interior y vistas al río Perla.' },
    { nombre: 'Guangzhou Garden Inn', ciudad: guangzhou._id, estrellas: 3, precioPorNoche: 45, descripcion: 'Hotel económico con desayuno dim sum incluido en el centro de la ciudad.' },
    { nombre: 'West Lake State House', ciudad: hangzhou._id, estrellas: 5, precioPorNoche: 140, descripcion: 'Hotel de lujo con jardín privado a orillas del Lago del Oeste. Vistas de ensueño.' },
    { nombre: 'Longjing Tea Garden Hotel', ciudad: hangzhou._id, estrellas: 4, precioPorNoche: 75, descripcion: 'Hotel boutique rodeado de plantaciones de té Longjing con ceremonia de té incluida.' },
    { nombre: 'Guilin Bravo Hotel', ciudad: guilin._id, estrellas: 4, precioPorNoche: 55, descripcion: 'Hotel junto al río Li con terraza con vistas a las montañas kársticas.' },
    { nombre: 'Yangshuo Mountain Retreat', ciudad: guilin._id, estrellas: 3, precioPorNoche: 40, descripcion: 'Eco-lodge entre arrozales y montañas kársticas. Tranquilidad absoluta.' },
    { nombre: 'St. Regis Lhasa Resort', ciudad: lhasa._id, estrellas: 5, precioPorNoche: 160, descripcion: 'Resort de lujo con spa y oxígeno suplementario en las habitaciones a 3.650m.' },
    { nombre: 'Yak Hotel', ciudad: lhasa._id, estrellas: 3, precioPorNoche: 30, descripcion: 'Hotel mochilero legendario junto al Barkhor. Punto de encuentro de viajeros.' },
    { nombre: 'Dali Landscape Hotel', ciudad: dali._id, estrellas: 4, precioPorNoche: 50, descripcion: 'Hotel con terraza frente al lago Erhai y vistas a las montañas Cangshan.' },
    { nombre: 'Old Town Courtyard Inn', ciudad: dali._id, estrellas: 3, precioPorNoche: 28, descripcion: 'Casa patio Bai tradicional convertida en hotel boutique en la ciudad antigua.' },
    { nombre: 'Xiamen Harbour Hotel', ciudad: xiamen._id, estrellas: 4, precioPorNoche: 70, descripcion: 'Hotel moderno frente al puerto de ferris a Gulangyu con vistas al mar.' },
    { nombre: 'Gulangyu Piano Inn', ciudad: xiamen._id, estrellas: 3, precioPorNoche: 55, descripcion: 'Encantador B&B en Gulangyu con decoración musical y jardín tropical.' },
    { nombre: 'Suzhou Tonino Lamborghini Hotel', ciudad: suzhou._id, estrellas: 5, precioPorNoche: 120, descripcion: 'Hotel de lujo junto al canal Pingjiang con jardín clásico privado.' },
    { nombre: 'Canal Garden Inn', ciudad: suzhou._id, estrellas: 3, precioPorNoche: 40, descripcion: 'Hotel boutique en casa Ming restaurada junto al canal con patio interior.' },
    { nombre: 'Lijiang Zen Garden Hotel', ciudad: lijiang._id, estrellas: 4, precioPorNoche: 65, descripcion: 'Hotel Naxi con patio de flores y vistas a la Montaña del Dragón de Jade.' },
    { nombre: 'Old Town Naxi Inn', ciudad: lijiang._id, estrellas: 3, precioPorNoche: 30, descripcion: 'Casa de madera Naxi en el corazón de la ciudad antigua con chimenea.' },
    { nombre: 'Zhangjiajie Pullman', ciudad: zhangjiajie._id, estrellas: 5, precioPorNoche: 100, descripcion: 'Hotel de lujo junto al parque nacional con vistas a los pilares de piedra.' },
    { nombre: 'Avatar Mountain Lodge', ciudad: zhangjiajie._id, estrellas: 3, precioPorNoche: 35, descripcion: 'Lodge rústico junto a la entrada del parque con restaurante hunanés.' },
    { nombre: 'Green Lake Hotel', ciudad: kunming._id, estrellas: 4, precioPorNoche: 60, descripcion: 'Hotel junto al Lago Verde con jardín tropical y desayuno yunnanés.' },
    { nombre: 'Kunming Spring City Inn', ciudad: kunming._id, estrellas: 3, precioPorNoche: 32, descripcion: 'Hotel económico céntrico con terraza y flores todo el año.' },
    { nombre: 'Nanjing Grand Hotel', ciudad: nanjing._id, estrellas: 5, precioPorNoche: 110, descripcion: 'Hotel de lujo junto al lago Xuanwu con spa y restaurante de pato salado.' },
    { nombre: 'Purple Mountain Youth Hostel', ciudad: nanjing._id, estrellas: 3, precioPorNoche: 28, descripcion: 'Hostal acogedor cerca de la Montaña Púrpura con ambiente universitario.' },
    { nombre: 'Dunhuang Silk Road Hotel', ciudad: dunhuang._id, estrellas: 4, precioPorNoche: 75, descripcion: 'Hotel temático de la Ruta de la Seda con decoración de las Cuevas de Mogao.' },
    { nombre: 'Desert Moon Inn', ciudad: dunhuang._id, estrellas: 3, precioPorNoche: 35, descripcion: 'Alojamiento junto a las dunas con terraza para observar estrellas.' },
    { nombre: 'Sanya Atlantis Resort', ciudad: sanya._id, estrellas: 5, precioPorNoche: 200, descripcion: 'Mega-resort con acuario, parque acuático y playa privada en Haitang Bay.' },
    { nombre: 'Dadonghai Beach Hotel', ciudad: sanya._id, estrellas: 3, precioPorNoche: 50, descripcion: 'Hotel frente a la playa de Dadonghai con acceso directo al mar.' },
    { nombre: 'Pingyao Yide Hotel', ciudad: pingyao._id, estrellas: 4, precioPorNoche: 45, descripcion: 'Casa patio Qing de 200 años con cama kang caliente y patio con farolillos.' },
    { nombre: 'Harmony Guesthouse', ciudad: pingyao._id, estrellas: 3, precioPorNoche: 22, descripcion: 'Pensión familiar en casa patio tradicional con comida casera de Shanxi.' },
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
    { aerolinea: 'China Eastern', origen: 'Madrid', destino: "Xi'an", ciudadDestino: xian._id, precio: 590, duracionHoras: 13 },
    { aerolinea: 'China Southern', origen: 'Madrid', destino: 'Cantón', ciudadDestino: guangzhou._id, precio: 510, duracionHoras: 12 },
    { aerolinea: 'Air China', origen: 'Barcelona', destino: 'Hangzhou', ciudadDestino: hangzhou._id, precio: 560, duracionHoras: 13 },
    { aerolinea: 'China Southern', origen: 'Madrid', destino: 'Guilin', ciudadDestino: guilin._id, precio: 600, duracionHoras: 14 },
    { aerolinea: 'Air China', origen: 'Madrid', destino: 'Lhasa (vía Chengdú)', ciudadDestino: lhasa._id, precio: 720, duracionHoras: 16 },
    { aerolinea: 'China Eastern', origen: 'Madrid', destino: 'Kunming (vía Dali)', ciudadDestino: dali._id, precio: 610, duracionHoras: 14.5 },
    { aerolinea: 'Xiamen Airlines', origen: 'Madrid', destino: 'Xiamen', ciudadDestino: xiamen._id, precio: 530, duracionHoras: 13 },
    { aerolinea: 'China Eastern', origen: 'Madrid', destino: 'Shanghái (vía Suzhou)', ciudadDestino: suzhou._id, precio: 520, duracionHoras: 12.5 },
    { aerolinea: 'China Eastern', origen: 'Barcelona', destino: 'Kunming (vía Lijiang)', ciudadDestino: lijiang._id, precio: 640, duracionHoras: 15 },
    { aerolinea: 'China Southern', origen: 'Madrid', destino: 'Changsha (vía Zhangjiajie)', ciudadDestino: zhangjiajie._id, precio: 580, duracionHoras: 13.5 },
    { aerolinea: 'China Eastern', origen: 'Madrid', destino: 'Kunming', ciudadDestino: kunming._id, precio: 590, duracionHoras: 13 },
    { aerolinea: 'Air China', origen: 'Madrid', destino: 'Nanjing', ciudadDestino: nanjing._id, precio: 540, duracionHoras: 12 },
    { aerolinea: 'Air China', origen: 'Madrid', destino: 'Lanzhou (vía Dunhuang)', ciudadDestino: dunhuang._id, precio: 670, duracionHoras: 15 },
    { aerolinea: 'Hainan Airlines', origen: 'Madrid', destino: 'Sanya (Hainan)', ciudadDestino: sanya._id, precio: 600, duracionHoras: 13.5 },
    { aerolinea: 'Air China', origen: 'Barcelona', destino: 'Taiyuan (vía Pingyao)', ciudadDestino: pingyao._id, precio: 610, duracionHoras: 14 },
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
  console.log('Ciudades: 20');
  console.log('Guías: 60 (3 por ciudad)');
  console.log('Actividades: 174');
  console.log('Hoteles: 40');
  console.log('Vuelos: 24');
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
