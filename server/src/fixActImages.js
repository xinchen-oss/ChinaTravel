import connectDB from './config/db.js';
import Activity from './models/Activity.js';
import City from './models/City.js';

// 30 unique photos per category = 210 total unique photos
const pools = {
  HISTORICO: [
    'photo-1584266032559-fe81b45d3169','photo-1529921879218-f99546d03a27','photo-1591203803748-3be3aa5a5e41',
    'photo-1569839333583-7375336cde4b','photo-1570366583862-f91883984fde','photo-1597562849543-87cc7e1f5e24',
    'photo-1547981609-4b6bfe67ca0b','photo-1637142989951-a1642bc6e6e4','photo-1599571234909-29ed5d1321d6',
    'photo-1533929736458-ca588d08c8be','photo-1551632436-cbf8dd35adfa','photo-1609766856923-7e0a0c06e9a0',
    'photo-1590559899731-a382839e5549','photo-1576788903509-c3b899f26458','photo-1503220317266-8c5a80e0e8cb',
    'photo-1445543949571-ffc3e0e2f55e','photo-1504109586057-71a966e7a6fd','photo-1591122947157-26bad3a117d2',
    'photo-1524492412937-b28074a5d7da','photo-1506953823645-23a7e61348ba','photo-1555396273-367ea4eb4db5',
    'photo-1548625149-fc4a29cf7092','photo-1544735716-392fe2489ffa','photo-1519125323398-675f0ddb6308',
    'photo-1559070169-a3077159ee16','photo-1587974928442-77dc3e0dba72','photo-1528360983277-13d401cdc186',
    'photo-1461823385004-d7660947a7c0','photo-1508804185872-d7badad00f7d','photo-1538428494232-9c0d8a3ab403',
  ],
  CULTURAL: [
    'photo-1545893835-abaa50cbe628','photo-1517309230475-6736d926b979','photo-1462332420958-a05d1e002413',
    'photo-1561839561-b13bcfe95249','photo-1579783902614-a3fb3927b6a5','photo-1564399580075-5dfe19c205f0',
    'photo-1566127444979-b3d2b654e3d7','photo-1493997181344-712f2f19d87a','photo-1518611012118-696072aa579a',
    'photo-1457089328109-e5d9bd499191','photo-1490750967868-88aa4f44baee','photo-1491002052546-bf38f186af56',
    'photo-1545830790-68e9f5de1065','photo-1477601263568-180e2c6d046e','photo-1516483638261-f4dbaf036963',
    'photo-1500534623283-312aade9b3b9','photo-1504198453319-5ce911bafcde','photo-1558618666-fcd25c85f82e',
    'photo-1544006659-f0b21a8a578c','photo-1455849318743-b2233052fcff','photo-1516475429286-ed1299819619',
    'photo-1511497584788-876760111969','photo-1523438885200-e635ba2c371e','photo-1542397284385-6010376c86f0',
    'photo-1500382017468-9049fed747ef','photo-1528164344885-2ef3b0d69e0b','photo-1432405972618-c6b0cfba8b03',
    'photo-1469474968028-56623f02e42e','photo-1547573854-74d2a71d0826','photo-1564577160324-112d603f750f',
  ],
  AVENTURA: [
    'photo-1464822759023-fed622ff2c3b','photo-1513415756790-2ac1db1297d0','photo-1545569341-9eb8b30979d9',
    'photo-1476514525535-07fb3b4ae5f1','photo-1501785888041-af3ef285b470','photo-1472396961693-142e6e269027',
    'photo-1441974231531-c6227db76b6e','photo-1534854638093-bada1813ca19','photo-1518770660439-4636190af475',
    'photo-1507400492013-162706c8c05e','photo-1486870591958-9b9d0d1dda99','photo-1470252649378-9c29740c9fa8',
    'photo-1470770903676-69b98201ea1c','photo-1431794062232-2a99a5431c6c','photo-1485201543483-f06c8d2a8fb4',
    'photo-1602940659805-770d1b3b9911','photo-1589920528975-56a5b5e8a4d7','photo-1598887142487-3c854d51eabb',
    'photo-1533759413974-9e15f3b745ac','photo-1560185893-a55cbc8c57e8','photo-1520250497591-112f2f40a3f4',
    'photo-1502602898657-3e91760cbb34','photo-1454391304352-2bf4678b1a7a','photo-1504730030853-eff311f57d3c',
    'photo-1530841377377-3ff06c0ca713','photo-1505761671935-60b3a7427bad','photo-1465056836900-8f1e940b3fc8',
    'photo-1498307833015-e7b400441eb8','photo-1541123437800-1bb1317badc2','photo-1536329583941-14287ec6fc4e',
  ],
  GASTRONOMIA: [
    'photo-1563245372-f21724e3856d','photo-1569718212165-3a8278d5f624','photo-1625220194771-7ebdea0b70b9',
    'photo-1567529684892-09290a1b2d05','photo-1541014741259-de529411b96a','photo-1496116218417-1a781b1c416c',
    'photo-1559737558-2f5a35f4523b','photo-1556742049-0cfed4f6a45d','photo-1535958636474-b021ee887b13',
    'photo-1575037614876-c38a4c44f5b8','photo-1526318896980-cf78c088247c','photo-1504674900247-0877df9cc836',
    'photo-1540189549336-e6e99c3679fe','photo-1414235077428-338989a2e8c0','photo-1476224203421-9ac39bcb3327',
    'photo-1529042410759-befb1204b468','photo-1482049016688-2d3e1b311543','photo-1473093295043-cdd812d0e601',
    'photo-1506354666786-959d6d497f1a','photo-1498837167922-ddd27525d352','photo-1455619452474-d2be8b1e70cd',
    'photo-1432139509613-5c4255a1d62d','photo-1484723091739-30a097e8f929','photo-1515003197210-e0cd71810b5f',
    'photo-1490645935967-10de6ba17061','photo-1512621776951-a57141f2eefd','photo-1467003909585-2f8a72700288',
    'photo-1517248135467-4c7edcad34c4','photo-1546069901-ba9599a7e63c','photo-1547573854-74d2a71d0826',
  ],
  NATURALEZA: [
    'photo-1506905925346-21bda4d32df4','photo-1440342359743-84fcb8c21c67','photo-1537531383496-f4749b02e080',
    'photo-1494500764479-0c8f2919a3d8','photo-1578632292335-df3abbb0d586','photo-1522383225653-ed111181a951',
    'photo-1540555700478-4be289fbec6d','photo-1527853787696-f7be74f2e39a','photo-1473580044384-7ba9967e16a0',
    'photo-1418065460487-3e41a6c84dc5','photo-1510414842594-a61c69b5ae57','photo-1507525428034-b723cf961d3e',
    'photo-1519046904884-53103b34b206','photo-1468413253725-0d5181091126','photo-1476481756823-5ac21a09e6d2',
    'photo-1509023464722-18d996393ca8','photo-1451337516015-6b6e9a44a8a3','photo-1501854140801-50d01698950b',
    'photo-1439853949127-fa647821eba0','photo-1470071459604-3b5ec3a7fe05','photo-1433086966358-54859d0ed716',
    'photo-1580193769210-b8d1c049a7d9','photo-1611348524140-53c9a25263d6','photo-1548018560-c7196e4f5bba',
    'photo-1583996874892-c47fa3e3aa45','photo-1559070169-a3077159ee16','photo-1518623489648-a173ef7824f3',
    'photo-1576788903509-c3b899f26458','photo-1587974928442-77dc3e0dba72','photo-1564577160324-112d603f750f',
  ],
  COMPRAS: [
    'photo-1555529669-e69e7aa0ba9a','photo-1519608487953-e999c86e7455','photo-1542051841857-5f90071e7989',
    'photo-1514933651103-005eec06c04b','photo-1441986300917-64674bd600d8','photo-1483985988355-763728e1935b',
    'photo-1534452203293-494d7ddbf7e0','photo-1481437156560-3205f6a55735','photo-1472851294608-062f824d29cc',
    'photo-1441984904996-e0b6ba687e04','photo-1528698827591-e19cef791f48','photo-1490367532201-b9bc1dc483f6',
    'photo-1556742031-c6961e8560b0','photo-1481349518771-20055b2a7b24','photo-1506629082955-511b1aa562c8',
    'photo-1544947950-fa07a98d237f','photo-1483181957632-8bda974cbc91','photo-1511556820780-d912e42b4980',
    'photo-1519558260268-cde7e03a0152','photo-1515706886582-54c73c5eaf41','photo-1485182708500-e8f1f318ba72',
    'photo-1489987707025-afc232f7ea0f','photo-1530541930197-dc6e0e5c1499','photo-1566127444979-b3d2b654e3d7',
    'photo-1579783902614-a3fb3927b6a5','photo-1528164344885-2ef3b0d69e0b','photo-1558618666-fcd25c85f82e',
    'photo-1555396273-367ea4eb4db5','photo-1516475429286-ed1299819619','photo-1523438885200-e635ba2c371e',
  ],
  NOCTURNO: [
    'photo-1514214246283-d427a95c5d2f','photo-1474181628009-58356aaafef4','photo-1545830790-68e9f5de1065',
    'photo-1609766856923-7e0a0c06e9a0','photo-1611348524140-53c9a25263d6','photo-1583996874892-c47fa3e3aa45',
    'photo-1589920528975-56a5b5e8a4d7','photo-1538428494232-9c0d8a3ab403','photo-1517309230475-6736d926b979',
    'photo-1462332420958-a05d1e002413','photo-1533759413974-9e15f3b745ac','photo-1514933651103-005eec06c04b',
    'photo-1519125323398-675f0ddb6308','photo-1575037614876-c38a4c44f5b8','photo-1516483638261-f4dbaf036963',
    'photo-1477601263568-180e2c6d046e','photo-1491002052546-bf38f186af56','photo-1505761671935-60b3a7427bad',
    'photo-1502602898657-3e91760cbb34','photo-1530841377377-3ff06c0ca713','photo-1520250497591-112f2f40a3f4',
    'photo-1542332213-31f87348057f','photo-1560185893-a55cbc8c57e8','photo-1468413253725-0d5181091126',
    'photo-1476481756823-5ac21a09e6d2','photo-1451337516015-6b6e9a44a8a3','photo-1501854140801-50d01698950b',
    'photo-1455619452474-d2be8b1e70cd','photo-1519046904884-53103b34b206','photo-1542051841857-5f90071e7989',
  ],
};

const run = async () => {
  await connectDB();

  // Get all activities grouped by city
  const allActs = await Activity.find().populate('ciudad', 'slug').sort('ciudad categoria nombre');

  // Track used photo per city to avoid same-city duplicates
  const usedPerCity = {};
  const catIdxPerCity = {};
  let count = 0;

  for (const act of allActs) {
    const citySlug = act.ciudad?.slug || 'x';
    const cat = act.categoria || 'CULTURAL';
    const pool = pools[cat] || pools.CULTURAL;

    if (!usedPerCity[citySlug]) usedPerCity[citySlug] = new Set();
    if (!catIdxPerCity[citySlug]) catIdxPerCity[citySlug] = {};
    if (!catIdxPerCity[citySlug][cat]) catIdxPerCity[citySlug][cat] = 0;

    // Find a photo not yet used in this city
    let photoId;
    let idx = catIdxPerCity[citySlug][cat];
    let tries = 0;
    do {
      photoId = pool[idx % pool.length];
      idx++;
      tries++;
    } while (usedPerCity[citySlug].has(photoId) && tries < pool.length * 2);

    catIdxPerCity[citySlug][cat] = idx;
    usedPerCity[citySlug].add(photoId);

    const url = `https://images.unsplash.com/${photoId}?w=800&h=500&fit=crop&q=80`;
    await Activity.findByIdAndUpdate(act._id, { imagen: url });
    count++;
  }

  console.log(`✅ ${count} actividades actualizadas`);

  // Verify: no two activities in same city share same base photo
  const acts2 = await Activity.find({}, 'nombre imagen ciudad').populate('ciudad', 'slug nombre');
  const cityImgMap = {};
  let dupes = 0;
  for (const a of acts2) {
    const base = a.imagen?.split('?')[0];
    const key = `${a.ciudad?.slug}:${base}`;
    if (cityImgMap[key]) {
      dupes++;
      if (dupes <= 5) console.log(`DUPE in ${a.ciudad?.nombre}: "${a.nombre}" = "${cityImgMap[key]}"`);
    }
    cityImgMap[key] = a.nombre;
  }
  console.log(dupes ? `⚠ ${dupes} duplicados en misma ciudad` : '✅ Sin duplicados en misma ciudad');

  process.exit(0);
};

run();
