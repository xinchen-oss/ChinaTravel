import mongoose from 'mongoose';
import connectDB from './config/db.js';
import City from './models/City.js';
import Activity from './models/Activity.js';
import Guide from './models/Guide.js';
import Hotel from './models/Hotel.js';
import Flight from './models/Flight.js';

const seedMore = async () => {
  await connectDB();
  console.log('Añadiendo más contenido...\n');

  // ========== 10 NEW CITIES ==========
  const cities = await City.create([
    {
      nombre: 'Shenzhen', nombreChino: '深圳', slug: 'shenzhen',
      descripcion: 'De pueblo pesquero a metrópolis tecnológica en 40 años. Capital de la innovación china, sede de Huawei, Tencent y DJI. Arquitectura futurista, parques temáticos y la mejor electrónica del mundo en Huaqiangbei.',
      imagenPortada: 'https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?w=800&q=80',
    },
    {
      nombre: 'Wuhan', nombreChino: '武汉', slug: 'wuhan',
      descripcion: 'Ciudad de los tres ríos en el centro de China. Famosa por la Torre de la Grulla Amarilla, el lago del Este, la flor de cerezo de la Universidad de Wuhan y los tallarines calientes (re gan mian).',
      imagenPortada: 'https://images.unsplash.com/photo-1583425423320-1a6d856b4b02?w=800&q=80',
    },
    {
      nombre: 'Qingdao', nombreChino: '青岛', slug: 'qingdao',
      descripcion: 'Ciudad costera con herencia alemana: cerveza Tsingtao, arquitectura bávara, playas doradas y mariscos frescos. Sede de las regatas olímpicas de 2008.',
      imagenPortada: 'https://images.unsplash.com/photo-1559070169-a3077159ee16?w=800&q=80',
    },
    {
      nombre: 'Changsha', nombreChino: '长沙', slug: 'changsha',
      descripcion: 'Capital de Hunan, cuna de Mao Zedong y de la cocina más picante de China. Isla Naranja, vida nocturna vibrante y los famosos tallarines de arroz de Hunan.',
      imagenPortada: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80',
    },
    {
      nombre: 'Tianjin', nombreChino: '天津', slug: 'tianjin',
      descripcion: 'Puerto histórico a 30 minutos de Pekín con arquitectura colonial de 9 países, dim sum norteño, el Ojo de Tianjin (noria gigante sobre un puente) y la Calle Antigua de la Cultura.',
      imagenPortada: 'https://images.unsplash.com/photo-1548018560-c7196e4f5bba?w=800&q=80',
    },
    {
      nombre: 'Chengde', nombreChino: '承德', slug: 'chengde',
      descripcion: 'Residencia de verano de los emperadores Qing (Patrimonio UNESCO). Jardines imperiales, templos tibetanos y una escapada imperial a solo 3 horas de Pekín.',
      imagenPortada: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    },
    {
      nombre: 'Huangshan', nombreChino: '黄山', slug: 'huangshan',
      descripcion: 'Las Montañas Amarillas que inspiraron mil pinturas chinas. Pinos centenarios entre nubes, aguas termales, amanecer sobre un mar de niebla y pueblos Hui con arquitectura imperial.',
      imagenPortada: 'https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=800&q=80',
    },
    {
      nombre: 'Fuzhou', nombreChino: '福州', slug: 'fuzhou',
      descripcion: 'Capital de Fujian, tierra del té y los templos. Calles históricas de Sanfang Qixiang (Tres Callejones y Siete Avenidas), aguas termales naturales y cultura min.',
      imagenPortada: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80',
    },
    {
      nombre: 'Luoyang', nombreChino: '洛阳', slug: 'luoyang',
      descripcion: 'Antigua capital de 13 dinastías. Las Grutas de Longmen con 100.000 estatuas budistas (UNESCO), el Templo del Caballo Blanco y el festival de peonías más famoso del mundo.',
      imagenPortada: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800&q=80',
    },
    {
      nombre: 'Guiyang', nombreChino: '贵阳', slug: 'guiyang',
      descripcion: 'Capital de Guizhou, provincia de las minorías étnicas. Cascada Huangguoshu, pueblos Miao y Dong con arquitectura de madera, arroz ácido y la naturaleza más virgen del sur de China.',
      imagenPortada: 'https://images.unsplash.com/photo-1537531383496-f4749b02e080?w=800&q=80',
    },
  ]);
  console.log('10 nuevas ciudades creadas');

  const [shenzhen, wuhan, qingdao, changsha, tianjin, chengde, huangshan, fuzhou, luoyang, guiyang] = cities;

  // ========== ACTIVITIES (8 per city = 80 new) ==========

  const shenzhenActs = await Activity.create([
    { nombre: 'Huaqiangbei Electronics Market', descripcion: 'El mercado de electrónica más grande del mundo. Varios edificios de componentes, gadgets y tecnología de vanguardia.', ciudad: shenzhen._id, categoria: 'COMPRAS', duracionHoras: 3, precio: 0 },
    { nombre: 'OCT Loft Creative Park', descripcion: 'Distrito de arte y diseño en antiguas fábricas. Galerías, cafés de especialidad y tiendas de diseñadores locales.', ciudad: shenzhen._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 0 },
    { nombre: 'Ventana del Mundo', descripcion: 'Parque temático con 130 réplicas de monumentos famosos a escala reducida. La Torre Eiffel, las Pirámides y más.', ciudad: shenzhen._id, categoria: 'AVENTURA', duracionHoras: 5, precio: 30 },
    { nombre: 'Dafen Oil Painting Village', descripcion: 'Pueblo donde artistas producen el 60% de las pinturas al óleo del mundo. Puedes encargar retratos o comprar copias maestras.', ciudad: shenzhen._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 0 },
    { nombre: 'Comida cantonesa en Dongmen', descripcion: 'Mercado gastronómico con dim sum, congee, char siu y las mejores tartas de huevo de Guangdong.', ciudad: shenzhen._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 15 },
    { nombre: 'Lianhuashan Park', descripcion: 'Parque en la cima de una colina con la estatua de Deng Xiaoping y vistas panorámicas del skyline de Futian.', ciudad: shenzhen._id, categoria: 'NATURALEZA', duracionHoras: 2, precio: 0 },
    { nombre: 'Sea World Plaza', descripcion: 'Complejo de ocio nocturno junto al mar con bares, restaurantes y música en vivo. Ambiente internacional.', ciudad: shenzhen._id, categoria: 'NOCTURNO', duracionHoras: 3, precio: 0 },
    { nombre: 'Museo de Reforma de Shenzhen', descripcion: 'Historia de la transformación de pueblo pesquero a metrópolis tecnológica en una generación.', ciudad: shenzhen._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 0 },
  ]);

  const wuhanActs = await Activity.create([
    { nombre: 'Torre de la Grulla Amarilla', descripcion: 'Torre icónica de 5 pisos con 1.800 años de historia y vistas al río Yangtsé. Una de las tres grandes torres de China.', ciudad: wuhan._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 15 },
    { nombre: 'Lago del Este', descripcion: 'El lago urbano más grande de China. Paseo en bote, jardines de cerezos y la isla de la Grúa.', ciudad: wuhan._id, categoria: 'NATURALEZA', duracionHoras: 3, precio: 10 },
    { nombre: 'Re Gan Mian (tallarines calientes)', descripcion: 'Degustación del plato más famoso de Wuhan: tallarines con pasta de sésamo, servidos calientes por la mañana.', ciudad: wuhan._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 5 },
    { nombre: 'Cerezos de la Universidad de Wuhan', descripcion: 'En marzo-abril, el campus se cubre de cerezos en flor. El spot de hanami más famoso de China.', ciudad: wuhan._id, categoria: 'NATURALEZA', duracionHoras: 2.5, precio: 0 },
    { nombre: 'Puente del Yangtsé', descripcion: 'El primer puente sobre el Yangtsé. Paseo a pie por el puente de doble nivel con vistas impresionantes.', ciudad: wuhan._id, categoria: 'HISTORICO', duracionHoras: 1.5, precio: 0 },
    { nombre: 'Calle Jiqing', descripcion: 'Calle gastronómica nocturna con puestos de mariscos de río, brochetas y cerveza local. Ambiente festivo.', ciudad: wuhan._id, categoria: 'NOCTURNO', duracionHoras: 2.5, precio: 10 },
    { nombre: 'Museo Provincial de Hubei', descripcion: 'Tesoros arqueológicos del reino Chu, incluyendo las campanas de bronce del Marqués Yi de Zeng (2.400 años).', ciudad: wuhan._id, categoria: 'CULTURAL', duracionHoras: 3, precio: 0 },
    { nombre: 'Zhongshan Road Shopping', descripcion: 'Calle comercial histórica con mezcla de arquitectura colonial y moderna. Tiendas y centros comerciales.', ciudad: wuhan._id, categoria: 'COMPRAS', duracionHoras: 2, precio: 0 },
  ]);

  const qingdaoActs = await Activity.create([
    { nombre: 'Fábrica de cerveza Tsingtao', descripcion: 'Visita a la cervecería fundada por alemanes en 1903. Degustación de cerveza sin filtrar directamente de los tanques.', ciudad: qingdao._id, categoria: 'GASTRONOMIA', duracionHoras: 2.5, precio: 15 },
    { nombre: 'Playa de Zhanqiao', descripcion: 'Playa junto al emblemático muelle Zhanqiao. Aguas cristalinas y vistas al casco antiguo alemán.', ciudad: qingdao._id, categoria: 'NATURALEZA', duracionHoras: 2, precio: 0 },
    { nombre: 'Barrio alemán de Badaguan', descripcion: 'Ocho calles con villas coloniales de 20 estilos arquitectónicos diferentes. Patrimonio histórico único.', ciudad: qingdao._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 0 },
    { nombre: 'Mercado de mariscos de Tuandao', descripcion: 'Mercado fresco donde compras mariscos y te los cocinan al momento. Las ostras y almejas son imprescindibles.', ciudad: qingdao._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 20 },
    { nombre: 'Monte Laoshan', descripcion: 'Montaña sagrada taoísta junto al mar. Senderos costeros, templos en acantilados y cascadas. Producción del té Laoshan.', ciudad: qingdao._id, categoria: 'AVENTURA', duracionHoras: 6, precio: 25 },
    { nombre: 'Calle de la Cerveza', descripcion: 'Festival permanente de cerveza. Bares al aire libre, música en vivo y cerveza artesanal local. El mejor ambiente nocturno.', ciudad: qingdao._id, categoria: 'NOCTURNO', duracionHoras: 3, precio: 10 },
    { nombre: 'Iglesia de San Miguel', descripcion: 'Catedral católica de estilo gótico alemán construida en 1934. Interior con vitrales y órgano original.', ciudad: qingdao._id, categoria: 'CULTURAL', duracionHoras: 1, precio: 5 },
    { nombre: 'Centro Olímpico de Vela', descripcion: 'Sede de las competiciones de vela de Beijing 2008. Paseo por el puerto deportivo con vistas al mar.', ciudad: qingdao._id, categoria: 'AVENTURA', duracionHoras: 2, precio: 10 },
  ]);

  const changshaActs = await Activity.create([
    { nombre: 'Isla Naranja (Juzizhou)', descripcion: 'Isla en medio del río Xiang con la estatua gigante del joven Mao Zedong (32m). Parque público con vistas panorámicas.', ciudad: changsha._id, categoria: 'HISTORICO', duracionHoras: 2.5, precio: 0 },
    { nombre: 'Comida picante de Hunan', descripcion: 'Tour gastronómico por la cocina más picante de China: duo jiao yu tou, stinky tofu y chou doufu en Pozi Street.', ciudad: changsha._id, categoria: 'GASTRONOMIA', duracionHoras: 2.5, precio: 15 },
    { nombre: 'Museo Provincial de Hunan', descripcion: 'La momia de la Dama de Dai de hace 2.100 años, perfectamente conservada. Uno de los hallazgos más impresionantes.', ciudad: changsha._id, categoria: 'CULTURAL', duracionHoras: 3, precio: 0 },
    { nombre: 'Montaña Yuelu', descripcion: 'Montaña con la Academia Yuelu (una de las 4 grandes academias de China), templo budista y senderos entre bosques.', ciudad: changsha._id, categoria: 'NATURALEZA', duracionHoras: 3.5, precio: 0 },
    { nombre: 'Pozi Street nocturna', descripcion: 'La calle peatonal más animada de Changsha. Comida callejera, tiendas, artistas callejeros y multitudes hasta la madrugada.', ciudad: changsha._id, categoria: 'NOCTURNO', duracionHoras: 2.5, precio: 0 },
    { nombre: 'Stinky Tofu de Huogongdian', descripcion: 'Degustación del famoso tofu fermentado maloliente en el restaurante más legendario de Changsha (120 años).', ciudad: changsha._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 8 },
    { nombre: 'Río Xiang de noche', descripcion: 'Crucero nocturno por el río Xiang con vistas a los rascacielos iluminados y la Isla Naranja.', ciudad: changsha._id, categoria: 'NOCTURNO', duracionHoras: 1.5, precio: 15 },
    { nombre: 'Ventana de Hunan', descripcion: 'Espectáculo cultural con música, danza y acrobacias que recorre la historia y tradiciones de la provincia de Hunan.', ciudad: changsha._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 25 },
  ]);

  const tianjinActs = await Activity.create([
    { nombre: 'Ojo de Tianjin', descripcion: 'Noria gigante construida sobre un puente. La única de su tipo en el mundo. Vistas 360° de la ciudad.', ciudad: tianjin._id, categoria: 'AVENTURA', duracionHoras: 1.5, precio: 15 },
    { nombre: 'Calle Antigua de la Cultura', descripcion: 'Calle peatonal con arquitectura Qing restaurada, tiendas de artesanía, caligrafía y dulces tradicionales.', ciudad: tianjin._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 0 },
    { nombre: 'Concesiones extranjeras', descripcion: 'Recorrido por las 9 antiguas concesiones: italiana, francesa, británica, alemana... Arquitectura colonial perfectamente conservada.', ciudad: tianjin._id, categoria: 'HISTORICO', duracionHoras: 3, precio: 0 },
    { nombre: 'Goubuli Baozi', descripcion: 'Los baozi (bollos rellenos al vapor) más famosos de China, con 160 años de historia. Rellenos de cerdo jugosos.', ciudad: tianjin._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 10 },
    { nombre: 'Calle de la Comida de Nanshi', descripcion: 'Mercado gastronómico con 100+ puestos de comida norteña: jianbing, mahua (rosquillas trenzadas) y guobacai.', ciudad: tianjin._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 10 },
    { nombre: 'Porcelana Tower', descripcion: 'La torre de porcelana esmaltada más alta del mundo (72m) en el templo Dabei. Budismo y artesanía combinados.', ciudad: tianjin._id, categoria: 'CULTURAL', duracionHoras: 1.5, precio: 10 },
    { nombre: 'Crucero por el río Hai', descripcion: 'Navegación nocturna por el río Hai pasando bajo los puentes iluminados y viendo el Ojo de Tianjin.', ciudad: tianjin._id, categoria: 'NOCTURNO', duracionHoras: 1.5, precio: 12 },
    { nombre: 'Museo de Tianjin', descripcion: 'Historia de la ciudad desde la dinastía Ming hasta la era moderna. Maquetas históricas y exposiciones interactivas.', ciudad: tianjin._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 0 },
  ]);

  const chengdeActs = await Activity.create([
    { nombre: 'Residencia de Montaña', descripcion: 'Palacio de verano imperial más grande de China (Patrimonio UNESCO). Jardines, lagos y pabellones en 564 hectáreas.', ciudad: chengde._id, categoria: 'HISTORICO', duracionHoras: 5, precio: 40 },
    { nombre: 'Templo Putuo Zongcheng', descripcion: 'Réplica del Palacio Potala de Lhasa construida por el emperador Qianlong. Templo budista tibetano impresionante.', ciudad: chengde._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 20 },
    { nombre: 'Templo Puning', descripcion: 'Templo con la estatua de madera de Guanyin más alta del mundo (22m). Arquitectura Han-tibetana fusionada.', ciudad: chengde._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 15 },
    { nombre: 'Roca del Martillo', descripcion: 'Formación rocosa natural de 40m que se equilibra milagrosamente. Senderismo con vistas a la ciudad y los templos.', ciudad: chengde._id, categoria: 'NATURALEZA', duracionHoras: 3, precio: 10 },
    { nombre: 'Banquete imperial manchú', descripcion: 'Cena con recetas de la cocina imperial Qing en ambiente tradicional. Platos que comían los emperadores.', ciudad: chengde._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 35 },
    { nombre: 'Calle Qingfeng', descripcion: 'Paseo por la calle comercial antigua de Chengde con tiendas de antigüedades, artesanía y comida local.', ciudad: chengde._id, categoria: 'COMPRAS', duracionHoras: 2, precio: 0 },
    { nombre: 'Lago del Palacio', descripcion: 'Paseo en bote por los lagos del palacio imperial. Paisaje diseñado para recrear los mejores paisajes de China.', ciudad: chengde._id, categoria: 'NATURALEZA', duracionHoras: 1.5, precio: 15 },
    { nombre: 'Espectáculo nocturno imperial', descripcion: 'Show de luces y música en los jardines del palacio recreando la vida de la corte Qing.', ciudad: chengde._id, categoria: 'NOCTURNO', duracionHoras: 1.5, precio: 25 },
  ]);

  const huangshanActs = await Activity.create([
    { nombre: 'Subida a Montaña Amarilla', descripcion: 'Ascenso en teleférico a los picos de granito de Huangshan. Pinos centenarios, mar de nubes y amanecer épico.', ciudad: huangshan._id, categoria: 'AVENTURA', duracionHoras: 8, precio: 50 },
    { nombre: 'Amanecer en Pico Luminosidad', descripcion: 'Madrugar para ver el amanecer sobre un mar de nubes desde Guang Ming Ding (1.860m). Experiencia mística.', ciudad: huangshan._id, categoria: 'NATURALEZA', duracionHoras: 3, precio: 0 },
    { nombre: 'Pueblo antiguo de Hongcun', descripcion: 'Pueblo Hui del siglo XII (Patrimonio UNESCO). Casas con patios, puentes de piedra y lago en forma de luna creciente.', ciudad: huangshan._id, categoria: 'HISTORICO', duracionHoras: 3, precio: 20 },
    { nombre: 'Pueblo de Xidi', descripcion: 'Otro pueblo Hui UNESCO con 124 casas antiguas de la dinastía Ming y Qing. Tallas en madera y piedra exquisitas.', ciudad: huangshan._id, categoria: 'HISTORICO', duracionHoras: 2.5, precio: 20 },
    { nombre: 'Aguas termales de Huangshan', descripcion: 'Baños termales naturales al pie de la montaña. Agua a 42°C rodeado de bosques de bambú.', ciudad: huangshan._id, categoria: 'NATURALEZA', duracionHoras: 2.5, precio: 25 },
    { nombre: 'Té Maofeng de Huangshan', descripcion: 'Visita a plantación de té con degustación del famoso té verde Maofeng. Ceremonias de té tradicionales.', ciudad: huangshan._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 15 },
    { nombre: 'Calle Antigua de Tunxi', descripcion: 'Calle comercial de la dinastía Song con tiendas de tinta china, piedras de tinta y caligrafía.', ciudad: huangshan._id, categoria: 'COMPRAS', duracionHoras: 2, precio: 0 },
    { nombre: 'Tofu peludo de Huangshan', descripcion: 'Degustación del plato más emblemático: tofu fermentado frito con especias. Sabor intenso y textura crujiente.', ciudad: huangshan._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 8 },
  ]);

  const fuzhouActs = await Activity.create([
    { nombre: 'Sanfang Qixiang', descripcion: 'Tres Callejones y Siete Avenidas: barrio histórico de la dinastía Jin con casas señoriales, tiendas y templos.', ciudad: fuzhou._id, categoria: 'HISTORICO', duracionHoras: 3, precio: 0 },
    { nombre: 'Templo Yongquan', descripcion: 'Templo budista milenario en la montaña Gu. Colección de 20.000 sutras budistas y arquitectura espectacular.', ciudad: fuzhou._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 10 },
    { nombre: 'Té Jasmine de Fuzhou', descripcion: 'Fuzhou es la capital del té de jazmín. Visita a una casa de té con degustación y ceremonia tradicional.', ciudad: fuzhou._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 12 },
    { nombre: 'Aguas termales de Fuzhou', descripcion: 'La ciudad de las mil fuentes termales. Baños públicos tradicionales con agua mineral natural.', ciudad: fuzhou._id, categoria: 'NATURALEZA', duracionHoras: 2.5, precio: 18 },
    { nombre: 'Isla Jiangxin', descripcion: 'Isla en el río Min con templos, jardines y la pagoda Baita. Acceso en ferry desde el centro.', ciudad: fuzhou._id, categoria: 'NATURALEZA', duracionHoras: 2, precio: 5 },
    { nombre: 'Sopa de pescado fo tiao qiang', descripcion: 'El plato más lujoso de la cocina Fujian: sopa con más de 30 ingredientes premium. "Buda salta el muro".', ciudad: fuzhou._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 30 },
    { nombre: 'Montaña Gu', descripcion: 'Senderismo por la montaña más querida de Fuzhou con vistas a la ciudad, templos y bosques de banyan.', ciudad: fuzhou._id, categoria: 'AVENTURA', duracionHoras: 3, precio: 0 },
    { nombre: 'Mercado nocturno de Dalong', descripcion: 'Comida callejera fujianesa: ostras fritas, rollitos de primavera, sopa de maní y fishballs.', ciudad: fuzhou._id, categoria: 'NOCTURNO', duracionHoras: 2, precio: 10 },
  ]);

  const luoyangActs = await Activity.create([
    { nombre: 'Grutas de Longmen', descripcion: 'Más de 100.000 estatuas budistas talladas en acantilados a lo largo de 1km. UNESCO. El Buda Vairocana de 17m es majestuoso.', ciudad: luoyang._id, categoria: 'HISTORICO', duracionHoras: 4, precio: 30 },
    { nombre: 'Templo del Caballo Blanco', descripcion: 'El primer templo budista de China (68 d.C.). Jardines serenos, pagodas y monjes en meditación.', ciudad: luoyang._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 10 },
    { nombre: 'Templo Shaolin', descripcion: 'Excursión al legendario templo cuna del kung fu. Exhibiciones de artes marciales por monjes Shaolin.', ciudad: luoyang._id, categoria: 'CULTURAL', duracionHoras: 7, precio: 45 },
    { nombre: 'Festival de Peonías', descripcion: 'En abril, Luoyang celebra el festival de peonías más grande del mundo. Miles de variedades en plena floración.', ciudad: luoyang._id, categoria: 'NATURALEZA', duracionHoras: 3, precio: 10 },
    { nombre: 'Sopa de agua de Luoyang', descripcion: 'Banquete tradicional de 24 platos de sopa (shui xi). Cocina imperial de la dinastía Tang. Único en Luoyang.', ciudad: luoyang._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 20 },
    { nombre: 'Calle antigua de Luoyang', descripcion: 'Lǎo Chéng: ciudad antigua con mercados, templos y casas patio. Comida callejera auténtica.', ciudad: luoyang._id, categoria: 'COMPRAS', duracionHoras: 2.5, precio: 0 },
    { nombre: 'Museo de Luoyang', descripcion: 'Reliquias de 13 dinastías. Porcelanas Tang tricolor, bronces y jades imperiales.', ciudad: luoyang._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 0 },
    { nombre: 'Show de Kung Fu Shaolin', descripcion: 'Espectáculo nocturno de artes marciales con monjes del templo Shaolin. Acrobacias y meditación.', ciudad: luoyang._id, categoria: 'NOCTURNO', duracionHoras: 1.5, precio: 30 },
  ]);

  const guiyangActs = await Activity.create([
    { nombre: 'Cascada Huangguoshu', descripcion: 'La cascada más grande de Asia (77m de alto, 101m de ancho). Puedes caminar detrás de la cortina de agua.', ciudad: guiyang._id, categoria: 'NATURALEZA', duracionHoras: 6, precio: 40 },
    { nombre: 'Pueblo Miao de Xijiang', descripcion: 'El mayor pueblo Miao del mundo con 1.000 casas de madera. Danza con trajes de plata y rice wine de bienvenida.', ciudad: guiyang._id, categoria: 'CULTURAL', duracionHoras: 7, precio: 35 },
    { nombre: 'Jiaxiu Tower', descripcion: 'Pabellón sobre el río Nanming en el centro de Guiyang. Símbolo de la ciudad con iluminación nocturna preciosa.', ciudad: guiyang._id, categoria: 'HISTORICO', duracionHoras: 1.5, precio: 5 },
    { nombre: 'Sopa ácida de pescado Miao', descripcion: 'Degustación de la suan tang yu: sopa fermentada ácida con pescado de río. Plato estrella de la cocina Miao.', ciudad: guiyang._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 15 },
    { nombre: 'Puente del Viento y la Lluvia Dong', descripcion: 'Excursión a pueblos Dong con sus puentes cubiertos de madera construidos sin clavos. Arquitectura patrimonio vivo.', ciudad: guiyang._id, categoria: 'CULTURAL', duracionHoras: 6, precio: 30 },
    { nombre: 'Qianling Park', descripcion: 'Parque montañoso con templos, monos salvajes y vistas panorámicas de Guiyang. Pulmón verde de la ciudad.', ciudad: guiyang._id, categoria: 'NATURALEZA', duracionHoras: 3, precio: 5 },
    { nombre: 'Mercado nocturno de Erqi Road', descripcion: 'Comida callejera de Guizhou: changwang noodles, tofu frito y shao kao (barbacoa) con especias locales.', ciudad: guiyang._id, categoria: 'NOCTURNO', duracionHoras: 2, precio: 10 },
    { nombre: 'Batik y bordado Miao', descripcion: 'Taller artesanal de batik (teñido en cera) y bordado tradicional Miao con maestras artesanas.', ciudad: guiyang._id, categoria: 'COMPRAS', duracionHoras: 2.5, precio: 20 },
  ]);

  console.log('80 nuevas actividades creadas');

  // ========== GUIDES (3 per city = 30 new) ==========
  const allActs = [
    { city: shenzhen, acts: shenzhenActs, name: 'Shenzhen' },
    { city: wuhan, acts: wuhanActs, name: 'Wuhan' },
    { city: qingdao, acts: qingdaoActs, name: 'Qingdao' },
    { city: changsha, acts: changshaActs, name: 'Changsha' },
    { city: tianjin, acts: tianjinActs, name: 'Tianjin' },
    { city: chengde, acts: chengdeActs, name: 'Chengde' },
    { city: huangshan, acts: huangshanActs, name: 'Huangshan' },
    { city: fuzhou, acts: fuzhouActs, name: 'Fuzhou' },
    { city: luoyang, acts: luoyangActs, name: 'Luoyang' },
    { city: guiyang, acts: guiyangActs, name: 'Guiyang' },
  ];

  const guides = [];
  for (const { city, acts, name } of allActs) {
    // Guide 1: 3-day classic
    guides.push({
      titulo: `${name}: Lo esencial en 3 días`,
      descripcion: `Descubre lo mejor de ${name} en un viaje de 3 días con actividades culturales, gastronómicas y de aventura.`,
      ciudad: city._id, duracionDias: 3, precio: Math.round(80 + Math.random() * 120),
      imagen: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
      dias: [
        { numeroDia: 1, titulo: 'Cultura e historia', actividades: [
          { actividad: acts[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
          { actividad: acts[1]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
          { actividad: acts[4]._id, orden: 3, horaInicio: '19:00', horaFin: '21:00' },
        ]},
        { numeroDia: 2, titulo: 'Aventura y naturaleza', actividades: [
          { actividad: acts[2]._id, orden: 1, horaInicio: '08:30', horaFin: '13:30' },
          { actividad: acts[3]._id, orden: 2, horaInicio: '15:00', horaFin: '17:00' },
        ]},
        { numeroDia: 3, titulo: 'Gastronomía y compras', actividades: [
          { actividad: acts[5]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
          { actividad: acts[6]._id, orden: 2, horaInicio: '15:00', horaFin: '18:00' },
          { actividad: acts[7]._id, orden: 3, horaInicio: '19:00', horaFin: '21:00' },
        ]},
      ],
    });
    // Guide 2: 5-day deep dive
    guides.push({
      titulo: `${name}: Inmersión completa (5 días)`,
      descripcion: `Una inmersión profunda en ${name} para quienes quieren conocer cada rincón de esta fascinante ciudad.`,
      ciudad: city._id, duracionDias: 5, precio: Math.round(150 + Math.random() * 150),
      imagen: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
      dias: [
        { numeroDia: 1, titulo: 'Llegada y orientación', actividades: [
          { actividad: acts[0]._id, orden: 1, horaInicio: '10:00', horaFin: '12:00' },
          { actividad: acts[4]._id, orden: 2, horaInicio: '19:00', horaFin: '21:00' },
        ]},
        { numeroDia: 2, titulo: 'Historia profunda', actividades: [
          { actividad: acts[1]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
          { actividad: acts[7]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
          { actividad: acts[6]._id, orden: 3, horaInicio: '20:00', horaFin: '22:00' },
        ]},
        { numeroDia: 3, titulo: 'Aventura', actividades: [
          { actividad: acts[2]._id, orden: 1, horaInicio: '08:00', horaFin: '13:00' },
          { actividad: acts[5]._id, orden: 2, horaInicio: '15:00', horaFin: '17:00' },
        ]},
        { numeroDia: 4, titulo: 'Cultura local', actividades: [
          { actividad: acts[3]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
          { actividad: acts[4]._id, orden: 2, horaInicio: '12:30', horaFin: '14:30' },
          { actividad: acts[6]._id, orden: 3, horaInicio: '16:00', horaFin: '18:00' },
        ]},
        { numeroDia: 5, titulo: 'Despedida', actividades: [
          { actividad: acts[5]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
          { actividad: acts[0]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
        ]},
      ],
    });
    // Guide 3: 2-day weekend
    guides.push({
      titulo: `${name}: Escapada de fin de semana`,
      descripcion: `Un fin de semana intenso en ${name}: lo imprescindible en solo 2 días.`,
      ciudad: city._id, duracionDias: 2, precio: Math.round(50 + Math.random() * 80),
      imagen: 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=800&q=80',
      dias: [
        { numeroDia: 1, titulo: 'Lo imprescindible', actividades: [
          { actividad: acts[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
          { actividad: acts[2]._id, orden: 2, horaInicio: '13:00', horaFin: '17:00' },
          { actividad: acts[6]._id, orden: 3, horaInicio: '20:00', horaFin: '22:00' },
        ]},
        { numeroDia: 2, titulo: 'Sabores y recuerdos', actividades: [
          { actividad: acts[4]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
          { actividad: acts[3]._id, orden: 2, horaInicio: '13:00', horaFin: '15:00' },
        ]},
      ],
    });
  }

  await Guide.create(guides);
  console.log('30 nuevas guías creadas');

  // ========== HOTELS (3 per city = 30 new) ==========
  await Hotel.create([
    { nombre: 'Shenzhen Tech Hub Hotel', ciudad: shenzhen._id, estrellas: 5, precioPorNoche: 130, descripcion: 'Hotel futurista en Futian CBD con habitaciones inteligentes controladas por app.' },
    { nombre: 'Nanshan Bay Inn', ciudad: shenzhen._id, estrellas: 3, precioPorNoche: 45, descripcion: 'Hotel económico cerca de Sea World con terraza y vistas al puerto.' },
    { nombre: 'OCT Loft Design Hotel', ciudad: shenzhen._id, estrellas: 4, precioPorNoche: 85, descripcion: 'Hotel boutique en el distrito de arte con decoración de diseñadores locales.' },
    { nombre: 'Wuhan Yangtze Hotel', ciudad: wuhan._id, estrellas: 5, precioPorNoche: 110, descripcion: 'Hotel de lujo junto al río Yangtsé con vistas a la Torre de la Grulla Amarilla.' },
    { nombre: 'East Lake Garden Hotel', ciudad: wuhan._id, estrellas: 4, precioPorNoche: 65, descripcion: 'Hotel junto al Lago del Este con jardín de cerezos y restaurante hubeínés.' },
    { nombre: 'Wuchang Budget Inn', ciudad: wuhan._id, estrellas: 3, precioPorNoche: 30, descripcion: 'Alojamiento económico cerca de la universidad con ambiente joven y cafeterías.' },
    { nombre: 'Qingdao Seaside Resort', ciudad: qingdao._id, estrellas: 5, precioPorNoche: 140, descripcion: 'Resort frente al mar con playa privada y restaurante de mariscos premium.' },
    { nombre: 'German Quarter Hotel', ciudad: qingdao._id, estrellas: 4, precioPorNoche: 75, descripcion: 'Hotel en villa colonial alemana restaurada. Desayuno incluye cerveza Tsingtao artesanal.' },
    { nombre: 'Zhanqiao Hostel', ciudad: qingdao._id, estrellas: 3, precioPorNoche: 32, descripcion: 'Hostal junto al muelle Zhanqiao con terraza con vistas al mar y cocina compartida.' },
    { nombre: 'Changsha Grand Hotel', ciudad: changsha._id, estrellas: 5, precioPorNoche: 100, descripcion: 'Hotel de lujo en Wuyi Road con spa y el mejor restaurante de cocina hunanesa.' },
    { nombre: 'Orange Island Hotel', ciudad: changsha._id, estrellas: 4, precioPorNoche: 60, descripcion: 'Hotel moderno con vistas a la Isla Naranja y el río Xiang.' },
    { nombre: 'Pozi Street Inn', ciudad: changsha._id, estrellas: 3, precioPorNoche: 28, descripcion: 'Alojamiento en plena calle peatonal. Ruidoso pero en el centro de la acción.' },
    { nombre: 'Tianjin Astor Hotel', ciudad: tianjin._id, estrellas: 5, precioPorNoche: 120, descripcion: 'Hotel histórico de 1863 en la antigua concesión británica. Donde se alojaron Sun Yat-sen y Herbert Hoover.' },
    { nombre: 'Italian Quarter Hotel', ciudad: tianjin._id, estrellas: 4, precioPorNoche: 70, descripcion: 'Hotel boutique en la antigua concesión italiana con restaurante de fusión china-italiana.' },
    { nombre: 'Tianjin Central Hostel', ciudad: tianjin._id, estrellas: 3, precioPorNoche: 25, descripcion: 'Hostal moderno cerca de la estación de tren rápido a Pekín (30 min).' },
    { nombre: 'Chengde Imperial Resort', ciudad: chengde._id, estrellas: 5, precioPorNoche: 95, descripcion: 'Resort junto al palacio de verano con aguas termales y cocina imperial manchú.' },
    { nombre: 'Mountain View Hotel', ciudad: chengde._id, estrellas: 4, precioPorNoche: 55, descripcion: 'Hotel con vistas a las montañas y los templos. Terraza panorámica.' },
    { nombre: 'Chengde Guesthouse', ciudad: chengde._id, estrellas: 3, precioPorNoche: 28, descripcion: 'Pensión familiar con comida casera manchú y ambiente acogedor.' },
    { nombre: 'Huangshan Pine Hotel', ciudad: huangshan._id, estrellas: 5, precioPorNoche: 150, descripcion: 'Hotel de montaña junto a la cima. Despierta entre nubes con vistas a los pinos centenarios.' },
    { nombre: 'Hongcun Courtyard Hotel', ciudad: huangshan._id, estrellas: 4, precioPorNoche: 65, descripcion: 'Casa patio Hui convertida en hotel boutique dentro del pueblo UNESCO de Hongcun.' },
    { nombre: 'Tunxi Old Street Inn', ciudad: huangshan._id, estrellas: 3, precioPorNoche: 30, descripcion: 'Hotel en la calle antigua de Tunxi con tiendas de caligrafía y tinta china.' },
    { nombre: 'Fuzhou Hot Spring Hotel', ciudad: fuzhou._id, estrellas: 4, precioPorNoche: 70, descripcion: 'Hotel con piscinas termales naturales privadas en cada habitación.' },
    { nombre: 'Sanfang Heritage Inn', ciudad: fuzhou._id, estrellas: 3, precioPorNoche: 38, descripcion: 'Hotel boutique en el barrio histórico de Sanfang Qixiang con patio de bambú.' },
    { nombre: 'Fuzhou Riverside Hotel', ciudad: fuzhou._id, estrellas: 5, precioPorNoche: 100, descripcion: 'Hotel moderno junto al río Min con restaurante de cocina Fujian premium.' },
    { nombre: 'Luoyang Peony Hotel', ciudad: luoyang._id, estrellas: 5, precioPorNoche: 90, descripcion: 'Hotel de lujo con jardín de peonías y spa con tratamientos de medicina tradicional china.' },
    { nombre: 'Longmen Guesthouse', ciudad: luoyang._id, estrellas: 4, precioPorNoche: 50, descripcion: 'Hotel junto a las Grutas de Longmen con vistas a los acantilados budistas.' },
    { nombre: 'Old Town Luoyang Inn', ciudad: luoyang._id, estrellas: 3, precioPorNoche: 25, descripcion: 'Alojamiento económico en la ciudad antigua con acceso fácil al banquete de sopa de agua.' },
    { nombre: 'Guiyang Miao Hotel', ciudad: guiyang._id, estrellas: 4, precioPorNoche: 55, descripcion: 'Hotel temático Miao con decoración de plata artesanal y restaurante étnico.' },
    { nombre: 'Huangguoshu Resort', ciudad: guiyang._id, estrellas: 5, precioPorNoche: 120, descripcion: 'Resort de lujo junto a la cascada Huangguoshu con piscina infinity y spa.' },
    { nombre: 'Guiyang Backpacker Inn', ciudad: guiyang._id, estrellas: 3, precioPorNoche: 22, descripcion: 'Hostal mochilero cerca del parque Qianling con tours a pueblos étnicos.' },
  ]);
  console.log('30 nuevos hoteles creados');

  // ========== FLIGHTS (2 per city = 20 new) ==========
  await Flight.create([
    { aerolinea: 'China Southern', origen: 'Madrid', destino: 'Shenzhen', ciudadDestino: shenzhen._id, precio: 520, duracionHoras: 12.5 },
    { aerolinea: 'Hainan Airlines', origen: 'Barcelona', destino: 'Shenzhen', ciudadDestino: shenzhen._id, precio: 540, duracionHoras: 13 },
    { aerolinea: 'Air China', origen: 'Madrid', destino: 'Wuhan', ciudadDestino: wuhan._id, precio: 560, duracionHoras: 12 },
    { aerolinea: 'China Eastern', origen: 'Barcelona', destino: 'Wuhan', ciudadDestino: wuhan._id, precio: 580, duracionHoras: 12.5 },
    { aerolinea: 'Shandong Airlines', origen: 'Madrid', destino: 'Qingdao', ciudadDestino: qingdao._id, precio: 570, duracionHoras: 11.5 },
    { aerolinea: 'Air China', origen: 'Barcelona', destino: 'Qingdao', ciudadDestino: qingdao._id, precio: 590, duracionHoras: 12 },
    { aerolinea: 'China Southern', origen: 'Madrid', destino: 'Changsha', ciudadDestino: changsha._id, precio: 550, duracionHoras: 13 },
    { aerolinea: 'Hainan Airlines', origen: 'Barcelona', destino: 'Changsha', ciudadDestino: changsha._id, precio: 570, duracionHoras: 13.5 },
    { aerolinea: 'Air China', origen: 'Madrid', destino: 'Tianjin', ciudadDestino: tianjin._id, precio: 530, duracionHoras: 11 },
    { aerolinea: 'China Eastern', origen: 'Barcelona', destino: 'Tianjin', ciudadDestino: tianjin._id, precio: 550, duracionHoras: 11.5 },
    { aerolinea: 'Air China', origen: 'Madrid', destino: 'Pekín (vía Chengde)', ciudadDestino: chengde._id, precio: 580, duracionHoras: 12 },
    { aerolinea: 'Hainan Airlines', origen: 'Barcelona', destino: 'Pekín (vía Chengde)', ciudadDestino: chengde._id, precio: 600, duracionHoras: 12.5 },
    { aerolinea: 'China Eastern', origen: 'Madrid', destino: 'Huangshan (Tunxi)', ciudadDestino: huangshan._id, precio: 590, duracionHoras: 13 },
    { aerolinea: 'Air China', origen: 'Barcelona', destino: 'Huangshan (Tunxi)', ciudadDestino: huangshan._id, precio: 610, duracionHoras: 13.5 },
    { aerolinea: 'Xiamen Airlines', origen: 'Madrid', destino: 'Fuzhou', ciudadDestino: fuzhou._id, precio: 540, duracionHoras: 12.5 },
    { aerolinea: 'China Southern', origen: 'Barcelona', destino: 'Fuzhou', ciudadDestino: fuzhou._id, precio: 560, duracionHoras: 13 },
    { aerolinea: 'China Eastern', origen: 'Madrid', destino: 'Luoyang (Zhengzhou)', ciudadDestino: luoyang._id, precio: 550, duracionHoras: 12 },
    { aerolinea: 'Air China', origen: 'Barcelona', destino: 'Luoyang (Zhengzhou)', ciudadDestino: luoyang._id, precio: 570, duracionHoras: 12.5 },
    { aerolinea: 'China Southern', origen: 'Madrid', destino: 'Guiyang', ciudadDestino: guiyang._id, precio: 580, duracionHoras: 14 },
    { aerolinea: 'Hainan Airlines', origen: 'Barcelona', destino: 'Guiyang', ciudadDestino: guiyang._id, precio: 600, duracionHoras: 14.5 },
  ]);
  console.log('20 nuevos vuelos creados');

  console.log('\n✓ Seed adicional completado');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Nuevas ciudades: 10');
  console.log('Nuevas actividades: 80');
  console.log('Nuevas guías: 30');
  console.log('Nuevos hoteles: 30');
  console.log('Nuevos vuelos: 20');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TOTALES: 30 ciudades, 254 actividades, 90 guías, 70 hoteles, 44 vuelos');

  process.exit(0);
};

seedMore().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
