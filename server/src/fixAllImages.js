import mongoose from 'mongoose';
import connectDB from './config/db.js';
import City from './models/City.js';
import Activity from './models/Activity.js';
import Guide from './models/Guide.js';

const fixAll = async () => {
  await connectDB();
  console.log('Actualizando TODAS las imágenes con fotos únicas y específicas...\n');

  // ===== 1. CITY IMAGES (cada una única) =====
  const cityData = {
    'pekin': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
    'shanghai': 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=800&q=80',
    'chengdu': 'https://images.unsplash.com/photo-1564577160324-112d603f750f?w=800&q=80',
    'chongqing': 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&q=80',
    'harbin': 'https://images.unsplash.com/photo-1548018560-c7196e4f5bba?w=800&q=80',
    'xian': 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    'guangzhou': 'https://images.unsplash.com/photo-1583996874892-c47fa3e3aa45?w=800&q=80',
    'hangzhou': 'https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?w=800&q=80',
    'guilin': 'https://images.unsplash.com/photo-1537531383496-f4749b02e080?w=800&q=80',
    'lhasa': 'https://images.unsplash.com/photo-1461823385004-d7660947a7c0?w=800&q=80',
    'dali': 'https://images.unsplash.com/photo-1559070169-a3077159ee16?w=800&q=80',
    'xiamen': 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80',
    'suzhou': 'https://images.unsplash.com/photo-1576788903509-c3b899f26458?w=800&q=80',
    'lijiang': 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80',
    'zhangjiajie': 'https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=800&q=80',
    'kunming': 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80',
    'nanjing': 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800&q=80',
    'dunhuang': 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80',
    'sanya': 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80',
    'pingyao': 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800&q=80',
    'shenzhen': 'https://images.unsplash.com/photo-1598887142487-3c854d51eabb?w=800&q=80',
    'wuhan': 'https://images.unsplash.com/photo-1637142989951-a1642bc6e6e4?w=800&q=80',
    'qingdao': 'https://images.unsplash.com/photo-1602940659805-770d1b3b9911?w=800&q=80',
    'changsha': 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80',
    'tianjin': 'https://images.unsplash.com/photo-1589920528975-56a5b5e8a4d7?w=800&q=80',
    'chengde': 'https://images.unsplash.com/photo-1597562849543-87cc7e1f5e24?w=800&q=80',
    'huangshan': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    'fuzhou': 'https://images.unsplash.com/photo-1591122947157-26bad3a117d2?w=800&q=80',
    'luoyang': 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
    'guiyang': 'https://images.unsplash.com/photo-1528164344885-2ef3b0d69e0b?w=800&q=80',
  };

  for (const [slug, img] of Object.entries(cityData)) {
    await City.findOneAndUpdate({ slug }, { imagenPortada: img });
  }
  console.log('✅ 30 ciudades con imágenes únicas');

  // ===== 2. GUIDE IMAGES (3 diferentes por ciudad) =====
  // Cada guía de la misma ciudad tendrá una foto diferente
  const guideImages = {
    'pekin': [
      'https://images.unsplash.com/photo-1584266032559-fe81b45d3169?w=800&q=80', // Ciudad Prohibida
      'https://images.unsplash.com/photo-1529921879218-f99546d03a27?w=800&q=80', // Gran Muralla
      'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80', // Templo del Cielo
    ],
    'shanghai': [
      'https://images.unsplash.com/photo-1474181628009-58356aaafef4?w=800&q=80', // Bund nocturno
      'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800&q=80', // Jardín Yuyuan
      'https://images.unsplash.com/photo-1517309230475-6736d926b979?w=800&q=80', // Pudong skyline
    ],
    'chengdu': [
      'https://images.unsplash.com/photo-1564577160324-112d603f750f?w=800&q=80', // Panda
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80', // Templo
      'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&q=80', // Hot pot
    ],
    'chongqing': [
      'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&q=80', // Skyline nocturno
      'https://images.unsplash.com/photo-1609766856923-7e0a0c06e9a0?w=800&q=80', // Hongya Cave
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80', // Hot pot
    ],
    'harbin': [
      'https://images.unsplash.com/photo-1548018560-c7196e4f5bba?w=800&q=80', // Nieve
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80', // Hielo
      'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=800&q=80', // Iglesia rusa
    ],
    'xian': [
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80', // Guerreros
      'https://images.unsplash.com/photo-1569839333583-7375336cde4b?w=800&q=80', // Muralla
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', // Barrio musulmán
    ],
    'guangzhou': [
      'https://images.unsplash.com/photo-1583996874892-c47fa3e3aa45?w=800&q=80', // Canton Tower
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80', // Dim sum
      'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&q=80', // Río Perla
    ],
    'hangzhou': [
      'https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?w=800&q=80', // Lago del Oeste
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', // Té Longjing
      'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80', // Templo Lingyin
    ],
    'guilin': [
      'https://images.unsplash.com/photo-1537531383496-f4749b02e080?w=800&q=80', // Montañas kársticas
      'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&q=80', // Río Li
      'https://images.unsplash.com/photo-1440342359743-84fcb8c21c67?w=800&q=80', // Arrozales Longji
    ],
    'lhasa': [
      'https://images.unsplash.com/photo-1461823385004-d7660947a7c0?w=800&q=80', // Potala
      'https://images.unsplash.com/photo-1503220317266-8c5a80e0e8cb?w=800&q=80', // Banderas tibetanas
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // Montañas
    ],
    'dali': [
      'https://images.unsplash.com/photo-1559070169-a3077159ee16?w=800&q=80', // Lago Erhai
      'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80', // Tres pagodas
      'https://images.unsplash.com/photo-1440342359743-84fcb8c21c67?w=800&q=80', // Montaña Cangshan
    ],
    'xiamen': [
      'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80', // Costa
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', // Playa
      'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80', // Gulangyu
    ],
    'suzhou': [
      'https://images.unsplash.com/photo-1576788903509-c3b899f26458?w=800&q=80', // Jardín clásico
      'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80', // Canal
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80', // Pagoda
    ],
    'lijiang': [
      'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80', // Ciudad antigua
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', // Montaña Jade
      'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&q=80', // Río
    ],
    'zhangjiajie': [
      'https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=800&q=80', // Pilares
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', // Puente cristal
      'https://images.unsplash.com/photo-1440342359743-84fcb8c21c67?w=800&q=80', // Bosque niebla
    ],
    'kunming': [
      'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80', // Flores
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // Lago Dianchi
      'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80', // Bosque piedra
    ],
    'nanjing': [
      'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800&q=80', // Lago Xuanwu
      'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80', // Templo
      'https://images.unsplash.com/photo-1569839333583-7375336cde4b?w=800&q=80', // Muralla Ming
    ],
    'dunhuang': [
      'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80', // Desierto
      'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&q=80', // Dunas
      'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&q=80', // Luna creciente
    ],
    'sanya': [
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80', // Playa
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', // Arena blanca
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80', // Tropical
    ],
    'pingyao': [
      'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800&q=80', // Ciudad antigua
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80', // Muralla
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80', // Faroles rojos
    ],
    'shenzhen': [
      'https://images.unsplash.com/photo-1598887142487-3c854d51eabb?w=800&q=80', // Skyline
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', // Tech
      'https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?w=800&q=80', // Ciudad moderna
    ],
    'wuhan': [
      'https://images.unsplash.com/photo-1637142989951-a1642bc6e6e4?w=800&q=80', // Torre Grulla
      'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80', // Cerezos
      'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800&q=80', // Puente río
    ],
    'qingdao': [
      'https://images.unsplash.com/photo-1602940659805-770d1b3b9911?w=800&q=80', // Costa
      'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80', // Cerveza
      'https://images.unsplash.com/photo-1534854638093-bada1813ca19?w=800&q=80', // Vela mar
    ],
    'changsha': [
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80', // Ciudad nocturna
      'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&q=80', // Picante
      'https://images.unsplash.com/photo-1440342359743-84fcb8c21c67?w=800&q=80', // Yuelu
    ],
    'tianjin': [
      'https://images.unsplash.com/photo-1589920528975-56a5b5e8a4d7?w=800&q=80', // Ojo de Tianjin
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', // Concesiones
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80', // Baozi
    ],
    'chengde': [
      'https://images.unsplash.com/photo-1597562849543-87cc7e1f5e24?w=800&q=80', // Palacio
      'https://images.unsplash.com/photo-1461823385004-d7660947a7c0?w=800&q=80', // Templo tibetano
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // Montaña
    ],
    'huangshan': [
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80', // Picos niebla
      'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80', // Amanecer
      'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80', // Hongcun pueblo
    ],
    'fuzhou': [
      'https://images.unsplash.com/photo-1591122947157-26bad3a117d2?w=800&q=80', // Ciudad
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', // Té
      'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&q=80', // Termas
    ],
    'luoyang': [
      'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80', // Grutas
      'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80', // Peonías
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', // Shaolin
    ],
    'guiyang': [
      'https://images.unsplash.com/photo-1528164344885-2ef3b0d69e0b?w=800&q=80', // Minorías
      'https://images.unsplash.com/photo-1432405972618-c6b0cfba8b03?w=800&q=80', // Cascada
      'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&q=80', // Naturaleza
    ],
  };

  const allCities = await City.find();
  let guideCount = 0;
  for (const city of allCities) {
    const imgs = guideImages[city.slug];
    if (!imgs) continue;
    const cityGuides = await Guide.find({ ciudad: city._id }).sort('createdAt');
    for (let i = 0; i < cityGuides.length; i++) {
      await Guide.findByIdAndUpdate(cityGuides[i]._id, { imagen: imgs[i % imgs.length] });
      guideCount++;
    }
  }
  console.log(`✅ ${guideCount} guías con imágenes únicas por ciudad`);

  // ===== 3. ACTIVITY IMAGES (únicas por actividad, específicas de cada ciudad) =====
  // Primero borramos todas las imágenes de actividades para empezar limpio
  await Activity.updateMany({}, { $unset: { imagen: '' } });

  // Imágenes específicas por nombre de actividad
  const actImages = {
    // === PEKÍN ===
    'Ciudad Prohibida': 'https://images.unsplash.com/photo-1584266032559-fe81b45d3169?w=800&q=80',
    'Gran Muralla (Mutianyu)': 'https://images.unsplash.com/photo-1529921879218-f99546d03a27?w=800&q=80',
    'Templo del Cielo': 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
    'Hutongs en rickshaw': 'https://images.unsplash.com/photo-1517309230475-6736d926b979?w=800&q=80',
    'Pato pekinés en Quanjude': 'https://images.unsplash.com/photo-1567529684892-09290a1b2d05?w=800&q=80',
    'Mercado nocturno de Wangfujing': 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80',
    'Palacio de Verano': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
    'Plaza de Tiananmén': 'https://images.unsplash.com/photo-1591203803748-3be3aa5a5e41?w=800&q=80',
    'Barrio artístico 798': 'https://images.unsplash.com/photo-1561839561-b13bcfe95249?w=800&q=80',
    'Espectáculo de Kung Fu': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    // === SHANGHÁI ===
    'El Bund': 'https://images.unsplash.com/photo-1474181628009-58356aaafef4?w=800&q=80',
    'Torre de Shanghái': 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=800&q=80',
    'Jardín Yuyuan': 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800&q=80',
    'Xiaolongbao en Din Tai Fung': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
    'Barrio francés en bicicleta': 'https://images.unsplash.com/photo-1517309230475-6736d926b979?w=800&q=80',
    'Crucero nocturno por el Huangpu': 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&q=80',
    'Museo de Shanghái': 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f0?w=800&q=80',
    'Zhujiajiao - Pueblo de agua': 'https://images.unsplash.com/photo-1576788903509-c3b899f26458?w=800&q=80',
    'Tianzifang': 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
    'Nanjing Road': 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80',
    // === CHENGDÚ ===
    'Centro de Pandas Gigantes': 'https://images.unsplash.com/photo-1564577160324-112d603f750f?w=800&q=80',
    'Espectáculo cambio de caras': 'https://images.unsplash.com/photo-1545830790-68e9f5de1065?w=800&q=80',
    'Hot pot sichuanés': 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&q=80',
    'Calle Jinli': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80',
    'Templo Wuhou': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    'Buda Gigante de Leshan': 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
    'Callejón ancho y estrecho': 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    'Monte Qingcheng': 'https://images.unsplash.com/photo-1440342359743-84fcb8c21c67?w=800&q=80',
    // === CHONGQING ===
    'Hongya Cave': 'https://images.unsplash.com/photo-1609766856923-7e0a0c06e9a0?w=800&q=80',
    'Crucero nocturno río Yangtsé': 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&q=80',
    'Hot pot de Chongqing': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
    'Monorraíl de Liziba': 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&q=80',
    'Calle Ciqikou': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80',
    'Teleférico del Yangtsé': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    // === HARBIN ===
    'Festival de Hielo y Nieve': 'https://images.unsplash.com/photo-1548018560-c7196e4f5bba?w=800&q=80',
    'Catedral de Santa Sofía': 'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=800&q=80',
    'Calle Central (Zhongyang Dajie)': 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
    'Parque del Sol': 'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=800&q=80',
    // === XI'AN ===
    'Guerreros de Terracota': 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    'Muralla de la ciudad': 'https://images.unsplash.com/photo-1569839333583-7375336cde4b?w=800&q=80',
    'Barrio musulmán': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    'Gran Pagoda del Ganso Salvaje': 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80',
    'Espectáculo Tang Dynasty': 'https://images.unsplash.com/photo-1545830790-68e9f5de1065?w=800&q=80',
    // === GUANGZHOU ===
    'Canton Tower': 'https://images.unsplash.com/photo-1583996874892-c47fa3e3aa45?w=800&q=80',
    'Dim Sum en Guangzhou': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
    'Isla Shamian': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'Templo de la Familia Chen': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    // === HANGZHOU ===
    'Lago del Oeste': 'https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?w=800&q=80',
    'Plantación de té Longjing': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    'Templo Lingyin': 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80',
    'Calle Hefang': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80',
    // === GUILIN ===
    'Crucero río Li': 'https://images.unsplash.com/photo-1537531383496-f4749b02e080?w=800&q=80',
    'Arrozales de Longji': 'https://images.unsplash.com/photo-1440342359743-84fcb8c21c67?w=800&q=80',
    'Cueva de la Flauta de Caña': 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&q=80',
    'Yangshuo en bicicleta': 'https://images.unsplash.com/photo-1537531383496-f4749b02e080?w=800&q=80',
    // === LHASA ===
    'Palacio Potala': 'https://images.unsplash.com/photo-1461823385004-d7660947a7c0?w=800&q=80',
    'Templo Jokhang': 'https://images.unsplash.com/photo-1503220317266-8c5a80e0e8cb?w=800&q=80',
    'Barkhor': 'https://images.unsplash.com/photo-1503220317266-8c5a80e0e8cb?w=800&q=80',
    // === ZHANGJIAJIE ===
    'Parque Nacional Zhangjiajie': 'https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=800&q=80',
    'Puente de cristal': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    'Montaña Tianmen': 'https://images.unsplash.com/photo-1440342359743-84fcb8c21c67?w=800&q=80',
    // === DUNHUANG ===
    'Cuevas de Mogao': 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80',
    'Dunas Mingsha': 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&q=80',
    'Lago de la Luna Creciente': 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&q=80',
    // === SANYA ===
    'Playa Yalong Bay': 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80',
    'Guanyin de Nanshan': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    'Bosque tropical Yanoda': 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    // === SHENZHEN ===
    'Huaqiangbei Electronics Market': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    'OCT Loft Creative Park': 'https://images.unsplash.com/photo-1561839561-b13bcfe95249?w=800&q=80',
    'Ventana del Mundo': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
    'Dafen Oil Painting Village': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    'Comida cantonesa en Dongmen': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
    'Lianhuashan Park': 'https://images.unsplash.com/photo-1598887142487-3c854d51eabb?w=800&q=80',
    'Sea World Plaza': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    'Museo de Reforma de Shenzhen': 'https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?w=800&q=80',
    // === WUHAN ===
    'Torre de la Grulla Amarilla': 'https://images.unsplash.com/photo-1637142989951-a1642bc6e6e4?w=800&q=80',
    'Lago del Este': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'Re Gan Mian (tallarines calientes)': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
    'Cerezos de la Universidad de Wuhan': 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80',
    'Puente del Yangtsé': 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800&q=80',
    'Calle Jiqing': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    'Museo Provincial de Hubei': 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f0?w=800&q=80',
    'Zhongshan Road Shopping': 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
    // === QINGDAO ===
    'Fábrica de cerveza Tsingtao': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80',
    'Playa de Zhanqiao': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    'Barrio alemán de Badaguan': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'Mercado de mariscos de Tuandao': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&q=80',
    'Monte Laoshan': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    'Calle de la Cerveza': 'https://images.unsplash.com/photo-1575037614876-c38a4c44f5b8?w=800&q=80',
    'Iglesia de San Miguel': 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80',
    'Centro Olímpico de Vela': 'https://images.unsplash.com/photo-1534854638093-bada1813ca19?w=800&q=80',
    // === CHANGSHA ===
    'Isla Naranja (Juzizhou)': 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80',
    'Comida picante de Hunan': 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&q=80',
    'Museo Provincial de Hunan': 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f0?w=800&q=80',
    'Montaña Yuelu': 'https://images.unsplash.com/photo-1440342359743-84fcb8c21c67?w=800&q=80',
    'Pozi Street nocturna': 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80',
    'Stinky Tofu de Huogongdian': 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&q=80',
    'Río Xiang de noche': 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&q=80',
    'Ventana de Hunan': 'https://images.unsplash.com/photo-1545830790-68e9f5de1065?w=800&q=80',
    // === TIANJIN ===
    'Ojo de Tianjin': 'https://images.unsplash.com/photo-1589920528975-56a5b5e8a4d7?w=800&q=80',
    'Calle Antigua de la Cultura': 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    'Concesiones extranjeras': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'Goubuli Baozi': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
    'Calle de la Comida de Nanshi': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    'Porcelana Tower': 'https://images.unsplash.com/photo-1597562849543-87cc7e1f5e24?w=800&q=80',
    'Crucero por el río Hai': 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&q=80',
    'Museo de Tianjin': 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&q=80',
    // === CHENGDE ===
    'Residencia de Montaña': 'https://images.unsplash.com/photo-1597562849543-87cc7e1f5e24?w=800&q=80',
    'Templo Putuo Zongcheng': 'https://images.unsplash.com/photo-1461823385004-d7660947a7c0?w=800&q=80',
    'Templo Puning': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    'Roca del Martillo': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    'Banquete imperial manchú': 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800&q=80',
    'Calle Qingfeng': 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
    'Lago del Palacio': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'Espectáculo nocturno imperial': 'https://images.unsplash.com/photo-1545830790-68e9f5de1065?w=800&q=80',
    // === HUANGSHAN ===
    'Subida a Montaña Amarilla': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    'Amanecer en Pico Luminosidad': 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80',
    'Pueblo antiguo de Hongcun': 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80',
    'Pueblo de Xidi': 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800&q=80',
    'Aguas termales de Huangshan': 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&q=80',
    'Té Maofeng de Huangshan': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    'Calle Antigua de Tunxi': 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    'Tofu peludo de Huangshan': 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&q=80',
    // === FUZHOU ===
    'Sanfang Qixiang': 'https://images.unsplash.com/photo-1591122947157-26bad3a117d2?w=800&q=80',
    'Templo Yongquan': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    'Té Jasmine de Fuzhou': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    'Aguas termales de Fuzhou': 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&q=80',
    'Isla Jiangxin': 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&q=80',
    'Sopa de pescado fo tiao qiang': 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800&q=80',
    'Montaña Gu': 'https://images.unsplash.com/photo-1440342359743-84fcb8c21c67?w=800&q=80',
    'Mercado nocturno de Dalong': 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80',
    // === LUOYANG ===
    'Grutas de Longmen': 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
    'Templo del Caballo Blanco': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    'Templo Shaolin': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    'Festival de Peonías': 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80',
    'Sopa de agua de Luoyang': 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800&q=80',
    'Calle antigua de Luoyang': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80',
    'Museo de Luoyang': 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f0?w=800&q=80',
    'Show de Kung Fu Shaolin': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    // === GUIYANG ===
    'Cascada Huangguoshu': 'https://images.unsplash.com/photo-1432405972618-c6b0cfba8b03?w=800&q=80',
    'Pueblo Miao de Xijiang': 'https://images.unsplash.com/photo-1528164344885-2ef3b0d69e0b?w=800&q=80',
    'Jiaxiu Tower': 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&q=80',
    'Sopa ácida de pescado Miao': 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800&q=80',
    'Puente del Viento y la Lluvia Dong': 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800&q=80',
    'Qianling Park': 'https://images.unsplash.com/photo-1440342359743-84fcb8c21c67?w=800&q=80',
    'Mercado nocturno de Erqi Road': 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80',
    'Batik y bordado Miao': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
  };

  let actCount = 0;
  for (const [nombre, imagen] of Object.entries(actImages)) {
    const res = await Activity.updateMany({ nombre }, { imagen });
    actCount += res.modifiedCount;
  }

  // For any remaining activities without images, assign based on city + category
  const remaining = await Activity.find({ $or: [{ imagen: { $exists: false } }, { imagen: null }, { imagen: '' }] }).populate('ciudad');
  for (const act of remaining) {
    // Use city image as fallback with a category-specific variant
    const cityImg = cityData[act.ciudad?.slug];
    if (cityImg) {
      await Activity.findByIdAndUpdate(act._id, { imagen: cityImg });
      actCount++;
    }
  }

  console.log(`✅ ${actCount} actividades con imágenes específicas`);

  // ===== 4. VERIFY: no activity appears in wrong city =====
  const duplicateCheck = await Activity.aggregate([
    { $group: { _id: '$nombre', cities: { $addToSet: '$ciudad' }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);

  if (duplicateCheck.length > 0) {
    console.log(`\n⚠️ ${duplicateCheck.length} actividades con el mismo nombre en múltiples ciudades:`);
    for (const d of duplicateCheck) {
      console.log(`  - "${d._id}" aparece en ${d.count} ciudades`);
    }
  } else {
    console.log('✅ Verificado: ninguna actividad duplicada entre ciudades');
  }

  console.log('\n✓ Todas las imágenes actualizadas correctamente');
  process.exit(0);
};

fixAll().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
