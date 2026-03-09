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

  // ========== NEW CITIES ==========
  const cities = await City.create([
    {
      nombre: "Xi'an", nombreChino: '西安', slug: 'xian',
      descripcion: 'Antigua capital de China durante 13 dinastías y punto de inicio de la Ruta de la Seda. Famosa mundialmente por los Guerreros de Terracota, su imponente muralla medieval de 14 km y el vibrante Barrio Musulmán con la mejor comida callejera del país.',
      imagenPortada: 'https://images.unsplash.com/photo-1553808991-e39e7611442c?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Cantón (Guangzhou)', nombreChino: '广州', slug: 'guangzhou',
      descripcion: 'Capital de Guangdong y cuna del dim sum y la cocina cantonesa. Una metrópolis moderna con 2.200 años de historia, famosa por la Torre de Cantón, sus mercados de jade, su arquitectura colonial y una cultura gastronómica que influenció a todo el sudeste asiático.',
      imagenPortada: 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Changsha', nombreChino: '长沙', slug: 'changsha',
      descripcion: 'Capital de Hunan, conocida como la "Ciudad del Entretenimiento" de China. Famosa por su gastronomía extremadamente picante, la Isla Naranja con la estatua gigante de Mao Zedong, la momia de Lady Dai de 2.100 años y su vibrante escena nocturna.',
      imagenPortada: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
      destacada: true,
    },
    {
      nombre: 'Wuhan', nombreChino: '武汉', slug: 'wuhan',
      descripcion: 'Ciudad de los ríos, donde el Yangtsé y el Han se encuentran. Famosa por la Torre de la Grulla Amarilla, los fideos secos calientes (re gan mian), los cerezos en flor de la Universidad de Wuhan y el Museo Provincial de Hubei con sus campanas de bronce milenarias.',
      imagenPortada: 'https://images.unsplash.com/photo-1506158669146-619067262a00?w=800&q=80',
      destacada: true,
    },
  ]);
  console.log('Nuevas ciudades creadas');

  const [xian, guangzhou, changsha, wuhan] = cities;

  // ========== XI'AN ACTIVITIES ==========
  const xianActs = await Activity.create([
    { nombre: 'Guerreros de Terracota', descripcion: 'Ejército de más de 8.000 figuras de terracota del emperador Qin Shi Huang. Una de las mayores maravillas arqueológicas del mundo, descubierta por un campesino en 1974.', ciudad: xian._id, categoria: 'HISTORICO', duracionHoras: 4, precio: 40, consejos: ['Contrata un guía local para entender la historia', 'La fosa 1 es la más impresionante', 'No toques las figuras'] },
    { nombre: 'Muralla de Xi\'an en bicicleta', descripcion: 'Recorre en bicicleta los 14 km de la muralla medieval mejor conservada de China. Vistas panorámicas de la ciudad antigua y moderna.', ciudad: xian._id, categoria: 'AVENTURA', duracionHoras: 2.5, precio: 15, consejos: ['Alquila una bicicleta tándem si vas en pareja', 'Empieza por la puerta sur', 'Al atardecer las vistas son espectaculares'] },
    { nombre: 'Barrio Musulmán', descripcion: 'Vibrante barrio Hui con mezquitas, mercados y la mejor comida callejera de Xi\'an. Mezcla única de culturas china e islámica con más de 1.000 años de historia.', ciudad: xian._id, categoria: 'GASTRONOMIA', duracionHoras: 3, precio: 10, consejos: ['Prueba el roujiamo (hamburguesa china)', 'El yangrou paomo (sopa de cordero) es imprescindible', 'Visita la Gran Mezquita'] },
    { nombre: 'Gran Mezquita de Xi\'an', descripcion: 'Una de las mezquitas más antiguas y grandes de China, construida en el año 742. Arquitectura única que fusiona estilos chino e islámico.', ciudad: xian._id, categoria: 'HISTORICO', duracionHoras: 1.5, precio: 8, consejos: ['Es un lugar de culto activo, viste con respeto', 'El jardín interior es precioso'] },
    { nombre: 'Espectáculo de la Dinastía Tang', descripcion: 'Cena-espectáculo con danzas y música de la gloriosa Dinastía Tang. Recreación de la vida en la corte imperial con trajes históricos.', ciudad: xian._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 45, consejos: ['Incluye cena de dumplings de 18 sabores', 'Reserva con antelación'] },
    { nombre: 'Pagoda del Gran Ganso Salvaje', descripcion: 'Pagoda budista de 7 pisos construida en el año 652 para almacenar escrituras traídas de India. Patrimonio UNESCO.', ciudad: xian._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 12, consejos: ['La fuente musical de la plaza es la más grande de Asia', 'El show de la fuente es de noche'] },
    { nombre: 'Montaña Huashan', descripcion: 'Una de las cinco montañas sagradas de China. Senderos extremos tallados en acantilados verticales con vistas impresionantes. No apta para personas con vértigo.', ciudad: xian._id, categoria: 'AVENTURA', duracionHoras: 8, precio: 50, consejos: ['El camino de tablas (Plank Walk) es para valientes', 'Hay teleférico para subir', 'Lleva calzado de montaña y agua'] },
    { nombre: 'Fideos biang biang', descripcion: 'Degustación de los famosos fideos anchos de Xi\'an, hechos a mano golpeando la masa contra la mesa. El carácter biang es el más complejo del chino.', ciudad: xian._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 8, consejos: ['Pídelos con carne de cerdo y chile', 'Mira cómo los hacen a mano'] },
    { nombre: 'Tumba de Han Yang Ling', descripcion: 'Museo subterráneo con miles de figuras en miniatura de la dinastía Han. Menos turístico que los Guerreros de Terracota pero igualmente fascinante.', ciudad: xian._id, categoria: 'HISTORICO', duracionHoras: 2.5, precio: 20, consejos: ['El museo subterráneo con suelo de cristal es increíble', 'Mucho menos masificado que los Guerreros'] },
  ]);

  // ========== GUANGZHOU ACTIVITIES ==========
  const gzActs = await Activity.create([
    { nombre: 'Torre de Cantón', descripcion: 'La torre de telecomunicaciones más alta de China (600m). Mirador panorámico, pasarela al aire libre y la montaña rusa más alta del mundo en la azotea.', ciudad: guangzhou._id, categoria: 'AVENTURA', duracionHoras: 2.5, precio: 35, consejos: ['La pasarela exterior es para los más valientes', 'De noche la torre cambia de colores'] },
    { nombre: 'Dim Sum auténtico', descripcion: 'Desayuno de dim sum cantonés en un restaurante tradicional. Har gow, siu mai, char siu bao y decenas de especialidades servidas en cestas de bambú.', ciudad: guangzhou._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 20, consejos: ['Ve temprano (7-9am) como los locales', 'El restaurante Guangzhou es el más histórico', 'Acompaña con té'] },
    { nombre: 'Templo de los Seis Banyan', descripcion: 'Templo budista de más de 1.400 años con la pagoda de las Flores de 17 pisos. Uno de los templos más importantes del sur de China.', ciudad: guangzhou._id, categoria: 'HISTORICO', duracionHoras: 1.5, precio: 5, consejos: ['La pagoda se puede subir', 'El jardín es un oasis de paz en la ciudad'] },
    { nombre: 'Isla Shamian', descripcion: 'Antigua concesión colonial con arquitectura europea, calles arboladas y ambiente tranquilo. Como un trozo de Europa en el sur de China.', ciudad: guangzhou._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 0, consejos: ['Perfecto para pasear y hacer fotos', 'Hay buenos cafés y restaurantes'] },
    { nombre: 'Mercado de Qingping', descripcion: 'Uno de los mercados más fascinantes (e impactantes) de China. Hierbas medicinales, especias, animales vivos y productos exóticos.', ciudad: guangzhou._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 0, consejos: ['No es para estómagos sensibles', 'Las secciones de hierbas y especias son increíbles'] },
    { nombre: 'Crucero nocturno por el Río de las Perlas', descripcion: 'Navegación nocturna por el Río de las Perlas con vistas a los edificios iluminados de Cantón, incluyendo la Torre de Cantón en colores.', ciudad: guangzhou._id, categoria: 'NOCTURNO', duracionHoras: 1.5, precio: 18, consejos: ['Reserva cubierta superior', 'Las mejores vistas son desde el puente Haiyin'] },
    { nombre: 'Museo del Mausoleo del Rey Nanyue', descripcion: 'Tumba real de más de 2.100 años descubierta en 1983. Tesoros de jade, oro y bronce del antiguo reino que gobernó el sur de China.', ciudad: guangzhou._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 12, consejos: ['El traje de jade del rey es la pieza estrella', 'Museo muy bien organizado'] },
    { nombre: 'Cantonese BBQ - Char Siu', descripcion: 'Degustación de las carnes asadas cantonesas: char siu (cerdo BBQ), pato asado y ganso asado en un restaurante premiado.', ciudad: guangzhou._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 22, consejos: ['El cerdo char siu es imprescindible', 'Ve a la hora del almuerzo'] },
    { nombre: 'Jardín de la Familia Chen', descripcion: 'Espectacular complejo de templos ancestrales con la mejor colección de esculturas decorativas del sur de China. Tallas de piedra, madera, ladrillo y cerámica.', ciudad: guangzhou._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 10, consejos: ['Las esculturas en el tejado son increíbles', 'Uno de los edificios más fotogénicos de Cantón'] },
  ]);

  // ========== CHANGSHA ACTIVITIES ==========
  const csActs = await Activity.create([
    { nombre: 'Isla Naranja (Juzizhou)', descripcion: 'Isla en medio del río Xiang con la estatua gigante del joven Mao Zedong de 32 metros. Parque con vistas al skyline de Changsha.', ciudad: changsha._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 0, consejos: ['La estatua de Mao joven es impresionante', 'Ideal para pasear al atardecer'] },
    { nombre: 'Museo Provincial de Hunan', descripcion: 'Uno de los mejores museos de China. Alberga la momia de Lady Dai (Xin Zhui), conservada perfectamente después de 2.100 años. Entrada gratuita.', ciudad: changsha._id, categoria: 'HISTORICO', duracionHoras: 3, precio: 0, consejos: ['La momia de Lady Dai es el plato fuerte', 'Reserva entrada online, hay cupo diario', 'Los lacados Han son excepcionales'] },
    { nombre: 'Stinky Tofu de Changsha', descripcion: 'El tofu apestoso más famoso de China. Frito por fuera, suave por dentro, servido con salsa picante. Un desafío gastronómico que merece la pena.', ciudad: changsha._id, categoria: 'GASTRONOMIA', duracionHoras: 1, precio: 5, consejos: ['Huele horrible pero sabe increíble', 'Pruébalo en el mercado de Taiping', 'Es el snack callejero más famoso de Hunan'] },
    { nombre: 'Calle Taiping', descripcion: 'Calle histórica renovada con tiendas, puestos de comida callejera y ambiente festivo. El corazón de la vida nocturna y gastronómica de Changsha.', ciudad: changsha._id, categoria: 'NOCTURNO', duracionHoras: 2.5, precio: 0, consejos: ['Ve de noche cuando cobra vida', 'La comida callejera es increíble', 'Prueba el té con leche de Cha Yan Yue Se'] },
    { nombre: 'Monte Yuelu y Academia Yuelu', descripcion: 'Montaña sagrada con la academia confuciana más antigua de China (fundada en 976 d.C.). Senderos entre bosques de arces espectaculares en otoño.', ciudad: changsha._id, categoria: 'NATURALEZA', duracionHoras: 4, precio: 0, consejos: ['En otoño los arces rojos son espectaculares', 'La academia Yuelu tiene más de 1.000 años', 'El templo Lushan está en la cima'] },
    { nombre: 'Cocina Hunan picante', descripcion: 'Cena de cocina hunanesa auténtica: pollo del General Tso, cerdo rojo estofado al estilo Mao y pescado con cabeza de chile. Más picante que la cocina de Sichuan.', ciudad: changsha._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 18, consejos: ['El cerdo rojo estofado era el plato favorito de Mao', 'Pide "wei la" si no aguantas el picante', 'La cocina hunanesa usa chile seco, no pimienta'] },
    { nombre: 'Ventana del Mundo de Changsha', descripcion: 'Parque temático con réplicas a escala de monumentos mundiales: Torre Eiffel, Pirámides, Coliseo. Popular entre familias y para fotos divertidas.', ciudad: changsha._id, categoria: 'AVENTURA', duracionHoras: 4, precio: 25, consejos: ['Es kitch pero divertido', 'Ideal si viajas con niños'] },
    { nombre: 'Té con leche Cha Yan Yue Se', descripcion: 'Visita a la cadena de té con leche más famosa de China que solo existe en Changsha. Colas de más de 1 hora en las sucursales más populares.', ciudad: changsha._id, categoria: 'GASTRONOMIA', duracionHoras: 1, precio: 3, consejos: ['El sabor "Voz de la Felicidad" es el más popular', 'Solo existe en Changsha, no lo encontrarás en otra ciudad'] },
    { nombre: 'Río Xiang de noche', descripcion: 'Paseo nocturno por la ribera del río Xiang con vistas al skyline iluminado de Changsha y los fuegos artificiales del fin de semana.', ciudad: changsha._id, categoria: 'NOCTURNO', duracionHoras: 2, precio: 0, consejos: ['Los sábados hay espectáculo de fuegos artificiales', 'El puente Du Fu es bonito iluminado'] },
  ]);

  // ========== WUHAN ACTIVITIES ==========
  const whActs = await Activity.create([
    { nombre: 'Torre de la Grulla Amarilla', descripcion: 'La torre más famosa del sur de China, inmortalizada en poesía clásica china. 5 pisos con vistas panorámicas al río Yangtsé y la ciudad.', ciudad: wuhan._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 15, consejos: ['Sube todos los pisos para las mejores vistas', 'La torre original se quemó y reconstruyó múltiples veces'] },
    { nombre: 'Re Gan Mian (fideos secos calientes)', descripcion: 'El desayuno emblemático de Wuhan: fideos con pasta de sésamo, encurtidos y aceite de chile. Cada wuhanés come esto cada mañana.', ciudad: wuhan._id, categoria: 'GASTRONOMIA', duracionHoras: 1, precio: 3, consejos: ['Cómelo en un puesto callejero a las 7am como los locales', 'Mezcla bien la pasta de sésamo', 'Es el desayuno más famoso de China'] },
    { nombre: 'Museo Provincial de Hubei', descripcion: 'Museo que alberga las campanas de bronce de Zeng Hou Yi (433 a.C.), un instrumento musical de 2.400 años con 65 campanas que aún suenan. Patrimonio nacional.', ciudad: wuhan._id, categoria: 'HISTORICO', duracionHoras: 3, precio: 0, consejos: ['El concierto de campanas antiguas es a las 10:30 y 14:30', 'La espada de Goujian de 2.500 años sigue afilada'] },
    { nombre: 'Lago del Este', descripcion: 'El lago urbano más grande de China, 6 veces más grande que el Lago del Oeste de Hangzhou. Senderos, jardines y templos junto al agua.', ciudad: wuhan._id, categoria: 'NATURALEZA', duracionHoras: 3, precio: 0, consejos: ['Alquila una bicicleta para recorrerlo', 'El jardín de ciruelos es espectacular en febrero'] },
    { nombre: 'Cerezos en flor de la Universidad de Wuhan', descripcion: 'Cada marzo, los cerezos de la Universidad de Wuhan florecen creando un espectáculo rosa que atrae a millones de visitantes. La universidad más bonita de China.', ciudad: wuhan._id, categoria: 'NATURALEZA', duracionHoras: 2.5, precio: 0, consejos: ['Solo en marzo', 'Reserva entrada online', 'El campus es de estilo republicano, precioso'] },
    { nombre: 'Calle Han', descripcion: 'Calle comercial peatonal de 1,6 km con 100 años de historia. Arquitectura republicana, tiendas, restaurantes y el espíritu comerciante de Wuhan.', ciudad: wuhan._id, categoria: 'COMPRAS', duracionHoras: 2, precio: 0, consejos: ['El edificio del viejo banco HSBC es precioso', 'Hay buenos restaurantes de comida local'] },
    { nombre: 'Crucero por el Yangtsé en Wuhan', descripcion: 'Cruce del río Yangtsé en ferry con vistas a los dos puentes históricos y los skylines de las tres ciudades que forman Wuhan.', ciudad: wuhan._id, categoria: 'AVENTURA', duracionHoras: 1.5, precio: 8, consejos: ['El ferry de Zhonghua Lu es el más histórico', 'Solo cuesta unos pocos yuanes'] },
    { nombre: 'Templo Guiyuan', descripcion: 'Templo budista de más de 350 años con 500 estatuas de arhats (discípulos de Buda), cada una con una expresión facial única.', ciudad: wuhan._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 10, consejos: ['Busca tu arhat de la suerte por tu año de nacimiento', 'El jardín es muy tranquilo'] },
    { nombre: 'Comida callejera de Hubu Xiang', descripcion: 'El callejón de comida callejera más famoso de Wuhan. Docenas de puestos con especialidades locales: doupi, mianwo, tang bao y más.', ciudad: wuhan._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 10, consejos: ['Prueba el doupi (tortilla de arroz rellena)', 'Llega con hambre, hay demasiado donde elegir', 'Es mejor por la mañana'] },
  ]);

  console.log('Actividades creadas para 4 ciudades nuevas');

  // ========== GUIDES ==========
  const guides = [];

  // --- XI'AN: 3 guías ---
  guides.push({
    titulo: "Xi'an Histórica - Ruta de la Seda",
    descripcion: 'Viaje de 3 días al pasado imperial de China: los Guerreros de Terracota, la muralla medieval en bicicleta, el Barrio Musulmán y la gastronomía de la Ruta de la Seda. Un viaje en el tiempo de 3.000 años.',
    ciudad: xian._id,
    duracionDias: 3,
    precio: 289,
    imagen: 'https://images.unsplash.com/photo-1553808991-e39e7611442c?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Los Guerreros del Emperador', actividades: [
        { actividad: xianActs[0]._id, orden: 1, horaInicio: '08:30', horaFin: '12:30' },
        { actividad: xianActs[8]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: xianActs[4]._id, orden: 3, horaInicio: '19:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'La Muralla y el Barrio Musulmán', actividades: [
        { actividad: xianActs[1]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: xianActs[2]._id, orden: 2, horaInicio: '12:00', horaFin: '15:00' },
        { actividad: xianActs[3]._id, orden: 3, horaInicio: '15:30', horaFin: '17:00' },
        { actividad: xianActs[7]._id, orden: 4, horaInicio: '18:00', horaFin: '19:30' },
      ]},
      { numeroDia: 3, titulo: 'Pagodas y Despedida', actividades: [
        { actividad: xianActs[5]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
      ]},
    ],
  });

  guides.push({
    titulo: "Xi'an Express - 2 Días",
    descripcion: 'Los imprescindibles de Xi\'an en un fin de semana: Guerreros de Terracota por la mañana, muralla en bicicleta por la tarde y cena en el Barrio Musulmán.',
    ciudad: xian._id,
    duracionDias: 2,
    precio: 199,
    imagen: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Guerreros y Muralla', actividades: [
        { actividad: xianActs[0]._id, orden: 1, horaInicio: '08:30', horaFin: '12:30' },
        { actividad: xianActs[1]._id, orden: 2, horaInicio: '15:00', horaFin: '17:30' },
        { actividad: xianActs[2]._id, orden: 3, horaInicio: '18:30', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Cultura y Gastronomía', actividades: [
        { actividad: xianActs[5]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: xianActs[3]._id, orden: 2, horaInicio: '11:30', horaFin: '13:00' },
        { actividad: xianActs[7]._id, orden: 3, horaInicio: '13:30', horaFin: '15:00' },
      ]},
    ],
  });

  guides.push({
    titulo: "Xi'an y Montaña Huashan - 4 Días",
    descripcion: 'Circuito completo: Guerreros de Terracota, muralla, Barrio Musulmán y la aventura extrema del Monte Huashan, una de las montañas más peligrosas y bellas del mundo.',
    ciudad: xian._id,
    duracionDias: 4,
    precio: 399,
    imagen: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada e Historia', actividades: [
        { actividad: xianActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '13:00' },
        { actividad: xianActs[8]._id, orden: 2, horaInicio: '14:30', horaFin: '17:00' },
        { actividad: xianActs[4]._id, orden: 3, horaInicio: '19:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Muralla y Ciudad', actividades: [
        { actividad: xianActs[1]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: xianActs[5]._id, orden: 2, horaInicio: '13:00', horaFin: '15:00' },
        { actividad: xianActs[2]._id, orden: 3, horaInicio: '16:00', horaFin: '19:00' },
      ]},
      { numeroDia: 3, titulo: 'Montaña Huashan', actividades: [
        { actividad: xianActs[6]._id, orden: 1, horaInicio: '07:00', horaFin: '15:00' },
      ]},
      { numeroDia: 4, titulo: 'Último Día', actividades: [
        { actividad: xianActs[3]._id, orden: 1, horaInicio: '09:00', horaFin: '10:30' },
        { actividad: xianActs[7]._id, orden: 2, horaInicio: '11:00', horaFin: '12:30' },
      ]},
    ],
  });

  // --- GUANGZHOU: 3 guías ---
  guides.push({
    titulo: 'Cantón Gastronómico - 3 Días',
    descripcion: 'Un viaje de 3 días dedicado a la mejor gastronomía de China. Dim sum al amanecer, char siu al mediodía y crucero nocturno por el Río de las Perlas. La cuna de la cocina cantonesa.',
    ciudad: guangzhou._id,
    duracionDias: 3,
    precio: 259,
    imagen: 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Dim Sum y Templos', actividades: [
        { actividad: gzActs[1]._id, orden: 1, horaInicio: '07:30', horaFin: '09:30' },
        { actividad: gzActs[2]._id, orden: 2, horaInicio: '10:30', horaFin: '12:00' },
        { actividad: gzActs[8]._id, orden: 3, horaInicio: '14:00', horaFin: '16:00' },
        { actividad: gzActs[5]._id, orden: 4, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Historia y Sabores', actividades: [
        { actividad: gzActs[6]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: gzActs[3]._id, orden: 2, horaInicio: '11:30', horaFin: '13:30' },
        { actividad: gzActs[7]._id, orden: 3, horaInicio: '14:00', horaFin: '15:30' },
        { actividad: gzActs[0]._id, orden: 4, horaInicio: '17:00', horaFin: '19:30' },
      ]},
      { numeroDia: 3, titulo: 'Mercados y Despedida', actividades: [
        { actividad: gzActs[4]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: gzActs[1]._id, orden: 2, horaInicio: '12:00', horaFin: '14:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Cantón Express - 2 Días',
    descripcion: 'Lo esencial de Guangzhou en un fin de semana: dim sum, la Torre de Cantón, Isla Shamian y crucero nocturno por el Río de las Perlas.',
    ciudad: guangzhou._id,
    duracionDias: 2,
    precio: 179,
    imagen: 'https://images.unsplash.com/photo-1506158669146-619067262a00?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Dim Sum y Torre', actividades: [
        { actividad: gzActs[1]._id, orden: 1, horaInicio: '07:30', horaFin: '09:30' },
        { actividad: gzActs[3]._id, orden: 2, horaInicio: '10:30', horaFin: '12:30' },
        { actividad: gzActs[0]._id, orden: 3, horaInicio: '15:00', horaFin: '17:30' },
        { actividad: gzActs[5]._id, orden: 4, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Historia y Gastronomía', actividades: [
        { actividad: gzActs[8]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: gzActs[7]._id, orden: 2, horaInicio: '12:00', horaFin: '13:30' },
        { actividad: gzActs[4]._id, orden: 3, horaInicio: '14:30', horaFin: '16:30' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Cantón Completo - 4 Días',
    descripcion: 'Circuito completo por Guangzhou: dim sum, templos ancestrales, isla colonial, mercados exóticos, torre panorámica, gastronomía cantonesa y crucero nocturno.',
    ciudad: guangzhou._id,
    duracionDias: 4,
    precio: 349,
    imagen: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada y Río de las Perlas', actividades: [
        { actividad: gzActs[3]._id, orden: 1, horaInicio: '15:00', horaFin: '17:00' },
        { actividad: gzActs[5]._id, orden: 2, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Gastronomía y Cultura', actividades: [
        { actividad: gzActs[1]._id, orden: 1, horaInicio: '07:30', horaFin: '09:30' },
        { actividad: gzActs[2]._id, orden: 2, horaInicio: '10:30', horaFin: '12:00' },
        { actividad: gzActs[8]._id, orden: 3, horaInicio: '14:00', horaFin: '16:00' },
        { actividad: gzActs[7]._id, orden: 4, horaInicio: '18:00', horaFin: '19:30' },
      ]},
      { numeroDia: 3, titulo: 'Historia Antigua', actividades: [
        { actividad: gzActs[6]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: gzActs[4]._id, orden: 2, horaInicio: '11:30', horaFin: '13:30' },
        { actividad: gzActs[0]._id, orden: 3, horaInicio: '16:00', horaFin: '18:30' },
      ]},
      { numeroDia: 4, titulo: 'Despedida Cantonesa', actividades: [
        { actividad: gzActs[1]._id, orden: 1, horaInicio: '08:00', horaFin: '10:00' },
      ]},
    ],
  });

  // --- CHANGSHA: 3 guías ---
  guides.push({
    titulo: 'Changsha - Sabor de Hunan',
    descripcion: '3 días en la capital de Hunan: tofu apestoso, té con leche que solo existe aquí, la estatua de Mao joven, una momia de 2.100 años y la comida más picante de China.',
    ciudad: changsha._id,
    duracionDias: 3,
    precio: 239,
    imagen: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada Picante', actividades: [
        { actividad: csActs[0]._id, orden: 1, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: csActs[2]._id, orden: 2, horaInicio: '17:00', horaFin: '18:00' },
        { actividad: csActs[5]._id, orden: 3, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 2, titulo: 'Historia y Naturaleza', actividades: [
        { actividad: csActs[1]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: csActs[4]._id, orden: 2, horaInicio: '13:30', horaFin: '17:30' },
        { actividad: csActs[7]._id, orden: 3, horaInicio: '18:00', horaFin: '19:00' },
        { actividad: csActs[3]._id, orden: 4, horaInicio: '20:00', horaFin: '22:30' },
      ]},
      { numeroDia: 3, titulo: 'Última Aventura', actividades: [
        { actividad: csActs[6]._id, orden: 1, horaInicio: '09:00', horaFin: '13:00' },
        { actividad: csActs[8]._id, orden: 2, horaInicio: '19:00', horaFin: '21:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Changsha Express - 2 Días',
    descripcion: 'Lo esencial de Changsha en un fin de semana: Isla Naranja, la momia de Lady Dai, tofu apestoso y el té con leche más famoso de China.',
    ciudad: changsha._id,
    duracionDias: 2,
    precio: 159,
    imagen: 'https://images.unsplash.com/photo-1506158669146-619067262a00?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Historia y Gastronomía', actividades: [
        { actividad: csActs[1]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: csActs[0]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: csActs[2]._id, orden: 3, horaInicio: '17:00', horaFin: '18:00' },
        { actividad: csActs[3]._id, orden: 4, horaInicio: '20:00', horaFin: '22:30' },
      ]},
      { numeroDia: 2, titulo: 'Montaña y Té', actividades: [
        { actividad: csActs[4]._id, orden: 1, horaInicio: '09:00', horaFin: '13:00' },
        { actividad: csActs[7]._id, orden: 2, horaInicio: '14:00', horaFin: '15:00' },
        { actividad: csActs[5]._id, orden: 3, horaInicio: '18:00', horaFin: '20:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Changsha y Zhangjiajie - 5 Días',
    descripcion: 'Changsha a fondo más excursión a las montañas que inspiraron Avatar. Historia, gastronomía picante, naturaleza y diversión en 5 días completos.',
    ciudad: changsha._id,
    duracionDias: 5,
    precio: 429,
    imagen: 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada a Changsha', actividades: [
        { actividad: csActs[0]._id, orden: 1, horaInicio: '15:00', horaFin: '17:30' },
        { actividad: csActs[5]._id, orden: 2, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 2, titulo: 'Museo y Cultura', actividades: [
        { actividad: csActs[1]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: csActs[4]._id, orden: 2, horaInicio: '13:30', horaFin: '17:30' },
        { actividad: csActs[3]._id, orden: 3, horaInicio: '20:00', horaFin: '22:30' },
      ]},
      { numeroDia: 3, titulo: 'Diversión y Sabores', actividades: [
        { actividad: csActs[6]._id, orden: 1, horaInicio: '09:00', horaFin: '13:00' },
        { actividad: csActs[2]._id, orden: 2, horaInicio: '14:00', horaFin: '15:00' },
        { actividad: csActs[7]._id, orden: 3, horaInicio: '15:30', horaFin: '16:30' },
      ]},
      { numeroDia: 4, titulo: 'Excursión Natural', actividades: [
        { actividad: csActs[4]._id, orden: 1, horaInicio: '08:00', horaFin: '12:00' },
        { actividad: csActs[8]._id, orden: 2, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 5, titulo: 'Despedida Picante', actividades: [
        { actividad: csActs[7]._id, orden: 1, horaInicio: '09:00', horaFin: '10:00' },
        { actividad: csActs[2]._id, orden: 2, horaInicio: '11:00', horaFin: '12:00' },
      ]},
    ],
  });

  // --- WUHAN: 3 guías ---
  guides.push({
    titulo: 'Wuhan - Ciudad de los Ríos',
    descripcion: '3 días en la ciudad donde el Yangtsé y el Han se encuentran: la Torre de la Grulla Amarilla, campanas de bronce milenarias, fideos secos calientes y cerezos en flor.',
    ciudad: wuhan._id,
    duracionDias: 3,
    precio: 249,
    imagen: 'https://images.unsplash.com/photo-1506158669146-619067262a00?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'La Grulla Amarilla', actividades: [
        { actividad: whActs[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: whActs[5]._id, orden: 2, horaInicio: '12:00', horaFin: '14:00' },
        { actividad: whActs[7]._id, orden: 3, horaInicio: '15:00', horaFin: '17:00' },
        { actividad: whActs[8]._id, orden: 4, horaInicio: '18:00', horaFin: '20:00' },
      ]},
      { numeroDia: 2, titulo: 'Historia Milenaria', actividades: [
        { actividad: whActs[1]._id, orden: 1, horaInicio: '07:00', horaFin: '08:00' },
        { actividad: whActs[2]._id, orden: 2, horaInicio: '09:30', horaFin: '12:30' },
        { actividad: whActs[3]._id, orden: 3, horaInicio: '14:00', horaFin: '17:00' },
        { actividad: whActs[6]._id, orden: 4, horaInicio: '18:00', horaFin: '19:30' },
      ]},
      { numeroDia: 3, titulo: 'Naturaleza y Despedida', actividades: [
        { actividad: whActs[4]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: whActs[1]._id, orden: 2, horaInicio: '12:00', horaFin: '13:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Wuhan Express - 2 Días',
    descripcion: 'Lo imprescindible de Wuhan: la torre más poética de China, fideos con sésamo al amanecer, campanas de bronce de 2.400 años y ferry por el Yangtsé.',
    ciudad: wuhan._id,
    duracionDias: 2,
    precio: 169,
    imagen: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Torre y Río', actividades: [
        { actividad: whActs[1]._id, orden: 1, horaInicio: '07:00', horaFin: '08:00' },
        { actividad: whActs[0]._id, orden: 2, horaInicio: '09:30', horaFin: '11:30' },
        { actividad: whActs[6]._id, orden: 3, horaInicio: '14:00', horaFin: '15:30' },
        { actividad: whActs[8]._id, orden: 4, horaInicio: '17:00', horaFin: '19:00' },
      ]},
      { numeroDia: 2, titulo: 'Museo y Lago', actividades: [
        { actividad: whActs[2]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: whActs[3]._id, orden: 2, horaInicio: '13:30', horaFin: '16:30' },
        { actividad: whActs[5]._id, orden: 3, horaInicio: '17:00', horaFin: '19:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Wuhan Completo - 4 Días',
    descripcion: 'Wuhan a fondo: historia, naturaleza, gastronomía y vida local. Incluye las campanas milenarias, la Torre de la Grulla Amarilla, cerezos en flor, Lago del Este y la mejor comida callejera de China central.',
    ciudad: wuhan._id,
    duracionDias: 4,
    precio: 339,
    imagen: 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada y Exploración', actividades: [
        { actividad: whActs[1]._id, orden: 1, horaInicio: '07:00', horaFin: '08:00' },
        { actividad: whActs[0]._id, orden: 2, horaInicio: '09:30', horaFin: '11:30' },
        { actividad: whActs[5]._id, orden: 3, horaInicio: '14:00', horaFin: '16:00' },
        { actividad: whActs[8]._id, orden: 4, horaInicio: '18:00', horaFin: '20:00' },
      ]},
      { numeroDia: 2, titulo: 'Historia y Cultura', actividades: [
        { actividad: whActs[2]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: whActs[7]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
        { actividad: whActs[6]._id, orden: 3, horaInicio: '17:00', horaFin: '18:30' },
      ]},
      { numeroDia: 3, titulo: 'Naturaleza', actividades: [
        { actividad: whActs[3]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: whActs[4]._id, orden: 2, horaInicio: '14:00', horaFin: '16:30' },
      ]},
      { numeroDia: 4, titulo: 'Despedida', actividades: [
        { actividad: whActs[1]._id, orden: 1, horaInicio: '07:00', horaFin: '08:00' },
        { actividad: whActs[8]._id, orden: 2, horaInicio: '09:00', horaFin: '11:00' },
      ]},
    ],
  });

  await Guide.create(guides);
  console.log('12 nuevas guías creadas');

  // ========== NEW HOTELS ==========
  await Hotel.create([
    { nombre: "Xi'an Ancient Wall Hotel", ciudad: xian._id, estrellas: 4, precioPorNoche: 65, descripcion: 'Junto a la muralla medieval con decoración de la dinastía Tang.' },
    { nombre: 'Terracotta Warriors Hotel', ciudad: xian._id, estrellas: 3, precioPorNoche: 45, descripcion: 'Hotel temático cerca de los Guerreros de Terracota.' },
    { nombre: 'White Swan Hotel Guangzhou', ciudad: guangzhou._id, estrellas: 5, precioPorNoche: 130, descripcion: 'Hotel icónico en la Isla Shamian con vistas al Río de las Perlas.' },
    { nombre: 'Canton Garden Hotel', ciudad: guangzhou._id, estrellas: 4, precioPorNoche: 70, descripcion: 'Hotel con jardín cantonés en el centro histórico.' },
    { nombre: 'Changsha Riverside Hotel', ciudad: changsha._id, estrellas: 4, precioPorNoche: 55, descripcion: 'Hotel moderno con vistas al río Xiang y la Isla Naranja.' },
    { nombre: 'Hunan Grand Hotel', ciudad: changsha._id, estrellas: 5, precioPorNoche: 95, descripcion: 'El hotel más lujoso de Changsha con restaurante de cocina hunanesa.' },
    { nombre: 'Yellow Crane Tower Hotel', ciudad: wuhan._id, estrellas: 4, precioPorNoche: 60, descripcion: 'Hotel junto a la Torre de la Grulla Amarilla con vistas al Yangtsé.' },
    { nombre: 'Wuhan Yangtze Hotel', ciudad: wuhan._id, estrellas: 3, precioPorNoche: 40, descripcion: 'Hotel económico en el centro, ideal para explorar a pie.' },
  ]);
  console.log('Hoteles creados');

  // ========== NEW FLIGHTS ==========
  await Flight.create([
    { aerolinea: 'Air China', origen: 'Madrid', destino: "Xi'an", ciudadDestino: xian._id, precio: 560, duracionHoras: 12 },
    { aerolinea: 'China Southern', origen: 'Madrid', destino: 'Cantón', ciudadDestino: guangzhou._id, precio: 510, duracionHoras: 12.5 },
    { aerolinea: 'China Southern', origen: 'Barcelona', destino: 'Cantón', ciudadDestino: guangzhou._id, precio: 530, duracionHoras: 12 },
    { aerolinea: 'China Eastern', origen: 'Madrid', destino: 'Changsha (escala Shanghái)', ciudadDestino: changsha._id, precio: 590, duracionHoras: 14 },
    { aerolinea: 'Air China', origen: 'Madrid', destino: 'Wuhan', ciudadDestino: wuhan._id, precio: 570, duracionHoras: 13 },
  ]);
  console.log('Vuelos creados');

  // ========== NEW CULTURE ARTICLES ==========
  await CultureArticle.create([
    {
      titulo: 'Los Guerreros de Terracota: El ejército inmortal',
      resumen: 'La historia del mayor descubrimiento arqueológico del siglo XX y cómo visitarlo.',
      contenido: '<p>En 1974, un campesino que cavaba un pozo descubrió lo que se convertiría en el hallazgo arqueológico más importante del siglo XX: el ejército de terracota del primer emperador de China, Qin Shi Huang.</p><p>Más de 8.000 soldados, 130 carros y 670 caballos de tamaño real, cada uno con rasgos faciales únicos, fueron enterrados para proteger al emperador en el más allá. Después de más de 2.200 años, siguen en formación de batalla.</p>',
      categoria: 'HISTORIA',
      ciudad: xian._id,
    },
    {
      titulo: 'Dim Sum: El arte del desayuno cantonés',
      resumen: 'Descubre la tradición del dim sum, los diferentes tipos de dumplings y cómo disfrutar de un auténtico yum cha.',
      contenido: '<p>El dim sum (点心) es una experiencia social originaria de Cantón. Consiste en pequeños platos servidos en cestitas de bambú al vapor: har gow (dumplings de gambas), siu mai (dumplings de cerdo), char siu bao (bollitos de cerdo barbacoa).</p><p>Todo acompañado de té, en una ceremonia conocida como yum cha. Para los españoles, es comparable a ir de tapas.</p>',
      categoria: 'GASTRONOMIA',
      ciudad: guangzhou._id,
    },
    {
      titulo: 'Changsha: La ciudad del entretenimiento de China',
      resumen: 'Por qué Changsha se ha convertido en la capital de la cultura pop y la gastronomía de China.',
      contenido: '<p>Changsha es la sede de Hunan TV, una de las cadenas más populares de China, y su cultura del entretenimiento ha convertido a la ciudad en un destino favorito de los jóvenes chinos.</p><p>Pero la verdadera estrella es la gastronomía: el tofu apestoso frito, la cocina hunanesa picante y sobre todo Cha Yan Yue Se, la cadena de té con leche que solo existe en Changsha y que genera colas de más de una hora.</p>',
      categoria: 'GASTRONOMIA',
      ciudad: changsha._id,
    },
    {
      titulo: 'La Torre de la Grulla Amarilla: Poesía hecha arquitectura',
      resumen: 'La historia de la torre más poética de China y el poema que la hizo inmortal.',
      contenido: '<p>La Torre de la Grulla Amarilla (黄鹤楼) en Wuhan ha sido inmortalizada por el poeta Cui Hao en el siglo VIII: "Hace tiempo, el hombre montado en la grulla amarilla se fue y nunca volvió. Solo queda la torre vacía bajo las nubes."</p><p>Destruida y reconstruida múltiples veces a lo largo de 1.700 años, la torre actual data de 1985 y ofrece vistas panorámicas del río Yangtsé.</p>',
      categoria: 'HISTORIA',
      ciudad: wuhan._id,
    },
  ]);
  console.log('Artículos de cultura creados');

  console.log('\n✓ Seed de nuevas ciudades completado');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log("Ciudades añadidas: Xi'an, Cantón, Changsha, Wuhan");
  console.log('Guías añadidas: 12 (3 por ciudad)');
  console.log('Actividades añadidas: 36');
  console.log('Hoteles añadidos: 8');
  console.log('Vuelos añadidos: 5');
  console.log('Artículos añadidos: 4');

  process.exit(0);
};

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
