import mongoose from 'mongoose';
import connectDB from './config/db.js';
import City from './models/City.js';
import Activity from './models/Activity.js';
import Guide from './models/Guide.js';

const fixImages = async () => {
  await connectDB();
  console.log('Actualizando imágenes...\n');

  // ========== FIX CITY IMAGES ==========
  const cityImages = {
    'shenzhen': 'https://images.unsplash.com/photo-1598887142487-3c854d51eabb?w=800&q=80',
    'wuhan': 'https://images.unsplash.com/photo-1637142989951-a1642bc6e6e4?w=800&q=80',
    'qingdao': 'https://images.unsplash.com/photo-1602940659805-770d1b3b9911?w=800&q=80',
    'changsha': 'https://images.unsplash.com/photo-1583425423320-1a6d856b4b02?w=800&q=80',
    'tianjin': 'https://images.unsplash.com/photo-1589920528975-56a5b5e8a4d7?w=800&q=80',
    'chengde': 'https://images.unsplash.com/photo-1597562849543-87cc7e1f5e24?w=800&q=80',
    'huangshan': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    'fuzhou': 'https://images.unsplash.com/photo-1591122947157-26bad3a117d2?w=800&q=80',
    'luoyang': 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80',
    'guiyang': 'https://images.unsplash.com/photo-1528164344885-2ef3b0d69e0b?w=800&q=80',
    // Also fix some original cities that had generic images
    'pekin': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
    'shanghai': 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=800&q=80',
    'chengdu': 'https://images.unsplash.com/photo-1564577160324-112d603f750f?w=800&q=80',
    'chongqing': 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&q=80',
    'harbin': 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
    'xian': 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    'guangzhou': 'https://images.unsplash.com/photo-1583996874892-c47fa3e3aa45?w=800&q=80',
    'hangzhou': 'https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?w=800&q=80',
    'guilin': 'https://images.unsplash.com/photo-1537531383496-f4749b02e080?w=800&q=80',
    'lhasa': 'https://images.unsplash.com/photo-1461823385004-d7660947a7c0?w=800&q=80',
    'dali': 'https://images.unsplash.com/photo-1559070169-a3077159ee16?w=800&q=80',
    'xiamen': 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80',
    'suzhou': 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80',
    'lijiang': 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80',
    'zhangjiajie': 'https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=800&q=80',
    'kunming': 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80',
    'nanjing': 'https://images.unsplash.com/photo-1583425423320-1a6d856b4b02?w=800&q=80',
    'dunhuang': 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80',
    'sanya': 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80',
    'pingyao': 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800&q=80',
  };

  for (const [slug, img] of Object.entries(cityImages)) {
    await City.findOneAndUpdate({ slug }, { imagenPortada: img });
  }
  console.log('✅ Imágenes de ciudades actualizadas');

  // ========== ADD ACTIVITY IMAGES ==========
  // Map activity names to relevant images
  const activityImages = {
    // Shenzhen
    'Huaqiangbei Electronics Market': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    'OCT Loft Creative Park': 'https://images.unsplash.com/photo-1561839561-b13bcfe95249?w=800&q=80',
    'Ventana del Mundo': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
    'Dafen Oil Painting Village': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    'Comida cantonesa en Dongmen': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
    'Lianhuashan Park': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'Sea World Plaza': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    'Museo de Reforma de Shenzhen': 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&q=80',
    // Wuhan
    'Torre de la Grulla Amarilla': 'https://images.unsplash.com/photo-1637142989951-a1642bc6e6e4?w=800&q=80',
    'Lago del Este': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'Re Gan Mian (tallarines calientes)': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
    'Cerezos de la Universidad de Wuhan': 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80',
    'Puente del Yangtsé': 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800&q=80',
    'Calle Jiqing': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    'Museo Provincial de Hubei': 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f0?w=800&q=80',
    'Zhongshan Road Shopping': 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
    // Qingdao
    'Fábrica de cerveza Tsingtao': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80',
    'Playa de Zhanqiao': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    'Barrio alemán de Badaguan': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'Mercado de mariscos de Tuandao': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&q=80',
    'Monte Laoshan': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    'Calle de la Cerveza': 'https://images.unsplash.com/photo-1575037614876-c38a4c44f5b8?w=800&q=80',
    'Iglesia de San Miguel': 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80',
    'Centro Olímpico de Vela': 'https://images.unsplash.com/photo-1534854638093-bada1813ca19?w=800&q=80',
    // Changsha
    'Isla Naranja (Juzizhou)': 'https://images.unsplash.com/photo-1583425423320-1a6d856b4b02?w=800&q=80',
    'Comida picante de Hunan': 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&q=80',
    'Museo Provincial de Hunan': 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f0?w=800&q=80',
    'Montaña Yuelu': 'https://images.unsplash.com/photo-1440342359743-84fcb8c21c67?w=800&q=80',
    'Pozi Street nocturna': 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80',
    'Stinky Tofu de Huogongdian': 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&q=80',
    'Río Xiang de noche': 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&q=80',
    'Ventana de Hunan': 'https://images.unsplash.com/photo-1545830790-68e9f5de1065?w=800&q=80',
    // Tianjin
    'Ojo de Tianjin': 'https://images.unsplash.com/photo-1589920528975-56a5b5e8a4d7?w=800&q=80',
    'Calle Antigua de la Cultura': 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    'Concesiones extranjeras': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'Goubuli Baozi': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
    'Calle de la Comida de Nanshi': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    'Porcelana Tower': 'https://images.unsplash.com/photo-1597562849543-87cc7e1f5e24?w=800&q=80',
    'Crucero por el río Hai': 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&q=80',
    'Museo de Tianjin': 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&q=80',
    // Chengde
    'Residencia de Montaña': 'https://images.unsplash.com/photo-1597562849543-87cc7e1f5e24?w=800&q=80',
    'Templo Putuo Zongcheng': 'https://images.unsplash.com/photo-1461823385004-d7660947a7c0?w=800&q=80',
    'Templo Puning': 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800&q=80',
    'Roca del Martillo': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    'Banquete imperial manchú': 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800&q=80',
    'Calle Qingfeng': 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
    'Lago del Palacio': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'Espectáculo nocturno imperial': 'https://images.unsplash.com/photo-1545830790-68e9f5de1065?w=800&q=80',
    // Huangshan
    'Subida a Montaña Amarilla': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    'Amanecer en Pico Luminosidad': 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80',
    'Pueblo antiguo de Hongcun': 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80',
    'Pueblo de Xidi': 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800&q=80',
    'Aguas termales de Huangshan': 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&q=80',
    'Té Maofeng de Huangshan': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    'Calle Antigua de Tunxi': 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    'Tofu peludo de Huangshan': 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&q=80',
    // Fuzhou
    'Sanfang Qixiang': 'https://images.unsplash.com/photo-1591122947157-26bad3a117d2?w=800&q=80',
    'Templo Yongquan': 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800&q=80',
    'Té Jasmine de Fuzhou': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    'Aguas termales de Fuzhou': 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&q=80',
    'Isla Jiangxin': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'Sopa de pescado fo tiao qiang': 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800&q=80',
    'Montaña Gu': 'https://images.unsplash.com/photo-1440342359743-84fcb8c21c67?w=800&q=80',
    'Mercado nocturno de Dalong': 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80',
    // Luoyang
    'Grutas de Longmen': 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80',
    'Templo del Caballo Blanco': 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800&q=80',
    'Templo Shaolin': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    'Festival de Peonías': 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80',
    'Sopa de agua de Luoyang': 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800&q=80',
    'Calle antigua de Luoyang': 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    'Museo de Luoyang': 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f0?w=800&q=80',
    'Show de Kung Fu Shaolin': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    // Guiyang
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
  for (const [nombre, imagen] of Object.entries(activityImages)) {
    const res = await Activity.findOneAndUpdate({ nombre }, { imagen });
    if (res) actCount++;
  }
  console.log(`✅ ${actCount} actividades actualizadas con imágenes`);

  // ========== FIX GUIDE IMAGES ==========
  // Update guide images to match their city
  const guideImageMap = {
    'shenzhen': 'https://images.unsplash.com/photo-1598887142487-3c854d51eabb?w=800&q=80',
    'wuhan': 'https://images.unsplash.com/photo-1637142989951-a1642bc6e6e4?w=800&q=80',
    'qingdao': 'https://images.unsplash.com/photo-1602940659805-770d1b3b9911?w=800&q=80',
    'changsha': 'https://images.unsplash.com/photo-1583425423320-1a6d856b4b02?w=800&q=80',
    'tianjin': 'https://images.unsplash.com/photo-1589920528975-56a5b5e8a4d7?w=800&q=80',
    'chengde': 'https://images.unsplash.com/photo-1597562849543-87cc7e1f5e24?w=800&q=80',
    'huangshan': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    'fuzhou': 'https://images.unsplash.com/photo-1591122947157-26bad3a117d2?w=800&q=80',
    'luoyang': 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80',
    'guiyang': 'https://images.unsplash.com/photo-1528164344885-2ef3b0d69e0b?w=800&q=80',
  };

  const newCities = await City.find({ slug: { $in: Object.keys(guideImageMap) } });
  let guideCount = 0;
  for (const city of newCities) {
    const img = guideImageMap[city.slug];
    if (img) {
      const res = await Guide.updateMany({ ciudad: city._id }, { imagen: img });
      guideCount += res.modifiedCount;
    }
  }
  console.log(`✅ ${guideCount} guías actualizadas con imágenes de su ciudad`);

  // Also add images to activities from the original 20 cities that don't have images
  const activitiesWithoutImages = await Activity.find({ $or: [{ imagen: { $exists: false } }, { imagen: null }, { imagen: '' }] }).populate('ciudad');

  // Generic but relevant images by category
  const categoryImages = {
    'CULTURAL': [
      'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80',
      'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800&q=80',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    ],
    'HISTORICO': [
      'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
      'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800&q=80',
      'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80',
    ],
    'AVENTURA': [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=800&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    ],
    'GASTRONOMIA': [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
      'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800&q=80',
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
    ],
    'NATURALEZA': [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1440342359743-84fcb8c21c67?w=800&q=80',
      'https://images.unsplash.com/photo-1537531383496-f4749b02e080?w=800&q=80',
    ],
    'COMPRAS': [
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    ],
    'NOCTURNO': [
      'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&q=80',
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    ],
  };

  let oldActCount = 0;
  for (const act of activitiesWithoutImages) {
    const imgs = categoryImages[act.categoria] || categoryImages['CULTURAL'];
    const img = imgs[oldActCount % imgs.length];
    await Activity.findByIdAndUpdate(act._id, { imagen: img });
    oldActCount++;
  }
  console.log(`✅ ${oldActCount} actividades antiguas actualizadas con imágenes por categoría`);

  console.log('\n✓ Todas las imágenes actualizadas');
  process.exit(0);
};

fixImages().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
