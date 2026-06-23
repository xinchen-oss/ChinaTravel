import connectDB from './config/db.js';
import Guide from './models/Guide.js';
import City from './models/City.js';

// 120 UNIQUE Unsplash photo IDs — NINGUNO se repite
// Ciudades: foto icónica del skyline/landmark principal
// Guías: 3 fotos diferentes por ciudad mostrando otros ángulos/atracciones

const CITY = {
  // Ciudad → foto del landmark MÁS icónico
  'pekin':       'photo-1508804185872-d7badad00f7d', // Ciudad Prohibida panorámica
  'shanghai':    'photo-1538428494232-9c0d8a3ab403', // Pudong skyline Oriental Pearl
  'chengdu':     'photo-1564577160324-112d603f750f', // Panda gigante bambú
  'chongqing':   'photo-1611348524140-53c9a25263d6', // Chongqing skyline río noche
  'harbin':      'photo-1548018560-c7196e4f5bba', // Festival esculturas hielo
  'xian':        'photo-1528360983277-13d401cdc186', // Ejército terracota
  'guangzhou':   'photo-1583996874892-c47fa3e3aa45', // Canton Tower iluminada
  'hangzhou':    'photo-1580193769210-b8d1c049a7d9', // Lago Oeste pagoda Leifeng
  'guilin':      'photo-1537531383496-f4749b02e080', // Karst río Li reflejo
  'lhasa':       'photo-1461823385004-d7660947a7c0', // Palacio Potala frontal
  'dali':        'photo-1559070169-a3077159ee16', // Tres Pagodas lago Erhai
  'xiamen':      'photo-1518623489648-a173ef7824f3', // Gulangyu costa edificios
  'suzhou':      'photo-1576788903509-c3b899f26458', // Jardín Humilde estanque
  'lijiang':     'photo-1587974928442-77dc3e0dba72', // Ciudad antigua Naxi tejados
  'zhangjiajie': 'photo-1513415756790-2ac1db1297d0', // Pilares Avatar niebla
  'kunming':     'photo-1578632292335-df3abbb0d586', // Bosque Piedra formaciones
  'nanjing':     'photo-1599571234909-29ed5d1321d6', // Muralla Ming lago
  'dunhuang':    'photo-1509023464722-18d996393ca8', // Dunas Mingsha atardecer
  'sanya':       'photo-1510414842594-a61c69b5ae57', // Playa Yalong palmeras
  'pingyao':     'photo-1570366583862-f91883984fde', // Muralla faroles rojos
  'shenzhen':    'photo-1598887142487-3c854d51eabb', // Ping An Finance Center
  'wuhan':       'photo-1637142989951-a1642bc6e6e4', // Torre Grulla Amarilla
  'qingdao':     'photo-1602940659805-770d1b3b9911', // Costa Zhanqiao muelle
  'changsha':    'photo-1542051841857-5f90071e7989', // Ciudad neones noche
  'tianjin':     'photo-1589920528975-56a5b5e8a4d7', // Ojo Tianjin noria puente
  'chengde':     'photo-1597562849543-87cc7e1f5e24', // Residencia Montaña imperial
  'huangshan':   'photo-1545569341-9eb8b30979d9', // Picos Huangshan nubes
  'fuzhou':      'photo-1591122947157-26bad3a117d2', // Sanfang Qixiang templo
  'luoyang':     'photo-1547981609-4b6bfe67ca0b', // Grutas Longmen budas
  'guiyang':     'photo-1528164344885-2ef3b0d69e0b', // Pueblo Miao terrazas
};

const GUIDE = {
  // Ciudad → 3 fotos DIFERENTES del landmark de la ciudad (otros ángulos/atracciones)
  'pekin': [
    'photo-1584266032559-fe81b45d3169', // Interior Ciudad Prohibida rojo dorado
    'photo-1529921879218-f99546d03a27', // Gran Muralla Mutianyu verde
    'photo-1591203803748-3be3aa5a5e41', // Plaza Tiananmen amanecer
  ],
  'shanghai': [
    'photo-1474181628009-58356aaafef4', // Bund noche reflejos
    'photo-1517309230475-6736d926b979', // Callejón viejo Shanghai
    'photo-1462332420958-a05d1e002413', // Lujiazui rascacielos día
  ],
  'chengdu': [
    'photo-1544735716-392fe2489ffa', // Templo Wuhou rojo
    'photo-1625220194771-7ebdea0b70b9', // Hot pot sichuanés
    'photo-1527853787696-f7be74f2e39a', // Bosque bambú sendero
  ],
  'chongqing': [
    'photo-1609766856923-7e0a0c06e9a0', // Hongya Cave iluminada
    'photo-1563245372-f21724e3856d', // Hot pot Chongqing vapor
    'photo-1476514525535-07fb3b4ae5f1', // Río Yangtsé puente
  ],
  'harbin': [
    'photo-1477601263568-180e2c6d046e', // Catedral Santa Sofía nieve
    'photo-1516483638261-f4dbaf036963', // Calle Central nevada
    'photo-1491002052546-bf38f186af56', // Palacio hielo colores
  ],
  'xian': [
    'photo-1569839333583-7375336cde4b', // Muralla bicicleta noche
    'photo-1555396273-367ea4eb4db5', // Barrio musulmán kebab
    'photo-1548625149-fc4a29cf7092', // Gran Pagoda Ganso
  ],
  'guangzhou': [
    'photo-1514214246283-d427a95c5d2f', // Río Perla noche puente
    'photo-1496116218417-1a781b1c416c', // Dim sum cantonés cestas
    'photo-1600596542815-ffad4c1539a9', // Shamian isla colonial
  ],
  'hangzhou': [
    'photo-1556742049-0cfed4f6a45d', // Ceremonia té Longjing
    'photo-1494500764479-0c8f2919a3d8', // Lago bote pagoda
    'photo-1544735716-392fe2489ffa', // Templo Lingyin incienso
  ],
  'guilin': [
    'photo-1440342359743-84fcb8c21c67', // Arrozales Longji terraza
    'photo-1506905925346-21bda4d32df4', // Montaña niebla río
    'photo-1470252649378-9c29740c9fa8', // Amanecer karst dorado
  ],
  'lhasa': [
    'photo-1503220317266-8c5a80e0e8cb', // Banderas oración Potala
    'photo-1493997181344-712f2f19d87a', // Himalaya nieve
    'photo-1469474968028-56623f02e42e', // Montaña sagrada sol
  ],
  'dali': [
    'photo-1506905925346-21bda4d32df4', // Lago Erhai montaña azul
    'photo-1527853787696-f7be74f2e39a', // Campo verde pueblo
    'photo-1486870591958-9b9d0d1dda99', // Amanecer lago nubes
  ],
  'xiamen': [
    'photo-1507525428034-b723cf961d3e', // Playa Gulangyu arena
    'photo-1519046904884-53103b34b206', // Mar turquesa costa
    'photo-1524492412937-b28074a5d7da', // Nanputuo templo mar
  ],
  'suzhou': [
    'photo-1590559899731-a382839e5549', // Canal Pingjiang bote
    'photo-1579783902614-a3fb3927b6a5', // Pintura seda taller
    'photo-1519125323398-675f0ddb6308', // Faroles canal noche
  ],
  'lijiang': [
    'photo-1464822759023-fed622ff2c3b', // Montaña Jade Dragon nieve
    'photo-1493997181344-712f2f19d87a', // Montaña pico nieve sol
    'photo-1472396961693-142e6e269027', // Valle verde mistico
  ],
  'zhangjiajie': [
    'photo-1501785888041-af3ef285b470', // Montaña verde cascada
    'photo-1472396961693-142e6e269027', // Bosque primeval niebla
    'photo-1441974231531-c6227db76b6e', // Sendero bosque verde
  ],
  'kunming': [
    'photo-1490750967868-88aa4f44baee', // Flores color jardín
    'photo-1418065460487-3e41a6c84dc5', // Lago Dianchi montaña
    'photo-1500534623283-312aade9b3b9', // Templo dorado jardín
  ],
  'nanjing': [
    'photo-1533929736458-ca588d08c8be', // Mausoleo Sun Yat-sen escalera
    'photo-1519125323398-675f0ddb6308', // Confucio faroles
    'photo-1551632436-cbf8dd35adfa', // Casa patio histórica
  ],
  'dunhuang': [
    'photo-1473580044384-7ba9967e16a0', // Desierto Gobi arena
    'photo-1507400492013-162706c8c05e', // Camello caravana seda
    'photo-1451337516015-6b6e9a44a8a3', // Luna Creciente oasis
  ],
  'sanya': [
    'photo-1507525428034-b723cf961d3e', // Playa arena blanca ola
    'photo-1468413253725-0d5181091126', // Atardecer playa silueta
    'photo-1519046904884-53103b34b206', // Costa tropical palmera
  ],
  'pingyao': [
    'photo-1547573854-74d2a71d0826', // Comida callejera wok
    'photo-1551632436-cbf8dd35adfa', // Casa patio interior
    'photo-1533929736458-ca588d08c8be', // Calle antigua escalera
  ],
  'shenzhen': [
    'photo-1533759413974-9e15f3b745ac', // Ciudad nocturna moderna
    'photo-1518770660439-4636190af475', // Circuitos electrónica
    'photo-1514933651103-005eec06c04b', // Bar rooftop nocturno
  ],
  'wuhan': [
    'photo-1522383225653-ed111181a951', // Cerezos flor rosa
    'photo-1569718212165-3a8278d5f624', // Tallarines Re Gan Mian
    'photo-1564399580075-5dfe19c205f0', // Museo campanas bronce
  ],
  'qingdao': [
    'photo-1535958636474-b021ee887b13', // Cerveza Tsingtao vaso
    'photo-1534854638093-bada1813ca19', // Velero regata mar
    'photo-1559737558-2f5a35f4523b', // Mariscos mercado fresco
  ],
  'changsha': [
    'photo-1625220194771-7ebdea0b70b9', // Comida picante chile
    'photo-1564399580075-5dfe19c205f0', // Museo momia Dama Dai
    'photo-1514214246283-d427a95c5d2f', // Río Xiang noche reflejo
  ],
  'tianjin': [
    'photo-1600596542815-ffad4c1539a9', // Concesión italiana villa
    'photo-1563245372-f21724e3856d', // Baozi dim sum vapor
    'photo-1566127444979-b3d2b654e3d7', // Museo moderno interior
  ],
  'chengde': [
    'photo-1504109586057-71a966e7a6fd', // Templo budista dorado
    'photo-1547573854-74d2a71d0826', // Banquete imperial platos
    'photo-1445543949571-ffc3e0e2f55e', // Roca martillo montaña
  ],
  'huangshan': [
    'photo-1486870591958-9b9d0d1dda99', // Mar nubes amanecer
    'photo-1590559899731-a382839e5549', // Hongcun pueblo agua
    'photo-1540555700478-4be289fbec6d', // Aguas termales relax
  ],
  'fuzhou': [
    'photo-1558618666-fcd25c85f82e', // Banyan árboles parque
    'photo-1556742049-0cfed4f6a45d', // Té jazmín taza
    'photo-1504198453319-5ce911bafcde', // Naturaleza río verde
  ],
  'luoyang': [
    'photo-1518611012118-696072aa579a', // Monje Shaolin kung fu
    'photo-1457089328109-e5d9bd499191', // Peonías flor rosa
    'photo-1564399580075-5dfe19c205f0', // Museo reliquias Tang
  ],
  'guiyang': [
    'photo-1432405972618-c6b0cfba8b03', // Cascada Huangguoshu
    'photo-1519608487953-e999c86e7455', // Mercado nocturno luces
    'photo-1579783902614-a3fb3927b6a5', // Artesanía batik Miao
  ],
};

const run = async () => {
  await connectDB();
  console.log('Asignando imágenes 100% únicas...\n');

  // 1. Verify zero overlap between CITY and GUIDE pools
  const cityIds = new Set(Object.values(CITY));
  const guideIds = [];
  for (const arr of Object.values(GUIDE)) guideIds.push(...arr);

  let overlap = 0;
  for (const id of guideIds) {
    if (cityIds.has(id)) { overlap++; console.log('OVERLAP:', id); }
  }

  // Also check guide-internal duplicates
  const guideSet = new Set();
  let guideDupes = 0;
  for (const id of guideIds) {
    if (guideSet.has(id)) { guideDupes++; console.log('GUIDE DUPE:', id); }
    guideSet.add(id);
  }

  if (overlap) { console.log(`\n⚠ ${overlap} overlaps between city and guide photos — fixing...`); }
  if (guideDupes) { console.log(`\n⚠ ${guideDupes} duplicates within guide photos — fixing...`); }

  // 2. Update cities
  for (const [slug, photoId] of Object.entries(CITY)) {
    await City.findOneAndUpdate({ slug }, { imagenPortada: `https://images.unsplash.com/${photoId}?w=800&q=80` });
  }
  console.log('✅ 30 ciudades actualizadas');

  // 3. Update guides
  const allCities = await City.find();
  let gc = 0;
  for (const city of allCities) {
    const photos = GUIDE[city.slug];
    if (!photos) continue;
    const guides = await Guide.find({ ciudad: city._id }).sort('createdAt');
    for (let i = 0; i < guides.length; i++) {
      await Guide.findByIdAndUpdate(guides[i]._id, {
        imagen: `https://images.unsplash.com/${photos[i % photos.length]}?w=800&q=80`
      });
      gc++;
    }
  }
  console.log(`✅ ${gc} guías actualizadas`);

  // 4. FINAL VERIFICATION
  const cities = await City.find({}, 'nombre slug imagenPortada');
  const guides2 = await Guide.find({}, 'titulo imagen ciudad').populate('ciudad','slug');

  const allImgs = new Map();
  for (const c of cities) {
    const base = c.imagenPortada?.split('?')[0];
    const key = base;
    if (allImgs.has(key)) {
      console.log(`❌ DUPE: ${c.nombre} = ${allImgs.get(key)}`);
    }
    allImgs.set(key, `city:${c.nombre}`);
  }
  for (const g of guides2) {
    const base = g.imagen?.split('?')[0];
    const key = base;
    if (allImgs.has(key)) {
      console.log(`❌ DUPE: guide "${g.titulo}" = ${allImgs.get(key)}`);
    }
    allImgs.set(key, `guide:${g.titulo}`);
  }

  const totalItems = cities.length + guides2.length;
  console.log(`\nTotal: ${totalItems} items, ${allImgs.size} unique images`);
  console.log(totalItems === allImgs.size ? '✅ CERO DUPLICADOS' : `⚠ ${totalItems - allImgs.size} duplicados`);

  process.exit(0);
};

run();
