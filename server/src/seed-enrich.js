import mongoose from 'mongoose';
import connectDB from './config/db.js';
import City from './models/City.js';
import Activity from './models/Activity.js';
import Guide from './models/Guide.js';

const seed = async () => {
  await connectDB();

  // Get all existing cities
  const allCities = await City.find({});
  const cityMap = {};
  allCities.forEach((c) => { cityMap[c.slug] = c; });

  console.log(`Encontradas ${allCities.length} ciudades existentes`);

  // ==================== NEW ACTIVITIES ====================

  // --- PEKÍN: new activities ---
  const pekinNew = await Activity.create([
    { nombre: 'Hutones en rickshaw', descripcion: 'Recorrido en triciclo por los callejones históricos (hutones) de Pekín. Visita patios tradicionales, descubre la vida cotidiana de los pekineses y conoce la arquitectura de las antiguas casas siheyuan.', ciudad: cityMap.pekin._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 20, consejos: ['Los hutones de Nanluoguxiang son los más famosos', 'Pide parar en un patio siheyuan'] },
    { nombre: 'Ópera de Pekín', descripcion: 'Espectáculo de ópera tradicional pekinesa con acrobacias, canto, danza y maquillaje colorido. Una forma artística con más de 200 años de historia.', ciudad: cityMap.pekin._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 30, consejos: ['El teatro Liyuan es el más accesible para extranjeros', 'Los subtítulos en inglés ayudan a seguir la trama'] },
    { nombre: 'Pato laqueado pekinés', descripcion: 'Cena del plato más icónico de China: pato asado con piel crujiente, panqueques, cebolleta y salsa hoisin. Una experiencia gastronómica imperial.', ciudad: cityMap.pekin._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 35, consejos: ['Quanjude y Da Dong son los más famosos', 'Reserva con antelación'] },
    { nombre: 'Parque Beihai', descripcion: 'Jardín imperial de 1.000 años junto a la Ciudad Prohibida. Lago con botes de pedal, la Pagoda Blanca tibetana y uno de los muros de los Nueve Dragones.', ciudad: cityMap.pekin._id, categoria: 'NATURALEZA', duracionHoras: 2, precio: 5, consejos: ['Alquila un bote en verano', 'El muro de los Nueve Dragones es una joya'] },
    { nombre: 'Mercado nocturno de Wangfujing', descripcion: 'La calle comercial más famosa de Pekín con puestos de comida exótica: escorpiones, estrellas de mar, gusanos de seda y frutas caramelizadas.', ciudad: cityMap.pekin._id, categoria: 'NOCTURNO', duracionHoras: 2, precio: 10, consejos: ['Los escorpiones fritos son solo para turistas valientes', 'Las brochetas de cordero son deliciosas'] },
    { nombre: '798 Art District', descripcion: 'Complejo de arte contemporáneo en una antigua fábrica militar. Galerías, instalaciones, cafés y la escena artística más vanguardista de China.', ciudad: cityMap.pekin._id, categoria: 'CULTURAL', duracionHoras: 3, precio: 0, consejos: ['Muchas galerías son gratuitas', 'Los fines de semana hay más actividad'] },
  ]);

  // --- SHANGHÁI: new activities ---
  const shanghaiNew = await Activity.create([
    { nombre: 'Barrio francés en bicicleta', descripcion: 'Recorrido en bicicleta por la antigua concesión francesa: calles arboladas con plátanos, cafés, galerías de arte y la arquitectura colonial más encantadora de Shanghái.', ciudad: cityMap.shanghai._id, categoria: 'AVENTURA', duracionHoras: 2.5, precio: 15, consejos: ['Las calles Wukang y Anfu son las más bonitas', 'Para en un café de especialidad'] },
    { nombre: 'Xiaolongbao en Din Tai Fung', descripcion: 'Degustación de los xiaolongbao (dumplings de sopa) más famosos del mundo. Aprende a comerlos correctamente: morder, sorber el caldo y disfrutar.', ciudad: cityMap.shanghai._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 20, consejos: ['Muerde un poquito, sorbe el caldo, luego come', 'Prueba los de cangrejo'] },
    { nombre: 'Torre de Shanghái', descripcion: 'Sube al segundo edificio más alto del mundo (632m). El mirador a 561m ofrece vistas de 360° sobre la megalópolis y, en días claros, hasta el mar.', ciudad: cityMap.shanghai._id, categoria: 'AVENTURA', duracionHoras: 1.5, precio: 28, consejos: ['El ascensor más rápido del mundo: 55 segundos', 'Ve al atardecer para las mejores fotos'] },
    { nombre: 'Tianzifang', descripcion: 'Laberinto de callejones con talleres de artistas, boutiques de diseñadores, bares escondidos y la mejor vida bohemia de Shanghái.', ciudad: cityMap.shanghai._id, categoria: 'COMPRAS', duracionHoras: 2, precio: 0, consejos: ['Es fácil perderse, disfruta del laberinto', 'Los estudios de artistas en los pisos superiores son geniales'] },
    { nombre: 'Acróbatas de Shanghái', descripcion: 'Espectáculo de acrobacias circenses tradicionales chinas: contorsión, malabarismo, equilibrio y números imposibles con más de 2.000 años de tradición.', ciudad: cityMap.shanghai._id, categoria: 'NOCTURNO', duracionHoras: 1.5, precio: 25, consejos: ['El ERA Acrobatic Show es el mejor', 'Reserva asientos centrales'] },
    { nombre: 'Crucero nocturno por el Huangpu', descripcion: 'Navegación por el río Huangpu entre el Bund colonial y el skyline futurista de Pudong. La vista más icónica de Shanghái iluminada.', ciudad: cityMap.shanghai._id, categoria: 'NOCTURNO', duracionHoras: 1.5, precio: 18, consejos: ['A partir de las 20:00 las luces están encendidas', 'La cubierta superior es la mejor'] },
  ]);

  // --- CHENGDU: new activities ---
  const chengduNew = await Activity.create([
    { nombre: 'Cambio de cara del Sichuan', descripcion: 'Espectáculo de bian lian: los artistas cambian de máscara en milésimas de segundo con un truco que sigue siendo secreto de estado. Arte escénico único del Sichuan.', ciudad: cityMap.chengdu._id, categoria: 'CULTURAL', duracionHoras: 1.5, precio: 25, consejos: ['El truco del cambio de cara no se ha revelado nunca', 'Intenta sentarte en primera fila'] },
    { nombre: 'Callejón ancho y estrecho', descripcion: 'Tres callejones históricos de la dinastía Qing transformados en zona de ocio: casas de té, restaurantes, tiendas de artesanía y vida callejera auténtica.', ciudad: cityMap.chengdu._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 0, consejos: ['El callejón ancho tiene las casas de té', 'Prueba el oído limpio tradicional'] },
    { nombre: 'Mapo Tofu original', descripcion: 'Degustación del mapo tofu en el restaurante Chen Mapo Tofu, donde se inventó este plato legendario en 1862. Tofu sedoso en salsa de chile, pimienta de Sichuan y carne picada.', ciudad: cityMap.chengdu._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 12, consejos: ['Pide el nivel de picante medio si no estás acostumbrado', 'El restaurante original está en la calle Yulin'] },
    { nombre: 'Templo Wenshu', descripcion: 'El monasterio budista más activo de Chengdu. Monjes rezando, incienso, jardines de bambú y la casa de té más famosa de la ciudad en su interior.', ciudad: cityMap.chengdu._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 5, consejos: ['La casa de té del templo es la más auténtica de Chengdu', 'El almuerzo vegetariano del templo es excelente'] },
    { nombre: 'Calle Jinli de noche', descripcion: 'Calle histórica iluminada con faroles rojos junto al Templo de Wuhou. Comida callejera del Sichuan, artesanía, sombras chinescas y ambiente festivo nocturno.', ciudad: cityMap.chengdu._id, categoria: 'NOCTURNO', duracionHoras: 2.5, precio: 0, consejos: ['Prueba el sanchá (tres tés) con oreja limpia', 'Las sombras chinescas son un arte milenario'] },
    { nombre: 'Buda Gigante de Leshan (excursión)', descripcion: 'El Buda de piedra más grande del mundo (71m), tallado en un acantilado junto a la confluencia de tres ríos. Patrimonio UNESCO construido en el año 713.', ciudad: cityMap.chengdu._id, categoria: 'HISTORICO', duracionHoras: 8, precio: 45, consejos: ['Baja por las escaleras junto al Buda para apreciar su tamaño', 'El barco da una vista panorámica'] },
  ]);

  // --- HANGZHOU: new activities ---
  const hangzhouNew = await Activity.create([
    { nombre: 'Aldea del té Meijiawu', descripcion: 'Visita a una aldea productora de té Longjing. Recoge hojas de té, aprende a tostarlas en wok y disfruta de una ceremonia del té con vistas a los campos verdes.', ciudad: cityMap.hangzhou._id, categoria: 'CULTURAL', duracionHoras: 3, precio: 30, consejos: ['Puedes tostar tus propias hojas de té', 'Compra té directamente a las familias'] },
    { nombre: 'Canal Grande de Hangzhou en barco', descripcion: 'Navegación por el Gran Canal, la vía fluvial más antigua y larga del mundo (2.500 años, 1.794 km). Patrimonio UNESCO que conectaba Pekín con Hangzhou.', ciudad: cityMap.hangzhou._id, categoria: 'HISTORICO', duracionHoras: 2, precio: 15, consejos: ['El tramo de Hangzhou es el más pintoresco', 'El puente Gongchen es la entrada histórica'] },
    { nombre: 'Cerdo Dongpo', descripcion: 'Degustación del cerdo estofado Dongpo, inventado por el poeta Su Dongpo en Hangzhou hace 900 años. Carne de cerdo estofada durante horas hasta derretirse.', ciudad: cityMap.hangzhou._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 22, consejos: ['Louwailou junto al lago es el restaurante más histórico', 'Acompáñalo con té Longjing'] },
  ]);

  // --- GUILIN: new activities ---
  const guilinNew = await Activity.create([
    { nombre: 'Espectáculo Impression Sanjie Liu', descripcion: 'Show nocturno al aire libre dirigido por Zhang Yimou en Yangshuo. 600 actores locales actúan sobre el río Li con las montañas kársticas iluminadas como escenario.', ciudad: cityMap.guilin._id, categoria: 'NOCTURNO', duracionHoras: 1.5, precio: 35, consejos: ['El escenario natural es el río Li real', 'Lleva repelente de mosquitos en verano'] },
    { nombre: 'Escalada en Yangshuo', descripcion: 'Escalada en roca en los acantilados kársticos de Yangshuo, uno de los mejores destinos de escalada del mundo. Para todos los niveles.', ciudad: cityMap.guilin._id, categoria: 'AVENTURA', duracionHoras: 4, precio: 35, consejos: ['Moon Hill tiene rutas para principiantes', 'Hay escuelas de escalada con equipamiento'] },
    { nombre: 'Cerveza de arroz de Yangshuo', descripcion: 'Degustación de la cerveza artesanal de arroz local y la cocina de Yangshuo: pescado cervecero del río Li, caracoles de río con salsa picante y tofu de bambú.', ciudad: cityMap.guilin._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 15, consejos: ['La cerveza de arroz casera es sorprendentemente buena', 'El pescado cervecero del río Li es el plato estrella'] },
  ]);

  // --- LHASA: new activities ---
  const lhasaNew = await Activity.create([
    { nombre: 'Monasterio de Drepung', descripcion: 'El monasterio más grande del Tíbet, que albergó hasta 10.000 monjes. Fundado en 1416, fue la residencia de los Dalai Lama antes del Palacio de Potala.', ciudad: cityMap.lhasa._id, categoria: 'HISTORICO', duracionHoras: 3, precio: 12, consejos: ['La subida es empinada, ve despacio por la altitud', 'Las cocinas del monasterio son fascinantes'] },
    { nombre: 'Festival de yogur (Shoton)', descripcion: 'Experiencia cultural del festival del yogur tibetano: degustación de yogur de yak, picnic en el parque Norbulingka y ópera tibetana al aire libre.', ciudad: cityMap.lhasa._id, categoria: 'GASTRONOMIA', duracionHoras: 3, precio: 10, consejos: ['El yogur de yak es más ácido que el normal', 'El festival es en agosto pero hay yogur todo el año'] },
  ]);

  // --- SUZHOU: new activities ---
  const suzhouNew = await Activity.create([
    { nombre: 'Jardín del Maestro de las Redes', descripcion: 'El jardín más elegante y compacto de Suzhou. Patrimonio UNESCO. De noche hay espectáculos de ópera Kunqu, la forma operística más antigua de China.', ciudad: cityMap.suzhou._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 10, consejos: ['El espectáculo nocturno de Kunqu es mágico', 'Es más pequeño pero más refinado que el Administrador Humilde'] },
    { nombre: 'Ópera Kunqu', descripcion: 'Asiste a la ópera más antigua de China (600 años), nacida en Suzhou. Movimientos delicados, canto etéreo y vestuario exquisito. Patrimonio Inmaterial UNESCO.', ciudad: cityMap.suzhou._id, categoria: 'CULTURAL', duracionHoras: 1.5, precio: 20, consejos: ['Es más sutil que la ópera de Pekín', 'El Jardín del Maestro de las Redes tiene funciones nocturnas'] },
    { nombre: 'Pueblo acuático de Tongli', descripcion: 'Excursión a un pueblo acuático de 1.000 años cerca de Suzhou. Puentes de piedra, canales navegables, casas sobre el agua y un jardín UNESCO.', ciudad: cityMap.suzhou._id, categoria: 'HISTORICO', duracionHoras: 5, precio: 15, consejos: ['Menos turístico que Zhouzhuang', 'El Jardín de la Retirada es Patrimonio UNESCO'] },
  ]);

  // --- KUNMING: new activities ---
  const kunmingNew = await Activity.create([
    { nombre: 'Templo de Yuantong', descripcion: 'El templo budista más importante de Yunnan, con 1.200 años de historia. Arquitectura única que desciende hacia un estanque central con pabellón.', ciudad: cityMap.kunming._id, categoria: 'HISTORICO', duracionHoras: 1.5, precio: 5, consejos: ['La arquitectura invertida (desciende en vez de subir) es única', 'Hay un templo tailandés donado por Tailandia'] },
    { nombre: 'Pueblos de minorías étnicas', descripcion: 'Visita al Parque de Nacionalidades de Yunnan con aldeas recreadas de 25 etnias. Danzas, artesanía, gastronomía y tradiciones de los pueblos Yi, Bai, Dai y Naxi.', ciudad: cityMap.kunming._id, categoria: 'CULTURAL', duracionHoras: 4, precio: 18, consejos: ['Los espectáculos de danza son a horas fijas', 'Yunnan tiene 25 de las 56 minorías de China'] },
    { nombre: 'Pollo al vapor en olla de barro', descripcion: 'Degustación del plato estrella de Yunnan: pollo cocido al vapor en una olla de barro especial (qiguoji) que condensa el vapor creando un caldo puro y concentrado.', ciudad: cityMap.kunming._id, categoria: 'GASTRONOMIA', duracionHoras: 1.5, precio: 15, consejos: ['La olla de barro es una invención de Yunnan', 'Prueba también los hongos silvestres de temporada'] },
  ]);

  // --- SHENZHEN: new activities ---
  const shenzhenNew = await Activity.create([
    { nombre: 'Mercado electrónico de Huaqiangbei', descripcion: 'El mayor mercado de electrónica del mundo: 30 edificios con millones de componentes, gadgets, drones y todo lo imaginable en tecnología.', ciudad: cityMap.shenzhen._id, categoria: 'COMPRAS', duracionHoras: 3, precio: 0, consejos: ['Es el lugar donde nace la tecnología mundial', 'Puedes comprar componentes para fabricar cualquier cosa'] },
    { nombre: 'Lychee Park y Biblioteca Central', descripcion: 'Parque urbano con la biblioteca más futurista de China. Arquitectura ondulante que simula montañas. Interior con espacios de lectura rodeados de naturaleza.', ciudad: cityMap.shenzhen._id, categoria: 'CULTURAL', duracionHoras: 2, precio: 0, consejos: ['La biblioteca es un edificio icónico', 'El parque es perfecto para descansar'] },
    { nombre: 'Frontera con Hong Kong - Luohu', descripcion: 'Cruce a pie a Hong Kong por el puente fronterizo de Luohu. Experimenta el contraste entre dos sistemas en un mismo país. Centro comercial gigante en la frontera.', ciudad: cityMap.shenzhen._id, categoria: 'AVENTURA', duracionHoras: 3, precio: 0, consejos: ['Necesitas visado para Hong Kong', 'El centro comercial de Luohu tiene buenos precios'] },
  ]);

  // --- LIJIANG: new activities ---
  const lijangNew = await Activity.create([
    { nombre: 'Valle de la Luna Azul', descripcion: 'Valle a los pies de la Montaña del Dragón de Jade con lagos de agua turquesa rodeados de bosques de abetos. Paisaje de cuento con cascadas y puentes de madera.', ciudad: cityMap.lijiang._id, categoria: 'NATURALEZA', duracionHoras: 3, precio: 15, consejos: ['El color turquesa del agua es natural, por los minerales', 'Incluido en la entrada de la Montaña del Dragón de Jade'] },
    { nombre: 'Pueblo antiguo de Shuhe', descripcion: 'Pueblo Naxi más tranquilo y auténtico que Lijiang, a solo 4 km. Canales, puentes de piedra, caballos y una atmósfera rural encantadora. Patrimonio UNESCO.', ciudad: cityMap.lijiang._id, categoria: 'CULTURAL', duracionHoras: 2.5, precio: 0, consejos: ['Menos turístico que el centro de Lijiang', 'Los caballos pastando por las calles son reales'] },
    { nombre: 'Hot pot Naxi', descripcion: 'Cena de hot pot al estilo Naxi con ingredientes locales: setas silvestres, hierbas de montaña, yak y queso de cabra. Tradición culinaria de los pueblos del Himalaya.', ciudad: cityMap.lijiang._id, categoria: 'GASTRONOMIA', duracionHoras: 2, precio: 18, consejos: ['Las setas silvestres de Yunnan son las mejores de China', 'Prueba el queso de cabra frito'] },
  ]);

  // --- DUNHUANG: new activities ---
  const dunhuangNew = await Activity.create([
    { nombre: 'Amanecer en las dunas', descripcion: 'Excursión al amanecer en las dunas de Mingsha. Sube a la cresta de la duna más alta y contempla el sol saliendo sobre el desierto del Gobi en completo silencio.', ciudad: cityMap.dunhuang._id, categoria: 'AVENTURA', duracionHoras: 2.5, precio: 15, consejos: ['Sal antes de las 5am en verano', 'Las estrellas antes del amanecer son increíbles'] },
    { nombre: 'Gran Muralla de Yangguan', descripcion: 'Ruinas del paso fronterizo de Yangguan de la Ruta de la Seda. Museo con recreación de la vida en la frontera del imperio Han hace 2.000 años.', ciudad: cityMap.dunhuang._id, categoria: 'HISTORICO', duracionHoras: 3, precio: 12, consejos: ['Menos visitado que Yumen pero igual de fascinante', 'El museo tiene recreaciones muy buenas'] },
  ]);

  console.log('Nuevas actividades creadas para todas las ciudades');

  // ==================== NEW GUIDES (CIRCUITOS) ====================
  const guides = [];

  // --- PEKÍN: 2 new guides ---
  const pekinOldActs = await Activity.find({ ciudad: cityMap.pekin._id, nombre: { $nin: pekinNew.map(a => a.nombre) } });
  guides.push({
    titulo: 'Pekín Nocturno y Gastronómico',
    descripcion: '3 días descubriendo el lado nocturno y gastronómico de Pekín: pato laqueado, ópera, hutones, mercado de Wangfujing y arte contemporáneo en el 798.',
    ciudad: cityMap.pekin._id, duracionDias: 3, precio: 279,
    imagen: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Hutones y Pato Pekinés', actividades: [
        { actividad: pekinNew[0]._id, orden: 1, horaInicio: '10:00', horaFin: '12:30' },
        { actividad: pekinNew[3]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
        { actividad: pekinNew[2]._id, orden: 3, horaInicio: '18:30', horaFin: '20:30' },
      ]},
      { numeroDia: 2, titulo: 'Arte y Noche', actividades: [
        { actividad: pekinNew[5]._id, orden: 1, horaInicio: '10:00', horaFin: '13:00' },
        { actividad: pekinNew[4]._id, orden: 2, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 3, titulo: 'Ópera Imperial', actividades: [
        { actividad: pekinNew[0]._id, orden: 1, horaInicio: '09:30', horaFin: '12:00' },
        { actividad: pekinNew[1]._id, orden: 2, horaInicio: '19:30', horaFin: '21:30' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Pekín Completo - 5 Días',
    descripcion: '5 días para ver todo Pekín: Gran Muralla, Ciudad Prohibida, Templo del Cielo, hutones, arte contemporáneo, gastronomía y ópera. El circuito definitivo.',
    ciudad: cityMap.pekin._id, duracionDias: 5, precio: 459,
    imagen: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada y Hutones', actividades: [
        { actividad: pekinNew[0]._id, orden: 1, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: pekinNew[2]._id, orden: 2, horaInicio: '18:30', horaFin: '20:30' },
      ]},
      { numeroDia: 2, titulo: 'Historia Imperial', actividades: [
        { actividad: pekinNew[3]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: pekinNew[1]._id, orden: 2, horaInicio: '19:30', horaFin: '21:30' },
      ]},
      { numeroDia: 3, titulo: 'Arte Contemporáneo', actividades: [
        { actividad: pekinNew[5]._id, orden: 1, horaInicio: '09:30', horaFin: '12:30' },
        { actividad: pekinNew[4]._id, orden: 2, horaInicio: '19:00', horaFin: '21:00' },
      ]},
      { numeroDia: 4, titulo: 'Cultura y Sabor', actividades: [
        { actividad: pekinNew[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: pekinNew[2]._id, orden: 2, horaInicio: '18:30', horaFin: '20:30' },
      ]},
      { numeroDia: 5, titulo: 'Último Día', actividades: [
        { actividad: pekinNew[3]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
      ]},
    ],
  });

  // --- SHANGHÁI: 2 new guides ---
  guides.push({
    titulo: 'Shanghái Moderno y Nocturno',
    descripcion: '3 días en el lado más moderno de Shanghái: rascacielos futuristas, barrio francés en bicicleta, acróbatas, crucero nocturno y la mejor gastronomía cosmopolita.',
    ciudad: cityMap.shanghai._id, duracionDias: 3, precio: 299,
    imagen: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Rascacielos y Bund', actividades: [
        { actividad: shanghaiNew[2]._id, orden: 1, horaInicio: '10:00', horaFin: '11:30' },
        { actividad: shanghaiNew[3]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
        { actividad: shanghaiNew[5]._id, orden: 3, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Barrio Francés y Sabores', actividades: [
        { actividad: shanghaiNew[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: shanghaiNew[1]._id, orden: 2, horaInicio: '12:30', horaFin: '14:00' },
        { actividad: shanghaiNew[4]._id, orden: 3, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 3, titulo: 'Compras y Despedida', actividades: [
        { actividad: shanghaiNew[3]._id, orden: 1, horaInicio: '10:00', horaFin: '12:00' },
        { actividad: shanghaiNew[1]._id, orden: 2, horaInicio: '12:30', horaFin: '14:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Shanghái Express Gastronómico - 2 Días',
    descripcion: 'Fin de semana gastronómico en Shanghái: xiaolongbao, cocina shanghainesa, Tianzifang, crucero nocturno y el skyline más impresionante de Asia.',
    ciudad: cityMap.shanghai._id, duracionDias: 2, precio: 189,
    imagen: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Sabores y Rascacielos', actividades: [
        { actividad: shanghaiNew[1]._id, orden: 1, horaInicio: '11:00', horaFin: '12:30' },
        { actividad: shanghaiNew[2]._id, orden: 2, horaInicio: '14:00', horaFin: '15:30' },
        { actividad: shanghaiNew[5]._id, orden: 3, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Barrio Francés', actividades: [
        { actividad: shanghaiNew[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: shanghaiNew[3]._id, orden: 2, horaInicio: '13:00', horaFin: '15:00' },
      ]},
    ],
  });

  // --- CHENGDU: 2 new guides ---
  guides.push({
    titulo: 'Chengdu Cultura y Picante - 4 Días',
    descripcion: '4 días de inmersión en la cultura del Sichuan: pandas, hot pot, cambio de cara, Buda Gigante de Leshan, mapo tofu y vida callejera nocturna en Jinli.',
    ciudad: cityMap.chengdu._id, duracionDias: 4, precio: 389,
    imagen: 'https://images.unsplash.com/photo-1533552689071-33be96f7d31e?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada y Callejones', actividades: [
        { actividad: chengduNew[1]._id, orden: 1, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: chengduNew[2]._id, orden: 2, horaInicio: '17:30', horaFin: '19:00' },
        { actividad: chengduNew[4]._id, orden: 3, horaInicio: '20:00', horaFin: '22:30' },
      ]},
      { numeroDia: 2, titulo: 'Templos y Arte', actividades: [
        { actividad: chengduNew[3]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: chengduNew[0]._id, orden: 2, horaInicio: '19:30', horaFin: '21:00' },
      ]},
      { numeroDia: 3, titulo: 'Buda Gigante de Leshan', actividades: [
        { actividad: chengduNew[5]._id, orden: 1, horaInicio: '07:30', horaFin: '15:30' },
        { actividad: chengduNew[4]._id, orden: 2, horaInicio: '20:00', horaFin: '22:30' },
      ]},
      { numeroDia: 4, titulo: 'Último Día Picante', actividades: [
        { actividad: chengduNew[1]._id, orden: 1, horaInicio: '09:30', horaFin: '12:00' },
        { actividad: chengduNew[2]._id, orden: 2, horaInicio: '12:30', horaFin: '14:00' },
      ]},
    ],
  });

  guides.push({
    titulo: 'Chengdu Nocturno - 2 Días',
    descripcion: 'Fin de semana en el lado nocturno de Chengdu: calle Jinli iluminada, cambio de cara, hot pot a medianoche y callejones históricos.',
    ciudad: cityMap.chengdu._id, duracionDias: 2, precio: 169,
    imagen: 'https://images.unsplash.com/photo-1533552689071-33be96f7d31e?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Callejones y Noche', actividades: [
        { actividad: chengduNew[1]._id, orden: 1, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: chengduNew[0]._id, orden: 2, horaInicio: '19:30', horaFin: '21:00' },
        { actividad: chengduNew[4]._id, orden: 3, horaInicio: '21:30', horaFin: '23:00' },
      ]},
      { numeroDia: 2, titulo: 'Templo y Sabor', actividades: [
        { actividad: chengduNew[3]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: chengduNew[2]._id, orden: 2, horaInicio: '12:00', horaFin: '13:30' },
      ]},
    ],
  });

  // --- HANGZHOU: 1 new guide ---
  guides.push({
    titulo: 'Hangzhou Gastronómico y Cultural - 4 Días',
    descripcion: '4 días para los amantes del té y la buena mesa: plantaciones de Longjing, cerdo Dongpo, el Gran Canal, el Lago del Oeste y espectáculo nocturno de Zhang Yimou.',
    ciudad: cityMap.hangzhou._id, duracionDias: 4, precio: 369,
    imagen: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Lago y Gastronomía', actividades: [
        { actividad: hangzhouNew[2]._id, orden: 1, horaInicio: '12:00', horaFin: '13:30' },
        { actividad: hangzhouNew[1]._id, orden: 2, horaInicio: '15:00', horaFin: '17:00' },
      ]},
      { numeroDia: 2, titulo: 'Té y Aldea', actividades: [
        { actividad: hangzhouNew[0]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: hangzhouNew[2]._id, orden: 2, horaInicio: '18:00', horaFin: '19:30' },
      ]},
      { numeroDia: 3, titulo: 'Canal Milenario', actividades: [
        { actividad: hangzhouNew[1]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: hangzhouNew[0]._id, orden: 2, horaInicio: '14:00', horaFin: '17:00' },
      ]},
      { numeroDia: 4, titulo: 'Despedida', actividades: [
        { actividad: hangzhouNew[2]._id, orden: 1, horaInicio: '11:00', horaFin: '12:30' },
      ]},
    ],
  });

  // --- GUILIN: 1 new guide ---
  guides.push({
    titulo: 'Guilin Aventura Total - 5 Días',
    descripcion: '5 días de aventura: crucero por el río Li, escalada en roca, rafting en bambú, arrozales en terraza, espectáculo nocturno y la mejor gastronomía del sur de China.',
    ciudad: cityMap.guilin._id, duracionDias: 5, precio: 479,
    imagen: 'https://images.unsplash.com/photo-1537531383496-e3cdba5e457c?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada a Guilin', actividades: [
        { actividad: guilinNew[2]._id, orden: 1, horaInicio: '18:00', horaFin: '20:00' },
      ]},
      { numeroDia: 2, titulo: 'Río Li', actividades: [
        { actividad: guilinNew[2]._id, orden: 1, horaInicio: '12:00', horaFin: '14:00' },
        { actividad: guilinNew[0]._id, orden: 2, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 3, titulo: 'Escalada y Rafting', actividades: [
        { actividad: guilinNew[1]._id, orden: 1, horaInicio: '08:30', horaFin: '12:30' },
      ]},
      { numeroDia: 4, titulo: 'Arrozales', actividades: [
        { actividad: guilinNew[2]._id, orden: 1, horaInicio: '18:00', horaFin: '20:00' },
      ]},
      { numeroDia: 5, titulo: 'Despedida', actividades: [
        { actividad: guilinNew[2]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
      ]},
    ],
  });

  // --- SUZHOU: 1 new guide ---
  guides.push({
    titulo: 'Suzhou Artístico - 4 Días',
    descripcion: '4 días para los amantes del arte y la belleza: jardines UNESCO, ópera Kunqu, canales, seda, pueblo acuático de Tongli y la elegancia eterna de la Venecia de Oriente.',
    ciudad: cityMap.suzhou._id, duracionDias: 4, precio: 339,
    imagen: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Jardines y Canales', actividades: [
        { actividad: suzhouNew[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: suzhouNew[1]._id, orden: 2, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 2, titulo: 'Pueblo Acuático', actividades: [
        { actividad: suzhouNew[2]._id, orden: 1, horaInicio: '08:30', horaFin: '13:30' },
      ]},
      { numeroDia: 3, titulo: 'Seda y Arte', actividades: [
        { actividad: suzhouNew[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: suzhouNew[1]._id, orden: 2, horaInicio: '20:00', horaFin: '21:30' },
      ]},
      { numeroDia: 4, titulo: 'Despedida', actividades: [
        { actividad: suzhouNew[0]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
      ]},
    ],
  });

  // --- KUNMING: 1 new guide ---
  guides.push({
    titulo: 'Kunming Cultural - 4 Días',
    descripcion: '4 días explorando la diversidad de Yunnan: bosque de piedra, minorías étnicas, templos, gastronomía del suroeste, mercado de flores y el pollo al vapor más puro de China.',
    ciudad: cityMap.kunming._id, duracionDias: 4, precio: 329,
    imagen: 'https://images.unsplash.com/photo-1558005137-d9619a5c539f?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Templo y Ciudad', actividades: [
        { actividad: kunmingNew[0]._id, orden: 1, horaInicio: '09:00', horaFin: '10:30' },
        { actividad: kunmingNew[2]._id, orden: 2, horaInicio: '12:00', horaFin: '13:30' },
      ]},
      { numeroDia: 2, titulo: 'Minorías Étnicas', actividades: [
        { actividad: kunmingNew[1]._id, orden: 1, horaInicio: '09:00', horaFin: '13:00' },
        { actividad: kunmingNew[2]._id, orden: 2, horaInicio: '18:00', horaFin: '19:30' },
      ]},
      { numeroDia: 3, titulo: 'Naturaleza', actividades: [
        { actividad: kunmingNew[0]._id, orden: 1, horaInicio: '09:00', horaFin: '10:30' },
      ]},
      { numeroDia: 4, titulo: 'Despedida', actividades: [
        { actividad: kunmingNew[2]._id, orden: 1, horaInicio: '11:00', horaFin: '12:30' },
      ]},
    ],
  });

  // --- SHENZHEN: 1 new guide ---
  guides.push({
    titulo: 'Shenzhen Tech & Culture - 3 Días',
    descripcion: '3 días en la capital mundial de la tecnología: mercado electrónico de Huaqiangbei, arte urbano, arquitectura futurista, frontera con Hong Kong y vida nocturna junto al mar.',
    ciudad: cityMap.shenzhen._id, duracionDias: 3, precio: 229,
    imagen: 'https://images.unsplash.com/photo-1533552689071-33be96f7d31e?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Tecnología', actividades: [
        { actividad: shenzhenNew[0]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: shenzhenNew[1]._id, orden: 2, horaInicio: '14:00', horaFin: '16:00' },
      ]},
      { numeroDia: 2, titulo: 'Arte y Cultura', actividades: [
        { actividad: shenzhenNew[1]._id, orden: 1, horaInicio: '09:00', horaFin: '11:00' },
        { actividad: shenzhenNew[0]._id, orden: 2, horaInicio: '14:00', horaFin: '17:00' },
      ]},
      { numeroDia: 3, titulo: 'Frontera', actividades: [
        { actividad: shenzhenNew[2]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
      ]},
    ],
  });

  // --- LIJIANG: 1 new guide ---
  guides.push({
    titulo: 'Lijiang Naturaleza y Cultura Naxi - 4 Días',
    descripcion: '4 días de inmersión en la cultura Naxi y la naturaleza de Yunnan: casco antiguo, Montaña del Dragón de Jade, Valle de la Luna Azul, pueblo de Shuhe, música ancestral y hot pot de setas.',
    ciudad: cityMap.lijiang._id, duracionDias: 4, precio: 419,
    imagen: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Ciudad Antigua', actividades: [
        { actividad: lijangNew[1]._id, orden: 1, horaInicio: '14:00', horaFin: '16:30' },
        { actividad: lijangNew[2]._id, orden: 2, horaInicio: '18:00', horaFin: '20:00' },
      ]},
      { numeroDia: 2, titulo: 'Montaña y Valle', actividades: [
        { actividad: lijangNew[0]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: lijangNew[2]._id, orden: 2, horaInicio: '18:00', horaFin: '20:00' },
      ]},
      { numeroDia: 3, titulo: 'Pueblo de Shuhe', actividades: [
        { actividad: lijangNew[1]._id, orden: 1, horaInicio: '09:00', horaFin: '11:30' },
        { actividad: lijangNew[0]._id, orden: 2, horaInicio: '14:00', horaFin: '17:00' },
      ]},
      { numeroDia: 4, titulo: 'Despedida Naxi', actividades: [
        { actividad: lijangNew[2]._id, orden: 1, horaInicio: '11:00', horaFin: '13:00' },
      ]},
    ],
  });

  // --- DUNHUANG: 1 new guide ---
  guides.push({
    titulo: 'Dunhuang - Aventura en el Desierto',
    descripcion: '4 días de aventura en el desierto del Gobi: cuevas budistas milenarias, amanecer en las dunas, camellos, pasos de la Gran Muralla y noches estrelladas en el oasis.',
    ciudad: cityMap.dunhuang._id, duracionDias: 4, precio: 449,
    imagen: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Llegada al Oasis', actividades: [
        { actividad: dunhuangNew[1]._id, orden: 1, horaInicio: '14:00', horaFin: '17:00' },
      ]},
      { numeroDia: 2, titulo: 'Cuevas Milenarias', actividades: [
        { actividad: dunhuangNew[0]._id, orden: 1, horaInicio: '05:00', horaFin: '07:30' },
        { actividad: dunhuangNew[1]._id, orden: 2, horaInicio: '09:00', horaFin: '12:00' },
      ]},
      { numeroDia: 3, titulo: 'Dunas y Oasis', actividades: [
        { actividad: dunhuangNew[0]._id, orden: 1, horaInicio: '05:00', horaFin: '07:30' },
      ]},
      { numeroDia: 4, titulo: 'Gran Muralla del Desierto', actividades: [
        { actividad: dunhuangNew[1]._id, orden: 1, horaInicio: '08:00', horaFin: '11:00' },
      ]},
    ],
  });

  // --- LHASA: 1 new guide ---
  guides.push({
    titulo: 'Lhasa Espiritual - 5 Días',
    descripcion: '5 días de inmersión espiritual en el Tíbet: Palacio de Potala, tres grandes monasterios, debates de monjes, yogur de yak, Barkhor kora y el lago sagrado Namtso.',
    ciudad: cityMap.lhasa._id, duracionDias: 5, precio: 699,
    imagen: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
    dias: [
      { numeroDia: 1, titulo: 'Aclimatación', actividades: [
        { actividad: lhasaNew[1]._id, orden: 1, horaInicio: '15:00', horaFin: '18:00' },
      ]},
      { numeroDia: 2, titulo: 'Potala', actividades: [
        { actividad: lhasaNew[0]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: lhasaNew[1]._id, orden: 2, horaInicio: '18:00', horaFin: '21:00' },
      ]},
      { numeroDia: 3, titulo: 'Monasterio de Drepung', actividades: [
        { actividad: lhasaNew[0]._id, orden: 1, horaInicio: '08:30', horaFin: '11:30' },
        { actividad: lhasaNew[1]._id, orden: 2, horaInicio: '15:00', horaFin: '18:00' },
      ]},
      { numeroDia: 4, titulo: 'Debates y Kora', actividades: [
        { actividad: lhasaNew[0]._id, orden: 1, horaInicio: '09:00', horaFin: '12:00' },
        { actividad: lhasaNew[1]._id, orden: 2, horaInicio: '14:00', horaFin: '17:00' },
      ]},
      { numeroDia: 5, titulo: 'Lago Sagrado', actividades: [
        { actividad: lhasaNew[0]._id, orden: 1, horaInicio: '07:00', horaFin: '10:00' },
      ]},
    ],
  });

  await Guide.create(guides);
  console.log(`${guides.length} nuevos circuitos (guías) creados`);

  console.log('\n✓ Seed de enriquecimiento completado');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Nuevas actividades: ~40 (distribuidas en 15 ciudades)');
  console.log(`Nuevos circuitos: ${guides.length}`);
  console.log('Ciudades enriquecidas: Pekín, Shanghái, Chengdu, Hangzhou, Guilin, Lhasa, Suzhou, Kunming, Lijiang, Shenzhen, Dunhuang');

  process.exit(0);
};

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
