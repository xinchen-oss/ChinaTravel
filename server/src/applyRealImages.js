import connectDB from './config/db.js';
import City from './models/City.js';
import Guide from './models/Guide.js';
import Activity from './models/Activity.js';

const U = (id) => `https://images.unsplash.com/${id}?w=800&q=80`;

// ALL verified working Unsplash photo IDs
const CITY_IMG = {
  'pekin':       'photo-1518043289926-4d836511e381',
  'shanghai':    'photo-1499260126922-fbb24624a4e8',
  'chengdu':     'photo-1516708274537-6f91e34ccaf2',
  'chongqing':   'photo-1708885819756-a1afd6ac6008',
  'harbin':      'photo-1553966528-237ab71fb292',
  'xian':        'photo-1659466248885-8b7a03205661',
  'guangzhou':   'photo-1585669666867-f4eee227eb04',
  'hangzhou':    'photo-1666138736930-a98c0dcb9914',
  'guilin':      'photo-1740103874612-fba347aa1e98',
  'lhasa':       'photo-1626359909709-8067b64e1655',
  'dali':        'photo-1627868153411-624a8dce0a12',
  'xiamen':      'photo-1445247484843-b57c04d06d2a',
  'suzhou':      'photo-1713678849633-f848d7c17f7a',
  'lijiang':     'photo-1637872937209-e1a5ccdc90cc',
  'zhangjiajie': 'photo-1748048905242-0e840b0438b5',
  'kunming':     'photo-1483651646696-c1b5fe39fc0e',
  'nanjing':     'photo-1734941507780-5df13983a3fd',
  'dunhuang':    'photo-1571821807771-62cf66ac3f14',
  'sanya':       'photo-1634264003328-55b1f4ab33c9',
  'pingyao':     'photo-1462473325456-4dbb7490895f',
  'shenzhen':    'photo-1634647626758-ad751a260e9f',
  'wuhan':       'photo-1582554708233-d04581f41460',
  'qingdao':     'photo-1743454343491-42e2ae02c6e6',
  'changsha':    'photo-1628006565830-9ac355e293db',
  'tianjin':     'photo-1678097624468-9b17e0da9fe7',
  'chengde':     'photo-1714057863381-db1833b7a554',
  'huangshan':   'photo-1770838917379-32208420ea9a',
  'fuzhou':      'photo-1739108951069-15082523ecb7',
  'luoyang':     'photo-1766924379586-84822d373dc0',
  'guiyang':     'photo-1535712663823-d1f48c3dd71e',
};

const GUIDE_IMG = {
  'pekin':       ['photo-1772551764676-5b057df4aae2','photo-1758220824544-08877c5a774b','photo-1517147763025-9aedcd945208'],
  'shanghai':    ['photo-1741085908649-f143f3fa801f','photo-1744274742612-763d6ae5d82f','photo-1603525846431-ac38a7775754'],
  'chengdu':     ['photo-1603459771691-d4022336e755','photo-1618778818805-ec9020b1db0c','photo-1666039909197-bcff88865eee'],
  'chongqing':   ['photo-1753724933350-c2e0e2990445','photo-1611345157614-26d3bdd10c93','photo-1459664018906-085c36f472af'],
  'harbin':      ['photo-1716308259016-8424849dc156','photo-1459695452562-46cc57bef5f6','photo-1553966528-237ab71fb292'],
  'xian':        ['photo-1769436276040-42aa17e377c5','photo-1690303129179-8c9720d4656d','photo-1598538982410-c86b30005fb4'],
  'guangzhou':   ['photo-1773820681050-0a836221436a','photo-1729944450711-b9b8cedbefc7','photo-1607420412713-d0da47a8fdf3'],
  'hangzhou':    ['photo-1483519173755-be893fab1f46','photo-1496664444929-8c75efb9546f','photo-1659364310785-6561d4187331'],
  'guilin':      ['photo-1669588456774-c0e837c8e620','photo-1516552738845-be712b622f24','photo-1563090162-6b4c2a20d658'],
  'lhasa':       ['photo-1501630834273-4b5604d2ee31','photo-1580979443365-6bb3f7b1833f','photo-1461280360983-bd93eaa5051b'],
  'dali':        ['photo-1692123582366-4c488ca2991b','photo-1683659636705-a028691fa4de','photo-1694355045197-276c3c72672e'],
  'xiamen':      ['photo-1736001655191-f653be87489c','photo-1744230996149-24091d45ffc2','photo-1734333107778-10d55be0d436'],
  'suzhou':      ['photo-1750002641636-2ee65daf28a3','photo-1606913209102-a51910ba83cf','photo-1764773975501-5fbaaa92f3fa'],
  'lijiang':     ['photo-1660359097012-39da27c7333b','photo-1627974629992-47e19a3edb06','photo-1585770657230-f5ec55a8c05b'],
  'zhangjiajie': ['photo-1594260042522-bed743782f39','photo-1733169128556-6faa85ba76e1','photo-1529027288157-572df421f425'],
  'kunming':     ['photo-1730688760692-ad739faa850e','photo-1672841930119-1dda32e34ce9','photo-1483651646696-c1b5fe39fc0e'],
  'nanjing':     ['photo-1651237491940-9a77040f2219','photo-1531914119713-a7e7f830e617','photo-1585002508158-aba1a0eaa8ba'],
  'dunhuang':    ['photo-1772657356280-fefe4c350287','photo-1615747476205-991a14cd2358','photo-1571821807771-62cf66ac3f14'],
  'sanya':       ['photo-1576568699714-a3f4950805d5','photo-1534008897995-27a23e859048','photo-1669290213786-524812cc8fbf'],
  'pingyao':     ['photo-1688261218652-08457c6aa726','photo-1500462918059-b1a0cb512f1d','photo-1462473325456-4dbb7490895f'],
  'shenzhen':    ['photo-1766021736538-3208f2ad05f2','photo-1773772255047-74744067601e','photo-1564514157826-2761e85d6152'],
  'wuhan':       ['photo-1453167710320-151adc31f6d5','photo-1416169607655-0c2b3ce2e1cc','photo-1720016790842-fdb884267947'],
  'qingdao':     ['photo-1575023782549-62ca0d244b39','photo-1706244978503-5e7ceb4c6e35','photo-1572278116640-337bc3c3b8ae'],
  'changsha':    ['photo-1654930454016-d05a25c6c7f6','photo-1682328932063-1dda022c1e4b','photo-1628006565830-9ac355e293db'],
  'tianjin':     ['photo-1634188023730-2a607e9c27a2','photo-1566132127167-c6291d242ece','photo-1678097624468-9b17e0da9fe7'],
  'chengde':     ['photo-1773191262775-4645f48bfe42','photo-1714057863381-db1833b7a554','photo-1461280360983-bd93eaa5051b'],
  'huangshan':   ['photo-1768250161138-a63d692ef2a8','photo-1612171181961-d8ac6c52dff1','photo-1647470569180-30551be29a2c'],
  'fuzhou':      ['photo-1739964552379-aff15e2580f9','photo-1531969179221-3946e6b5a5e7','photo-1526374073174-7661a8028eb4'],
  'luoyang':     ['photo-1769925315807-c2f0b76769f2','photo-1543160058-bb08f2f22c21','photo-1646954640942-25bf3047e5e6'],
  'guiyang':     ['photo-1559807658-b336cd77d6ab','photo-1689152336634-8e8da1a1177f','photo-1535712663823-d1f48c3dd71e'],
};

// Large pool of verified working photos for activities, by category
const ACT_POOL = {
  HISTORICO: [
    'photo-1518043289926-4d836511e381','photo-1772551764676-5b057df4aae2','photo-1758220824544-08877c5a774b',
    'photo-1517147763025-9aedcd945208','photo-1659466248885-8b7a03205661','photo-1769436276040-42aa17e377c5',
    'photo-1598538982410-c86b30005fb4','photo-1462473325456-4dbb7490895f','photo-1688261218652-08457c6aa726',
    'photo-1500462918059-b1a0cb512f1d','photo-1582554708233-d04581f41460','photo-1734941507780-5df13983a3fd',
    'photo-1651237491940-9a77040f2219','photo-1531914119713-a7e7f830e617','photo-1585002508158-aba1a0eaa8ba',
    'photo-1714057863381-db1833b7a554','photo-1773191262775-4645f48bfe42','photo-1766924379586-84822d373dc0',
    'photo-1586784444981-ac96e335555c','photo-1603120527222-33f28c2ce89e','photo-1547981609-4b6bfe67ca0b',
    'photo-1532690671373-229d09573d2e','photo-1748180689500-3066301a942f','photo-1701668910380-b44dcc028525',
    'photo-1626359909709-8067b64e1655','photo-1580979443365-6bb3f7b1833f','photo-1627868153411-624a8dce0a12',
    'photo-1637872937209-e1a5ccdc90cc','photo-1666039909197-bcff88865eee','photo-1543160058-bb08f2f22c21',
  ],
  CULTURAL: [
    'photo-1690303129179-8c9720d4656d','photo-1603459771691-d4022336e755','photo-1744274742612-763d6ae5d82f',
    'photo-1496664444929-8c75efb9546f','photo-1659364310785-6561d4187331','photo-1501630834273-4b5604d2ee31',
    'photo-1627974629992-47e19a3edb06','photo-1606913209102-a51910ba83cf','photo-1744230996149-24091d45ffc2',
    'photo-1559807658-b336cd77d6ab','photo-1646954640942-25bf3047e5e6','photo-1526374073174-7661a8028eb4',
    'photo-1739964552379-aff15e2580f9','photo-1682328932063-1dda022c1e4b','photo-1564514157826-2761e85d6152',
    'photo-1739108951069-15082523ecb7','photo-1694355045197-276c3c72672e','photo-1563090162-6b4c2a20d658',
    'photo-1585770657230-f5ec55a8c05b','photo-1506158669146-619067262a00','photo-1516648176391-a4de4541db51',
    'photo-1566487097168-e91a4f38bee2','photo-1617259111909-a776d5969b17','photo-1757207445743-cde69fab87b4',
    'photo-1709560331476-94206986273c','photo-1613902260357-f5e11151d2bb','photo-1769925315807-c2f0b76769f2',
    'photo-1689152336634-8e8da1a1177f','photo-1672841930119-1dda32e34ce9','photo-1768250161138-a63d692ef2a8',
  ],
  AVENTURA: [
    'photo-1748048905242-0e840b0438b5','photo-1594260042522-bed743782f39','photo-1733169128556-6faa85ba76e1',
    'photo-1529027288157-572df421f425','photo-1770838917379-32208420ea9a','photo-1612171181961-d8ac6c52dff1',
    'photo-1660359097012-39da27c7333b','photo-1459695452562-46cc57bef5f6','photo-1572278116640-337bc3c3b8ae',
    'photo-1766021736538-3208f2ad05f2','photo-1706244978503-5e7ceb4c6e35','photo-1534854638093-bada1813ca19',
    'photo-1461280360983-bd93eaa5051b','photo-1683659636705-a028691fa4de','photo-1692123582366-4c488ca2991b',
    'photo-1516552738845-be712b622f24','photo-1740103874612-fba347aa1e98','photo-1669588456774-c0e837c8e620',
    'photo-1483651646696-c1b5fe39fc0e','photo-1730688760692-ad739faa850e','photo-1647470569180-30551be29a2c',
    'photo-1764773975501-5fbaaa92f3fa','photo-1750002641636-2ee65daf28a3','photo-1534008897995-27a23e859048',
    'photo-1669290213786-524812cc8fbf','photo-1720016790842-fdb884267947','photo-1459664018906-085c36f472af',
    'photo-1445247484843-b57c04d06d2a','photo-1736001655191-f653be87489c','photo-1734333107778-10d55be0d436',
  ],
  GASTRONOMIA: [
    'photo-1618778818805-ec9020b1db0c','photo-1611345157614-26d3bdd10c93','photo-1773820681050-0a836221436a',
    'photo-1654930454016-d05a25c6c7f6','photo-1634188023730-2a607e9c27a2','photo-1416169607655-0c2b3ce2e1cc',
    'photo-1575023782549-62ca0d244b39','photo-1559737558-2f5a35f4523b','photo-1531969179221-3946e6b5a5e7',
    'photo-1483519173755-be893fab1f46','photo-1556742049-0cfed4f6a45d','photo-1576568699714-a3f4950805d5',
    'photo-1615747476205-991a14cd2358','photo-1772657356280-fefe4c350287','photo-1607420412713-d0da47a8fdf3',
    'photo-1516708274537-6f91e34ccaf2','photo-1603525846431-ac38a7775754','photo-1741085908649-f143f3fa801f',
    'photo-1708885819756-a1afd6ac6008','photo-1753724933350-c2e0e2990445','photo-1499260126922-fbb24624a4e8',
    'photo-1585669666867-f4eee227eb04','photo-1729944450711-b9b8cedbefc7','photo-1666138736930-a98c0dcb9914',
    'photo-1634264003328-55b1f4ab33c9','photo-1553966528-237ab71fb292','photo-1716308259016-8424849dc156',
    'photo-1628006565830-9ac355e293db','photo-1566132127167-c6291d242ece','photo-1713678849633-f848d7c17f7a',
  ],
  NATURALEZA: [
    'photo-1740103874612-fba347aa1e98','photo-1669588456774-c0e837c8e620','photo-1516552738845-be712b622f24',
    'photo-1461280360983-bd93eaa5051b','photo-1683659636705-a028691fa4de','photo-1692123582366-4c488ca2991b',
    'photo-1770838917379-32208420ea9a','photo-1612171181961-d8ac6c52dff1','photo-1647470569180-30551be29a2c',
    'photo-1483651646696-c1b5fe39fc0e','photo-1730688760692-ad739faa850e','photo-1672841930119-1dda32e34ce9',
    'photo-1571821807771-62cf66ac3f14','photo-1772657356280-fefe4c350287','photo-1535712663823-d1f48c3dd71e',
    'photo-1689152336634-8e8da1a1177f','photo-1459695452562-46cc57bef5f6','photo-1534008897995-27a23e859048',
    'photo-1669290213786-524812cc8fbf','photo-1720016790842-fdb884267947','photo-1445247484843-b57c04d06d2a',
    'photo-1736001655191-f653be87489c','photo-1453167710320-151adc31f6d5','photo-1739964552379-aff15e2580f9',
    'photo-1585770657230-f5ec55a8c05b','photo-1627868153411-624a8dce0a12','photo-1626359909709-8067b64e1655',
    'photo-1501630834273-4b5604d2ee31','photo-1580979443365-6bb3f7b1833f','photo-1769925315807-c2f0b76769f2',
  ],
  COMPRAS: [
    'photo-1603459771691-d4022336e755','photo-1690303129179-8c9720d4656d','photo-1603525846431-ac38a7775754',
    'photo-1559807658-b336cd77d6ab','photo-1564514157826-2761e85d6152','photo-1766021736538-3208f2ad05f2',
    'photo-1773772255047-74744067601e','photo-1634647626758-ad751a260e9f','photo-1706244978503-5e7ceb4c6e35',
    'photo-1739108951069-15082523ecb7','photo-1694355045197-276c3c72672e','photo-1688261218652-08457c6aa726',
    'photo-1500462918059-b1a0cb512f1d','photo-1682328932063-1dda022c1e4b','photo-1637872937209-e1a5ccdc90cc',
    'photo-1768250161138-a63d692ef2a8','photo-1606913209102-a51910ba83cf','photo-1713678849633-f848d7c17f7a',
    'photo-1750002641636-2ee65daf28a3','photo-1764773975501-5fbaaa92f3fa','photo-1462473325456-4dbb7490895f',
    'photo-1709560331476-94206986273c','photo-1757207445743-cde69fab87b4','photo-1566487097168-e91a4f38bee2',
    'photo-1617259111909-a776d5969b17','photo-1613902260357-f5e11151d2bb','photo-1516648176391-a4de4541db51',
    'photo-1506158669146-619067262a00','photo-1757212934677-57df0ec6d762','photo-1757212934776-2f6d7e1651fd',
  ],
  NOCTURNO: [
    'photo-1708885819756-a1afd6ac6008','photo-1753724933350-c2e0e2990445','photo-1628006565830-9ac355e293db',
    'photo-1773772255047-74744067601e','photo-1634647626758-ad751a260e9f','photo-1585669666867-f4eee227eb04',
    'photo-1729944450711-b9b8cedbefc7','photo-1666138736930-a98c0dcb9914','photo-1499260126922-fbb24624a4e8',
    'photo-1741085908649-f143f3fa801f','photo-1678097624468-9b17e0da9fe7','photo-1566132127167-c6291d242ece',
    'photo-1582554708233-d04581f41460','photo-1743454343491-42e2ae02c6e6','photo-1572278116640-337bc3c3b8ae',
    'photo-1553966528-237ab71fb292','photo-1716308259016-8424849dc156','photo-1459695452562-46cc57bef5f6',
    'photo-1634264003328-55b1f4ab33c9','photo-1576568699714-a3f4950805d5','photo-1534008897995-27a23e859048',
    'photo-1669290213786-524812cc8fbf','photo-1462473325456-4dbb7490895f','photo-1688261218652-08457c6aa726',
    'photo-1714057863381-db1833b7a554','photo-1773191262775-4645f48bfe42','photo-1612171181961-d8ac6c52dff1',
    'photo-1517147763025-9aedcd945208','photo-1603120527222-33f28c2ce89e','photo-1586784444981-ac96e335555c',
  ],
};

const run = async () => {
  await connectDB();
  console.log('Applying VERIFIED real Unsplash images...\n');

  // 1. Cities
  for (const [slug, id] of Object.entries(CITY_IMG)) {
    await City.findOneAndUpdate({ slug }, { imagenPortada: U(id) });
  }
  console.log('✅ 30 cities');

  // 2. Guides — remove duplicates with cities first
  const cityIdSet = new Set(Object.values(CITY_IMG));
  const usedGuideIds = new Set();

  const allCities = await City.find();
  let gc = 0;
  for (const city of allCities) {
    const imgs = GUIDE_IMG[city.slug];
    if (!imgs) continue;
    const guides = await Guide.find({ ciudad: city._id }).sort('createdAt');
    for (let i = 0; i < guides.length; i++) {
      let id = imgs[i % imgs.length];
      // Skip if same as city image or already used
      if (cityIdSet.has(id) || usedGuideIds.has(id)) {
        // Use a fallback from activity pool
        const pool = Object.values(ACT_POOL).flat();
        for (const fallback of pool) {
          if (!cityIdSet.has(fallback) && !usedGuideIds.has(fallback)) {
            id = fallback;
            break;
          }
        }
      }
      usedGuideIds.add(id);
      await Guide.findByIdAndUpdate(guides[i]._id, { imagen: U(id) });
      gc++;
    }
  }
  console.log(`✅ ${gc} guides`);

  // 3. Activities
  const allActs = await Activity.find().populate('ciudad', 'slug').sort('ciudad categoria nombre');
  const usedPerCity = {};
  let ac = 0;
  for (const act of allActs) {
    const slug = act.ciudad?.slug || 'x';
    const cat = act.categoria || 'CULTURAL';
    const pool = ACT_POOL[cat] || ACT_POOL.CULTURAL;
    if (!usedPerCity[slug]) usedPerCity[slug] = { set: new Set(), idx: {} };
    if (!usedPerCity[slug].idx[cat]) usedPerCity[slug].idx[cat] = 0;

    let id;
    let idx = usedPerCity[slug].idx[cat];
    let tries = 0;
    do {
      id = pool[idx % pool.length];
      idx++;
      tries++;
    } while (usedPerCity[slug].set.has(id) && tries < pool.length * 2);
    usedPerCity[slug].idx[cat] = idx;
    usedPerCity[slug].set.add(id);

    await Activity.findByIdAndUpdate(act._id, { imagen: U(id) });
    ac++;
  }
  console.log(`✅ ${ac} activities`);

  // 4. Verify
  const cities2 = await City.find({}, 'imagenPortada');
  const guides2 = await Guide.find({}, 'imagen');
  const cityBases = new Set(cities2.map(c => c.imagenPortada?.split('?')[0]));
  const guideBases = guides2.map(g => g.imagen?.split('?')[0]);
  const guideUniqueSet = new Set(guideBases);
  let overlap = 0;
  for (const b of guideBases) { if (cityBases.has(b)) overlap++; }

  console.log(`\nCity unique: ${cityBases.size}/30`);
  console.log(`Guide unique: ${guideUniqueSet.size}/90`);
  console.log(`City-Guide overlap: ${overlap}`);
  console.log(overlap === 0 && guideUniqueSet.size === 90 ? '✅ PERFECT' : '⚠ Still has issues');

  process.exit(0);
};

run();
