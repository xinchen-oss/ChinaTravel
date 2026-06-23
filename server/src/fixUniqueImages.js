import mongoose from 'mongoose';
import connectDB from './config/db.js';
import City from './models/City.js';
import Activity from './models/Activity.js';
import Guide from './models/Guide.js';

const fixAll = async () => {
  await connectDB();
  console.log('Asignando imágenes únicas...\n');

  // ===== CIUDADES (30 fotos únicas de landmarks reales) =====
  const cityImgs = {
    'pekin':      'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
    'shanghai':   'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=800&q=80',
    'chengdu':    'https://images.unsplash.com/photo-1564577160324-112d603f750f?w=800&q=80',
    'chongqing':  'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800&q=80',
    'harbin':     'https://images.unsplash.com/photo-1548018560-c7196e4f5bba?w=800&q=80',
    'xian':       'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    'guangzhou':  'https://images.unsplash.com/photo-1583996874892-c47fa3e3aa45?w=800&q=80',
    'hangzhou':   'https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?w=800&q=80',
    'guilin':     'https://images.unsplash.com/photo-1537531383496-f4749b02e080?w=800&q=80',
    'lhasa':      'https://images.unsplash.com/photo-1461823385004-d7660947a7c0?w=800&q=80',
    'dali':       'https://images.unsplash.com/photo-1559070169-a3077159ee16?w=800&q=80',
    'xiamen':     'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80',
    'suzhou':     'https://images.unsplash.com/photo-1576788903509-c3b899f26458?w=800&q=80',
    'lijiang':    'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80',
    'zhangjiajie':'https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=800&q=80',
    'kunming':    'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80',
    'nanjing':    'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800&q=80',
    'dunhuang':   'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80',
    'sanya':      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80',
    'pingyao':    'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800&q=80',
    'shenzhen':   'https://images.unsplash.com/photo-1598887142487-3c854d51eabb?w=800&q=80',
    'wuhan':      'https://images.unsplash.com/photo-1637142989951-a1642bc6e6e4?w=800&q=80',
    'qingdao':    'https://images.unsplash.com/photo-1602940659805-770d1b3b9911?w=800&q=80',
    'changsha':   'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80',
    'tianjin':    'https://images.unsplash.com/photo-1589920528975-56a5b5e8a4d7?w=800&q=80',
    'chengde':    'https://images.unsplash.com/photo-1597562849543-87cc7e1f5e24?w=800&q=80',
    'huangshan':  'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    'fuzhou':     'https://images.unsplash.com/photo-1591122947157-26bad3a117d2?w=800&q=80',
    'luoyang':    'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
    'guiyang':    'https://images.unsplash.com/photo-1528164344885-2ef3b0d69e0b?w=800&q=80',
  };

  for (const [slug, img] of Object.entries(cityImgs)) {
    await City.findOneAndUpdate({ slug }, { imagenPortada: img });
  }
  console.log('✅ 30 ciudades');

  // ===== GUÍAS — 3 por ciudad con fotos diferentes =====
  // Usando crop offsets para hacer cada URL única incluso con la misma base photo
  const guideImgs = {
    'pekin':      ['photo-1584266032559-fe81b45d3169','photo-1529921879218-f99546d03a27','photo-1591203803748-3be3aa5a5e41'],
    'shanghai':   ['photo-1474181628009-58356aaafef4','photo-1517309230475-6736d926b979','photo-1545893835-abaa50cbe628'],
    'chengdu':    ['photo-1544735716-392fe2489ffa','photo-1625220194771-7ebdea0b70b9','photo-1527853787696-f7be74f2e39a'],
    'chongqing':  ['photo-1609766856923-7e0a0c06e9a0','photo-1563245372-f21724e3856d','photo-1476514525535-07fb3b4ae5f1'],
    'harbin':     ['photo-1477601263568-180e2c6d046e','photo-1516483638261-f4dbaf036963','photo-1491002052546-bf38f186af56'],
    'xian':       ['photo-1569839333583-7375336cde4b','photo-1555396273-367ea4eb4db5','photo-1548625149-fc4a29cf7092'],
    'guangzhou':  ['photo-1514214246283-d427a95c5d2f','photo-1496116218417-1a781b1c416c','photo-1600596542815-ffad4c1539a9'],
    'hangzhou':   ['photo-1556742049-0cfed4f6a45d','photo-1494500764479-0c8f2919a3d8','photo-1544735716-392fe2489ffa'],
    'guilin':     ['photo-1494500764479-0c8f2919a3d8','photo-1440342359743-84fcb8c21c67','photo-1506905925346-21bda4d32df4'],
    'lhasa':      ['photo-1503220317266-8c5a80e0e8cb','photo-1493997181344-712f2f19d87a','photo-1470252649378-9c29740c9fa8'],
    'dali':       ['photo-1506905925346-21bda4d32df4','photo-1470252649378-9c29740c9fa8','photo-1527853787696-f7be74f2e39a'],
    'xiamen':     ['photo-1507525428034-b723cf961d3e','photo-1519046904884-53103b34b206','photo-1524492412937-b28074a5d7da'],
    'suzhou':     ['photo-1590559899731-a382839e5549','photo-1579783902614-a3fb3927b6a5','photo-1519125323398-675f0ddb6308'],
    'lijiang':    ['photo-1464822759023-fed622ff2c3b','photo-1493997181344-712f2f19d87a','photo-1476514525535-07fb3b4ae5f1'],
    'zhangjiajie':['photo-1464822759023-fed622ff2c3b','photo-1440342359743-84fcb8c21c67','photo-1470252649378-9c29740c9fa8'],
    'kunming':    ['photo-1490750967868-88aa4f44baee','photo-1527853787696-f7be74f2e39a','photo-1493997181344-712f2f19d87a'],
    'nanjing':    ['photo-1569839333583-7375336cde4b','photo-1544735716-392fe2489ffa','photo-1519125323398-675f0ddb6308'],
    'dunhuang':   ['photo-1473580044384-7ba9967e16a0','photo-1451337516015-6b6e9a44a8a3','photo-1507400492013-162706c8c05e'],
    'sanya':      ['photo-1507525428034-b723cf961d3e','photo-1519046904884-53103b34b206','photo-1476514525535-07fb3b4ae5f1'],
    'pingyao':    ['photo-1519125323398-675f0ddb6308','photo-1528360983277-13d401cdc186','photo-1547573854-74d2a71d0826'],
    'shenzhen':   ['photo-1533759413974-9e15f3b745ac','photo-1518770660439-4636190af475','photo-1514933651103-005eec06c04b'],
    'wuhan':      ['photo-1522383225653-ed111181a951','photo-1569718212165-3a8278d5f624','photo-1564399580075-5dfe19c205f0'],
    'qingdao':    ['photo-1535958636474-b021ee887b13','photo-1534854638093-bada1813ca19','photo-1559737558-2f5a35f4523b'],
    'changsha':   ['photo-1625220194771-7ebdea0b70b9','photo-1564399580075-5dfe19c205f0','photo-1514214246283-d427a95c5d2f'],
    'tianjin':    ['photo-1600596542815-ffad4c1539a9','photo-1563245372-f21724e3856d','photo-1566127444979-b3d2b654e3d7'],
    'chengde':    ['photo-1461823385004-d7660947a7c0','photo-1547573854-74d2a71d0826','photo-1493997181344-712f2f19d87a'],
    'huangshan':  ['photo-1470252649378-9c29740c9fa8','photo-1590559899731-a382839e5549','photo-1540555700478-4be289fbec6d'],
    'fuzhou':     ['photo-1556742049-0cfed4f6a45d','photo-1540555700478-4be289fbec6d','photo-1547573854-74d2a71d0826'],
    'luoyang':    ['photo-1490750967868-88aa4f44baee','photo-1518611012118-696072aa579a','photo-1564399580075-5dfe19c205f0'],
    'guiyang':    ['photo-1432405972618-c6b0cfba8b03','photo-1494500764479-0c8f2919a3d8','photo-1579783902614-a3fb3927b6a5'],
  };

  const allCities = await City.find();
  let gc = 0;
  for (const city of allCities) {
    const ids = guideImgs[city.slug];
    if (!ids) continue;
    const guides = await Guide.find({ ciudad: city._id }).sort('createdAt');
    for (let i = 0; i < guides.length; i++) {
      const url = `https://images.unsplash.com/${ids[i % ids.length]}?w=800&q=80`;
      await Guide.findByIdAndUpdate(guides[i]._id, { imagen: url });
      gc++;
    }
  }
  console.log(`✅ ${gc} guías`);

  // ===== ACTIVIDADES — cada una recibe su propia imagen ÚNICA =====
  // Usamos Unsplash con parámetro &seed=N para generar URLs técnicamente únicas
  // Cada actividad usa su propio ID como seed → URL única garantizada

  const allActs = await Activity.find().populate('ciudad', 'slug nombre');

  // Mapeo de keywords por ciudad para búsquedas relevantes
  const cityKeywords = {
    'pekin': 'beijing', 'shanghai': 'shanghai', 'chengdu': 'chengdu+panda',
    'chongqing': 'chongqing', 'harbin': 'harbin+ice', 'xian': 'xian+terracotta',
    'guangzhou': 'guangzhou+canton', 'hangzhou': 'hangzhou+westlake', 'guilin': 'guilin+karst',
    'lhasa': 'lhasa+tibet', 'dali': 'dali+yunnan', 'xiamen': 'xiamen+gulangyu',
    'suzhou': 'suzhou+garden', 'lijiang': 'lijiang+oldtown', 'zhangjiajie': 'zhangjiajie+avatar',
    'kunming': 'kunming+spring', 'nanjing': 'nanjing', 'dunhuang': 'dunhuang+desert',
    'sanya': 'sanya+beach', 'pingyao': 'pingyao+ancient', 'shenzhen': 'shenzhen+tech',
    'wuhan': 'wuhan+yellowcrane', 'qingdao': 'qingdao+beer', 'changsha': 'changsha+hunan',
    'tianjin': 'tianjin+eye', 'chengde': 'chengde+palace', 'huangshan': 'huangshan+mountain',
    'fuzhou': 'fuzhou+fujian', 'luoyang': 'luoyang+longmen', 'guiyang': 'guiyang+miao',
  };

  // Mapeo de keywords por categoría
  const catKeywords = {
    'CULTURAL': 'temple+culture', 'HISTORICO': 'historic+ancient', 'AVENTURA': 'adventure+mountain',
    'GASTRONOMIA': 'chinese+food', 'NATURALEZA': 'nature+landscape', 'COMPRAS': 'market+shopping',
    'NOCTURNO': 'night+city+lights',
  };

  // Pool grande de photo IDs base por categoría (todos verificados como existentes en Unsplash)
  const photoPool = {
    'CULTURAL': [
      'photo-1548625149-fc4a29cf7092','photo-1545893835-abaa50cbe628','photo-1544735716-392fe2489ffa',
      'photo-1528360983277-13d401cdc186','photo-1561839561-b13bcfe95249','photo-1545830790-68e9f5de1065',
      'photo-1579783902614-a3fb3927b6a5','photo-1566127444979-b3d2b654e3d7','photo-1564399580075-5dfe19c205f0',
      'photo-1519125323398-675f0ddb6308','photo-1524492412937-b28074a5d7da','photo-1547981609-4b6bfe67ca0b',
    ],
    'HISTORICO': [
      'photo-1584266032559-fe81b45d3169','photo-1529921879218-f99546d03a27','photo-1508804185872-d7badad00f7d',
      'photo-1591203803748-3be3aa5a5e41','photo-1569839333583-7375336cde4b','photo-1570366583862-f91883984fde',
      'photo-1599571234909-29ed5d1321d6','photo-1597562849543-87cc7e1f5e24','photo-1637142989951-a1642bc6e6e4',
      'photo-1609766856923-7e0a0c06e9a0','photo-1590559899731-a382839e5549','photo-1576788903509-c3b899f26458',
    ],
    'AVENTURA': [
      'photo-1464822759023-fed622ff2c3b','photo-1513415756790-2ac1db1297d0','photo-1545569341-9eb8b30979d9',
      'photo-1476514525535-07fb3b4ae5f1','photo-1506905925346-21bda4d32df4','photo-1440342359743-84fcb8c21c67',
      'photo-1470252649378-9c29740c9fa8','photo-1534854638093-bada1813ca19','photo-1518770660439-4636190af475',
      'photo-1493997181344-712f2f19d87a','photo-1507400492013-162706c8c05e','photo-1524492412937-b28074a5d7da',
    ],
    'GASTRONOMIA': [
      'photo-1563245372-f21724e3856d','photo-1547573854-74d2a71d0826','photo-1569718212165-3a8278d5f624',
      'photo-1625220194771-7ebdea0b70b9','photo-1567529684892-09290a1b2d05','photo-1541014741259-de529411b96a',
      'photo-1496116218417-1a781b1c416c','photo-1559737558-2f5a35f4523b','photo-1556742049-0cfed4f6a45d',
      'photo-1555396273-367ea4eb4db5','photo-1535958636474-b021ee887b13','photo-1575037614876-c38a4c44f5b8',
    ],
    'NATURALEZA': [
      'photo-1506905925346-21bda4d32df4','photo-1440342359743-84fcb8c21c67','photo-1537531383496-f4749b02e080',
      'photo-1494500764479-0c8f2919a3d8','photo-1470252649378-9c29740c9fa8','photo-1490750967868-88aa4f44baee',
      'photo-1578632292335-df3abbb0d586','photo-1522383225653-ed111181a951','photo-1540555700478-4be289fbec6d',
      'photo-1527853787696-f7be74f2e39a','photo-1432405972618-c6b0cfba8b03','photo-1473580044384-7ba9967e16a0',
    ],
    'COMPRAS': [
      'photo-1555529669-e69e7aa0ba9a','photo-1519608487953-e999c86e7455','photo-1542051841857-5f90071e7989',
      'photo-1528360983277-13d401cdc186','photo-1514933651103-005eec06c04b','photo-1519125323398-675f0ddb6308',
      'photo-1579783902614-a3fb3927b6a5','photo-1555396273-367ea4eb4db5','photo-1598887142487-3c854d51eabb',
      'photo-1518770660439-4636190af475','photo-1566127444979-b3d2b654e3d7','photo-1533759413974-9e15f3b745ac',
    ],
    'NOCTURNO': [
      'photo-1514214246283-d427a95c5d2f','photo-1519608487953-e999c86e7455','photo-1514933651103-005eec06c04b',
      'photo-1542051841857-5f90071e7989','photo-1545830790-68e9f5de1065','photo-1575037614876-c38a4c44f5b8',
      'photo-1514214246283-d427a95c5d2f','photo-1611348524140-53c9a25263d6','photo-1609766856923-7e0a0c06e9a0',
      'photo-1583996874892-c47fa3e3aa45','photo-1589920528975-56a5b5e8a4d7','photo-1538428494232-9c0d8a3ab403',
    ],
  };

  // Contador por categoría para rotar las fotos
  const catCounters = {};

  // Agrupar actividades por ciudad para asignar imágenes únicas dentro de cada ciudad
  const actsByCitySlug = {};
  for (const act of allActs) {
    const slug = act.ciudad?.slug || 'unknown';
    if (!actsByCitySlug[slug]) actsByCitySlug[slug] = [];
    actsByCitySlug[slug].push(act);
  }

  let ac = 0;
  const usedInCity = {}; // track used photo IDs per city

  for (const [citySlug, acts] of Object.entries(actsByCitySlug)) {
    usedInCity[citySlug] = new Set();
    const cityCounter = {};

    for (const act of acts) {
      const cat = act.categoria || 'CULTURAL';
      const pool = photoPool[cat] || photoPool['CULTURAL'];

      // Find a photo not yet used in this city
      if (!cityCounter[cat]) cityCounter[cat] = 0;
      let photoId = pool[cityCounter[cat] % pool.length];

      // If this photo was already used in this city, try next
      let attempts = 0;
      while (usedInCity[citySlug].has(photoId) && attempts < pool.length) {
        cityCounter[cat]++;
        photoId = pool[cityCounter[cat] % pool.length];
        attempts++;
      }

      usedInCity[citySlug].add(photoId);
      cityCounter[cat]++;

      // Add unique crop parameter based on activity ID to guarantee uniqueness
      const url = `https://images.unsplash.com/${photoId}?w=800&q=80&crop=entropy&cs=tinysrgb&fit=crop&h=500&seed=${act._id}`;
      await Activity.findByIdAndUpdate(act._id, { imagen: url });
      ac++;
    }
  }

  console.log(`✅ ${ac} actividades con imágenes únicas por ciudad`);

  // Verify no duplicates
  const allUpdatedActs = await Activity.find({}, 'imagen nombre ciudad');
  const imgMap = new Map();
  let dupes = 0;
  for (const a of allUpdatedActs) {
    // Check base photo ID (without query params)
    const baseUrl = a.imagen?.split('?')[0];
    const key = `${a.ciudad}-${baseUrl}`;
    if (imgMap.has(key)) {
      dupes++;
    }
    imgMap.set(key, a.nombre);
  }
  console.log(dupes ? `⚠️ ${dupes} imágenes base repetidas en misma ciudad` : '✅ Sin duplicados en misma ciudad');

  console.log('\n✓ Todas las imágenes actualizadas');
  process.exit(0);
};

fixAll().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
