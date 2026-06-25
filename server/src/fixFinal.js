import connectDB from './config/db.js';
import Ruta from './models/Ruta.js';
import City from './models/City.js';

const run = async () => {
  await connectDB();
  console.log('Asignando 90 fotos ÚNICAS a guías...\n');

  // 90 Unsplash photo IDs — todos diferentes, cada uno temático para China/viajes
  // Organizados por ciudad: 3 fotos únicas por cada una de las 30 ciudades
  const cityGuidePhotos = {
    'pekin': [
      'photo-1584266032559-fe81b45d3169', // Ciudad Prohibida rojo
      'photo-1529921879218-f99546d03a27', // Gran Muralla verde
      'photo-1591203803748-3be3aa5a5e41', // Tiananmen amanecer
    ],
    'shanghai': [
      'photo-1474181628009-58356aaafef4', // Bund noche luces
      'photo-1517309230475-6736d926b979', // Calles Shanghai
      'photo-1462332420958-a05d1e002413', // Skyline Pudong día
    ],
    'chengdu': [
      'photo-1564577160324-112d603f750f', // Panda comiendo bambú
      'photo-1527853787696-f7be74f2e39a', // Bosque bambú verde
      'photo-1544735716-392fe2489ffa', // Templo rojo dorado
    ],
    'chongqing': [
      'photo-1611348524140-53c9a25263d6', // Skyline nocturno río
      'photo-1609766856923-7e0a0c06e9a0', // Hongya Cave luces
      'photo-1563245372-f21724e3856d', // Hot pot vapor
    ],
    'harbin': [
      'photo-1548018560-c7196e4f5bba', // Festival hielo colores
      'photo-1477601263568-180e2c6d046e', // Catedral nevada
      'photo-1491002052546-bf38f186af56', // Esculturas hielo noche
    ],
    'xian': [
      'photo-1528360983277-13d401cdc186', // Guerreros terracota
      'photo-1569839333583-7375336cde4b', // Muralla bicicleta
      'photo-1555396273-367ea4eb4db5', // Barrio musulmán comida
    ],
    'guangzhou': [
      'photo-1583996874892-c47fa3e3aa45', // Canton Tower neón
      'photo-1496116218417-1a781b1c416c', // Dim sum mesa
      'photo-1600596542815-ffad4c1539a9', // Shamian colonial
    ],
    'hangzhou': [
      'photo-1580193769210-b8d1c049a7d9', // Lago Oeste pagoda
      'photo-1556742049-0cfed4f6a45d', // Ceremonia té verde
      'photo-1548625149-fc4a29cf7092', // Templo Lingyin budas
    ],
    'guilin': [
      'photo-1537531383496-f4749b02e080', // Montañas kársticas
      'photo-1440342359743-84fcb8c21c67', // Arrozales terraza
      'photo-1494500764479-0c8f2919a3d8', // Río Li bambú balsa
    ],
    'lhasa': [
      'photo-1461823385004-d7660947a7c0', // Palacio Potala
      'photo-1503220317266-8c5a80e0e8cb', // Banderas oración viento
      'photo-1493997181344-712f2f19d87a', // Himalaya nevada
    ],
    'dali': [
      'photo-1559070169-a3077159ee16', // Tres pagodas lago
      'photo-1506905925346-21bda4d32df4', // Lago Erhai montaña
      'photo-1470252649378-9c29740c9fa8', // Amanecer dorado lago
    ],
    'xiamen': [
      'photo-1518623489648-a173ef7824f3', // Gulangyu costa
      'photo-1507525428034-b723cf961d3e', // Playa arena olas
      'photo-1524492412937-b28074a5d7da', // Templo junto al mar
    ],
    'suzhou': [
      'photo-1576788903509-c3b899f26458', // Jardín clásico estanque
      'photo-1590559899731-a382839e5549', // Canal botes piedra
      'photo-1579783902614-a3fb3927b6a5', // Pintura seda arte
    ],
    'lijiang': [
      'photo-1587974928442-77dc3e0dba72', // Ciudad antigua tejados
      'photo-1464822759023-fed622ff2c3b', // Montaña Jade nieve
      'photo-1476514525535-07fb3b4ae5f1', // Paisaje río montaña
    ],
    'zhangjiajie': [
      'photo-1513415756790-2ac1db1297d0', // Pilares Avatar niebla
      'photo-1501785888041-af3ef285b470', // Montaña verde cascada
      'photo-1472396961693-142e6e269027', // Bosque niebla mística
    ],
    'kunming': [
      'photo-1578632292335-df3abbb0d586', // Flores primavera
      'photo-1490750967868-88aa4f44baee', // Peonías flores color
      'photo-1418065460487-3e41a6c84dc5', // Lago tranquilo montaña
    ],
    'nanjing': [
      'photo-1599571234909-29ed5d1321d6', // Lago Xuanwu muralla
      'photo-1519125323398-675f0ddb6308', // Faroles rojos noche
      'photo-1533929736458-ca588d08c8be', // Mausoleo verde árboles
    ],
    'dunhuang': [
      'photo-1509023464722-18d996393ca8', // Dunas desierto atardecer
      'photo-1473580044384-7ba9967e16a0', // Arena dorada cielo
      'photo-1507400492013-162706c8c05e', // Camello caravana
    ],
    'sanya': [
      'photo-1510414842594-a61c69b5ae57', // Playa palmera tropical
      'photo-1519046904884-53103b34b206', // Mar turquesa arena
      'photo-1468413253725-0d5181091126', // Atardecer playa mar
    ],
    'pingyao': [
      'photo-1570366583862-f91883984fde', // Muralla faroles rojos
      'photo-1547573854-74d2a71d0826', // Comida callejera wok
      'photo-1551632436-cbf8dd35adfa', // Casa patio tradicional
    ],
    'shenzhen': [
      'photo-1598887142487-3c854d51eabb', // Skyline futurista
      'photo-1518770660439-4636190af475', // Electrónica circuitos
      'photo-1514933651103-005eec06c04b', // Bar nocturno luces
    ],
    'wuhan': [
      'photo-1637142989951-a1642bc6e6e4', // Torre Grulla Amarilla
      'photo-1522383225653-ed111181a951', // Cerezos flor rosa
      'photo-1569718212165-3a8278d5f624', // Tallarines ramen
    ],
    'qingdao': [
      'photo-1602940659805-770d1b3b9911', // Costa iglesia alemana
      'photo-1535958636474-b021ee887b13', // Cerveza rubia vaso
      'photo-1534854638093-bada1813ca19', // Vela velero mar
    ],
    'changsha': [
      'photo-1542051841857-5f90071e7989', // Ciudad neones noche
      'photo-1625220194771-7ebdea0b70b9', // Chile rojo picante
      'photo-1514214246283-d427a95c5d2f', // Río noche reflejos
    ],
    'tianjin': [
      'photo-1589920528975-56a5b5e8a4d7', // Ojo Tianjin noria
      'photo-1560185893-a55cbc8c57e8', // Concesión italiana
      'photo-1566127444979-b3d2b654e3d7', // Museo moderno
    ],
    'chengde': [
      'photo-1597562849543-87cc7e1f5e24', // Palacio imperial jardín
      'photo-1504109586057-71a966e7a6fd', // Templo budista oro
      'photo-1445543949571-ffc3e0e2f55e', // Montaña roca paisaje
    ],
    'huangshan': [
      'photo-1545569341-9eb8b30979d9', // Picos nubes pinos
      'photo-1486870591958-9b9d0d1dda99', // Amanecer mar nubes
      'photo-1540555700478-4be289fbec6d', // Aguas termales relax
    ],
    'fuzhou': [
      'photo-1591122947157-26bad3a117d2', // Templo chino rojo
      'photo-1556742049-0cfed4f6a45d', // Té jazmín porcelana
      'photo-1564399580075-5dfe19c205f0', // Edificio histórico
    ],
    'luoyang': [
      'photo-1547981609-4b6bfe67ca0b', // Grutas budas piedra
      'photo-1518611012118-696072aa579a', // Kung fu monje
      'photo-1457089328109-e5d9bd499191', // Flores peonías rosa
    ],
    'guiyang': [
      'photo-1528164344885-2ef3b0d69e0b', // Pueblo Miao montaña
      'photo-1432405972618-c6b0cfba8b03', // Cascada agua verde
      'photo-1519608487953-e999c86e7455', // Mercado nocturno luces
    ],
  };

  // Verify all 90 photos are unique
  const allPhotos = [];
  for (const photos of Object.values(cityGuidePhotos)) {
    allPhotos.push(...photos);
  }
  const uniquePhotos = new Set(allPhotos);
  console.log(`Pool: ${allPhotos.length} fotos, ${uniquePhotos.size} únicas`);
  if (allPhotos.length !== uniquePhotos.size) {
    // Find duplicates
    const seen = new Set();
    for (const p of allPhotos) {
      if (seen.has(p)) console.log(`  DUPE: ${p}`);
      seen.add(p);
    }
  }

  // Assign to guides
  const allCities = await City.find();
  let count = 0;
  for (const city of allCities) {
    const photos = cityGuidePhotos[city.slug];
    if (!photos) { console.log(`  ⚠ No photos for ${city.slug}`); continue; }
    const guides = await Ruta.find({ ciudad: city._id }).sort('createdAt');
    for (let i = 0; i < guides.length; i++) {
      const photoId = photos[i % photos.length];
      const url = `https://images.unsplash.com/${photoId}?w=800&q=80`;
      await Ruta.findByIdAndUpdate(guides[i]._id, { imagen: url });
      count++;
    }
  }
  console.log(`✅ ${count} guías actualizadas`);

  // Final verification
  const all = await Ruta.find({}, 'titulo imagen ciudad').populate('ciudad','nombre');
  const imgMap = {};
  for (const g of all) {
    const key = g.imagen?.split('?')[0];
    if (!imgMap[key]) imgMap[key] = [];
    imgMap[key].push(`${g.titulo} (${g.ciudad?.nombre})`);
  }
  let dupes = 0;
  for (const [img, gs] of Object.entries(imgMap)) {
    if (gs.length > 1) { dupes++; console.log(`  DUPE: ${img} -> ${gs.join(' | ')}`); }
  }
  console.log(dupes ? `\n⚠ ${dupes} duplicados restantes` : '\n✅ CERO duplicados — todas las guías tienen imagen única');

  process.exit(0);
};
run();
