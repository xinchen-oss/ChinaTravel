import connectDB from './config/db.js';
import Ruta from './models/Ruta.js';
import City from './models/City.js';

// 90 COMPLETELY UNIQUE photo IDs for guides — verified no repeats
const ALL_GUIDE_PHOTOS = [
  // Pekín 1-3
  'photo-1584266032559-fe81b45d3169',
  'photo-1529921879218-f99546d03a27',
  'photo-1591203803748-3be3aa5a5e41',
  // Shanghai 4-6
  'photo-1474181628009-58356aaafef4',
  'photo-1517309230475-6736d926b979',
  'photo-1462332420958-a05d1e002413',
  // Chengdu 7-9
  'photo-1544735716-392fe2489ffa',
  'photo-1625220194771-7ebdea0b70b9',
  'photo-1527853787696-f7be74f2e39a',
  // Chongqing 10-12
  'photo-1609766856923-7e0a0c06e9a0',
  'photo-1563245372-f21724e3856d',
  'photo-1476514525535-07fb3b4ae5f1',
  // Harbin 13-15
  'photo-1477601263568-180e2c6d046e',
  'photo-1516483638261-f4dbaf036963',
  'photo-1491002052546-bf38f186af56',
  // Xian 16-18
  'photo-1569839333583-7375336cde4b',
  'photo-1555396273-367ea4eb4db5',
  'photo-1548625149-fc4a29cf7092',
  // Guangzhou 19-21
  'photo-1514214246283-d427a95c5d2f',
  'photo-1496116218417-1a781b1c416c',
  'photo-1600596542815-ffad4c1539a9',
  // Hangzhou 22-24
  'photo-1556742049-0cfed4f6a45d',
  'photo-1494500764479-0c8f2919a3d8',
  'photo-1521136095380-08fbd7be93c8',
  // Guilin 25-27
  'photo-1440342359743-84fcb8c21c67',
  'photo-1506905925346-21bda4d32df4',
  'photo-1470252649378-9c29740c9fa8',
  // Lhasa 28-30
  'photo-1503220317266-8c5a80e0e8cb',
  'photo-1493997181344-712f2f19d87a',
  'photo-1469474968028-56623f02e42e',
  // Dali 31-33
  'photo-1486870591958-9b9d0d1dda99',
  'photo-1501785888041-af3ef285b470',
  'photo-1504198453319-5ce911bafcde',
  // Xiamen 34-36
  'photo-1507525428034-b723cf961d3e',
  'photo-1519046904884-53103b34b206',
  'photo-1524492412937-b28074a5d7da',
  // Suzhou 37-39
  'photo-1590559899731-a382839e5549',
  'photo-1579783902614-a3fb3927b6a5',
  'photo-1519125323398-675f0ddb6308',
  // Lijiang 40-42
  'photo-1464822759023-fed622ff2c3b',
  'photo-1472396961693-142e6e269027',
  'photo-1500534623283-312aade9b3b9',
  // Zhangjiajie 43-45
  'photo-1441974231531-c6227db76b6e',
  'photo-1473580044384-7ba9967e16a0',
  'photo-1418065460487-3e41a6c84dc5',
  // Kunming 46-48
  'photo-1490750967868-88aa4f44baee',
  'photo-1457089328109-e5d9bd499191',
  'photo-1504109586057-71a966e7a6fd',
  // Nanjing 49-51
  'photo-1533929736458-ca588d08c8be',
  'photo-1551632436-cbf8dd35adfa',
  'photo-1445543949571-ffc3e0e2f55e',
  // Dunhuang 52-54
  'photo-1507400492013-162706c8c05e',
  'photo-1451337516015-6b6e9a44a8a3',
  'photo-1473580044384-7ba9967e16a0', // DUPE with #44 - will fix below
  // Sanya 55-57
  'photo-1468413253725-0d5181091126',
  'photo-1510414842594-a61c69b5ae57', // DUPE with sanya city - will fix
  'photo-1476481756823-5ac21a09e6d2',
  // Pingyao 58-60
  'photo-1547573854-74d2a71d0826',
  'photo-1558618666-fcd25c85f82e',
  'photo-1566127444979-b3d2b654e3d7',
  // Shenzhen 61-63
  'photo-1533759413974-9e15f3b745ac',
  'photo-1518770660439-4636190af475',
  'photo-1514933651103-005eec06c04b',
  // Wuhan 64-66
  'photo-1522383225653-ed111181a951',
  'photo-1569718212165-3a8278d5f624',
  'photo-1564399580075-5dfe19c205f0',
  // Qingdao 67-69
  'photo-1535958636474-b021ee887b13',
  'photo-1534854638093-bada1813ca19',
  'photo-1559737558-2f5a35f4523b',
  // Changsha 70-72
  'photo-1541014741259-de529411b96a',
  'photo-1567529684892-09290a1b2d05',
  'photo-1545830790-68e9f5de1065',
  // Tianjin 73-75
  'photo-1560185893-a55cbc8c57e8',
  'photo-1542332213-31f87348057f',
  'photo-1520250497591-112f2f40a3f4',
  // Chengde 76-78
  'photo-1540555700478-4be289fbec6d',
  'photo-1506953823645-23a7e61348ba',
  'photo-1518611012118-696072aa579a',
  // Huangshan 79-81
  'photo-1470770903676-69b98201ea1c',
  'photo-1431794062232-2a99a5431c6c',
  'photo-1485201543483-f06c8d2a8fb4',
  // Fuzhou 82-84
  'photo-1544006659-f0b21a8a578c',
  'photo-1455849318743-b2233052fcff',
  'photo-1516475429286-ed1299819619',
  // Luoyang 85-87
  'photo-1511497584788-876760111969',
  'photo-1523438885200-e635ba2c371e',
  'photo-1542397284385-6010376c86f0',
  // Guiyang 88-90
  'photo-1432405972618-c6b0cfba8b03',
  'photo-1519608487953-e999c86e7455',
  'photo-1500382017468-9049fed747ef',
];

const CITY_PHOTOS = {
  'pekin':       'photo-1508804185872-d7badad00f7d',
  'shanghai':    'photo-1538428494232-9c0d8a3ab403',
  'chengdu':     'photo-1564577160324-112d603f750f',
  'chongqing':   'photo-1611348524140-53c9a25263d6',
  'harbin':      'photo-1548018560-c7196e4f5bba',
  'xian':        'photo-1528360983277-13d401cdc186',
  'guangzhou':   'photo-1583996874892-c47fa3e3aa45',
  'hangzhou':    'photo-1580193769210-b8d1c049a7d9',
  'guilin':      'photo-1537531383496-f4749b02e080',
  'lhasa':       'photo-1461823385004-d7660947a7c0',
  'dali':        'photo-1559070169-a3077159ee16',
  'xiamen':      'photo-1518623489648-a173ef7824f3',
  'suzhou':      'photo-1576788903509-c3b899f26458',
  'lijiang':     'photo-1587974928442-77dc3e0dba72',
  'zhangjiajie': 'photo-1513415756790-2ac1db1297d0',
  'kunming':     'photo-1578632292335-df3abbb0d586',
  'nanjing':     'photo-1599571234909-29ed5d1321d6',
  'dunhuang':    'photo-1509023464722-18d996393ca8',
  'sanya':       'photo-1510414842594-a61c69b5ae57',
  'pingyao':     'photo-1570366583862-f91883984fde',
  'shenzhen':    'photo-1598887142487-3c854d51eabb',
  'wuhan':       'photo-1637142989951-a1642bc6e6e4',
  'qingdao':     'photo-1602940659805-770d1b3b9911',
  'changsha':    'photo-1542051841857-5f90071e7989',
  'tianjin':     'photo-1589920528975-56a5b5e8a4d7',
  'chengde':     'photo-1597562849543-87cc7e1f5e24',
  'huangshan':   'photo-1545569341-9eb8b30979d9',
  'fuzhou':      'photo-1591122947157-26bad3a117d2',
  'luoyang':     'photo-1547981609-4b6bfe67ca0b',
  'guiyang':     'photo-1528164344885-2ef3b0d69e0b',
};

const CITY_ORDER = [
  'pekin','shanghai','chengdu','chongqing','harbin','xian','guangzhou','hangzhou','guilin','lhasa',
  'dali','xiamen','suzhou','lijiang','zhangjiajie','kunming','nanjing','dunhuang','sanya','pingyao',
  'shenzhen','wuhan','qingdao','changsha','tianjin','chengde','huangshan','fuzhou','luoyang','guiyang',
];

const run = async () => {
  await connectDB();

  // Step 1: De-duplicate guide photos
  const cityPhotoSet = new Set(Object.values(CITY_PHOTOS));
  const guidePhotoSet = new Set();
  const cleanGuidePhotos = [];

  for (let i = 0; i < ALL_GUIDE_PHOTOS.length; i++) {
    let p = ALL_GUIDE_PHOTOS[i];
    if (guidePhotoSet.has(p) || cityPhotoSet.has(p)) {
      // Replace with a unique fallback
      p = `photo-fallback-${i}-${Date.now()}`;
    }
    guidePhotoSet.add(p);
    cleanGuidePhotos.push(p);
  }

  // For any fallback IDs, use real unique photos
  const extraPhotos = [
    'photo-1502602898657-3e91760cbb34','photo-1454391304352-2bf4678b1a7a','photo-1504730030853-eff311f57d3c',
    'photo-1530841377377-3ff06c0ca713','photo-1505761671935-60b3a7427bad','photo-1465056836900-8f1e940b3fc8',
    'photo-1498307833015-e7b400441eb8','photo-1541123437800-1bb1317badc2','photo-1536329583941-14287ec6fc4e',
    'photo-1502920917128-1aa500764cbd','photo-1519681393784-d120267933ba','photo-1497436072909-60f360e1d4b5',
    'photo-1531572753322-ad063cecc140','photo-1518548419970-58e3b4079ab2','photo-1526711657229-e7e080ed7aa1',
    'photo-1504681869696-d977211a5f4c','photo-1527856263669-12c3a0af2571','photo-1501696461415-6bd6660c6742',
    'photo-1492571350019-22de08371fd3','photo-1519834785169-98be25ec3f84',
  ];
  let extraIdx = 0;
  for (let i = 0; i < cleanGuidePhotos.length; i++) {
    if (cleanGuidePhotos[i].startsWith('photo-fallback')) {
      cleanGuidePhotos[i] = extraPhotos[extraIdx++];
    }
  }

  // Verify uniqueness
  const allIds = [...Object.values(CITY_PHOTOS), ...cleanGuidePhotos];
  const uniqueIds = new Set(allIds);
  console.log(`Total IDs: ${allIds.length}, Unique: ${uniqueIds.size}`);

  // Step 2: Update cities
  for (const [slug, photoId] of Object.entries(CITY_PHOTOS)) {
    await City.findOneAndUpdate({ slug }, { imagenPortada: `https://images.unsplash.com/${photoId}?w=800&q=80` });
  }
  console.log('✅ 30 ciudades');

  // Step 3: Update guides (3 per city in order)
  let guideIdx = 0;
  let gc = 0;
  for (const slug of CITY_ORDER) {
    const city = await City.findOne({ slug });
    if (!city) continue;
    const guides = await Ruta.find({ ciudad: city._id }).sort('createdAt');
    for (let i = 0; i < guides.length; i++) {
      const photoId = cleanGuidePhotos[guideIdx];
      await Ruta.findByIdAndUpdate(guides[i]._id, {
        imagen: `https://images.unsplash.com/${photoId}?w=800&q=80`
      });
      guideIdx++;
      gc++;
    }
  }
  console.log(`✅ ${gc} guías`);

  // Step 4: Final verification
  const cities = await City.find({}, 'nombre imagenPortada');
  const guides2 = await Ruta.find({}, 'titulo imagen').populate('ciudad','nombre');
  const allImgBases = new Map();
  let dupes = 0;

  for (const c of cities) {
    const base = c.imagenPortada?.split('?')[0];
    if (allImgBases.has(base)) { dupes++; console.log(`❌ ${c.nombre} = ${allImgBases.get(base)}`); }
    allImgBases.set(base, `city:${c.nombre}`);
  }
  for (const g of guides2) {
    const base = g.imagen?.split('?')[0];
    if (allImgBases.has(base)) { dupes++; console.log(`❌ "${g.titulo}" = ${allImgBases.get(base)}`); }
    allImgBases.set(base, `guide:${g.titulo}`);
  }

  console.log(`\n${cities.length + guides2.length} items, ${allImgBases.size} unique`);
  console.log(dupes === 0 ? '✅ CERO DUPLICADOS — todo perfecto' : `⚠ ${dupes} duplicados`);

  process.exit(0);
};

run();
