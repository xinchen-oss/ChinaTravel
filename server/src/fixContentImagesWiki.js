/**
 * Asigna FOTOS REALES (Wikimedia Commons) a ACTIVIDADES y RUTAS.
 *
 * Para cada elemento busca en Commons la imagen del lugar concreto
 * (la Gran Muralla es la Gran Muralla, los Guerreros de Terracota son
 * los Guerreros de Terracota...), filtra mapas/escudos/logos/diagramas,
 * prefiere fotos horizontales y evita repetir la misma imagen.
 *
 * Ejecutar:  node src/fixContentImagesWiki.js
 */
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Activity from './models/Activity.js';
import Ruta from './models/Ruta.js';
import './models/City.js';

const UA = 'ChinaTravelThesis/1.0 (educational project; contact: student@upm.es)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const norm = (s) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Palabras de archivos que NO son fotos del lugar.
const BAD = /(\bmap\b|loc[_ ]?map|map[_ ]of|mapa|carte|ams-wo|flag|bandera|logo|icon|coat[_ ]of[_ ]arms|escudo|locator|location|seal|\.svg|\.gif|\.pdf|diagram|plan_|chart|stamp|sello|banknote|coin|tong[_ ]?bao|moneda|portrait|emblem|topograph|satellite|nasa|metro|subway|light[_ ]rail|railway[_ ]station|\bsta\b|\bstation\b|airport|aeropuerto|\bthumbnail\b|1906|1930s|restored)/i;

/**
 * Hints: traduce/precisa la búsqueda para nombres concretos.
 * La clave es un fragmento (normalizado) del nombre; si aparece, se usa
 * la query indicada (en inglés, que es donde Commons tiene más resultados).
 */
const HINTS = [
  // Pekín
  ['gran muralla', 'Great Wall of China Mutianyu'],
  ['ciudad prohibida', 'Forbidden City Beijing'],
  ['palacio de verano', 'Summer Palace Beijing'],
  ['templo del cielo', 'Temple of Heaven Beijing'],
  ['plaza de tiananmen', 'Tiananmen Square Beijing'],
  ['hutong', 'Beijing hutong'],
  ['pato pekines', 'Peking duck'],
  ['wangfujing', 'Wangfujing snack street Beijing'],
  ['798', '798 Art Zone Beijing'],
  ['kung fu', 'Chinese kung fu performance'],
  // Shanghái
  ['el bund', 'The Bund Shanghai'],
  ['yuyuan', 'Yuyuan Garden Shanghai'],
  ['tianzifang', 'Tianzifang Shanghai'],
  ['museo de shanghai', 'Shanghai Museum'],
  ['zhujiajiao', 'Zhujiajiao water town'],
  ['huangpu', 'Huangpu River Shanghai night'],
  ['xiaolongbao', 'Xiaolongbao'],
  ['din tai fung', 'Xiaolongbao dumplings'],
  ['torre de shanghai', 'Shanghai Tower skyscraper Lujiazui'],
  ['nanjing road', 'Nanjing Road Shanghai'],
  ['barrio frances', 'Shanghai former French Concession street'],
  // Chengdú
  ['monte qingcheng', 'Mount Qingcheng'],
  ['templo wuhou', 'Wuhou Shrine Chengdu'],
  ['callejon ancho', 'Kuanzhai Alley Chengdu'],
  ['pandas gigantes', 'Giant panda Chengdu'],
  ['calle jinli', 'Jinli street Chengdu'],
  ['cambio de caras', 'Sichuan opera face changing'],
  ['hot pot sichuanes', 'Sichuan hot pot'],
  ['cocina sichuanesa', 'Sichuan cuisine'],
  ['buda gigante de leshan', 'Leshan Giant Buddha'],
  // Chongqing
  ['liziba', 'Liziba light rail Chongqing'],
  ['rio yangtse', 'Yangtze River cruise'],
  ['hongya', 'Hongya Cave Chongqing'],
  ['teleferico', 'Chongqing Yangtze River Cableway'],
  ['dazu', 'Dazu Rock Carvings Buddha statues'],
  ['jiefangbei', 'Jiefangbei Chongqing'],
  ['hot pot de chongqing', 'Chongqing hot pot'],
  ['ciqikou', 'Ciqikou ancient town'],
  ['xiaomian', 'Chongqing noodles'],
  // Harbin
  ['aldea de la nieve', 'China Snow Town Xuexiang'],
  ['esqui en yabuli', 'Yabuli ski resort'],
  ['comida rusa', 'Russian restaurant food Harbin'],
  ['tigres siberianos', 'Siberian Tiger Park Harbin'],
  ['festival de hielo', 'Harbin International Ice and Snow Festival'],
  ['bano termal', 'hot spring snow China'],
  ['santa sofia', 'Saint Sophia Cathedral Harbin'],
  ['sun island', 'Sun Island Harbin snow sculpture'],
  ['zhongyang', 'Central Street Harbin'],
  // Xi'an
  ['torre de la campana', 'Bell Tower Xian'],
  ['gran ganso', 'Giant Wild Goose Pagoda'],
  ['tang dynasty', 'Tang Dynasty music dance show Xian theatre'],
  ['guerreros de terracota', 'Terracotta Army Xian'],
  ['barrio musulman', 'Muslim Quarter Xian'],
  ['fabricacion de dumplings', 'Chinese dumplings jiaozi'],
  ['templo famen', 'Famen Temple'],
  ['muralla de xi', 'Xian City Wall'],
  ['monte huashan', 'Mount Hua Huashan'],
  // Cantón (Guangzhou)
  ['familia chen', 'Chen Clan Ancestral Hall Guangzhou'],
  ['rio perla', 'Pearl River Guangzhou night'],
  ['dim sum', 'Dim sum Cantonese'],
  ['beijing lu', 'Beijing Road Guangzhou'],
  ['canton tower', 'Canton Tower'],
  ['torre canton', 'Canton Tower'],
  ['pato asado canton', 'Cantonese roast goose duck dish'],
  ['yuexiu', 'Yuexiu Park Five Rams statue Guangzhou'],
  ['shamian', 'Shamian Island Guangzhou'],
  ['qingping', 'Qingping Market Guangzhou'],
  // Hangzhou
  ['lago del oeste', 'West Lake Hangzhou'],
  ['lago del o', 'West Lake Hangzhou boat'],
  ['impression west lake', 'West Lake Hangzhou night'],
  ['dongpo', 'Dongpo pork dish'],
  ['museo nacional del te', 'China National Tea Museum Hangzhou'],
  ['museo del te', 'China National Tea Museum Hangzhou'],
  ['seis armonias', 'Liuhe Pagoda Hangzhou'],
  ['paseo en bicicleta por el lago', 'West Lake Hangzhou bicycle'],
  ['longjing', 'Longjing tea plantation Hangzhou'],
  ['hefang', 'Hefang Street Hangzhou'],
  ['lingyin', 'Lingyin Temple Hangzhou'],
  // Guilin / Yangshuo
  ['trompa de elefante', 'Elephant Trunk Hill Guilin'],
  ['rafting en el rio yulong', 'Yulong River Yangshuo bamboo raft'],
  ['impression liu sanjie', 'Impression Sanjie Liu Yangshuo show'],
  ['longji', 'Longji rice terraces Longsheng'],
  ['yangshuo en bicicleta', 'Yangshuo countryside cycling karst'],
  ['rio li', 'Li River Guilin karst'],
  ['pintura china en yangshuo', 'Chinese painting class'],
  ['mercado nocturno de yangshuo', 'Yangshuo West Street night'],
  ['flauta de cana', 'Reed Flute Cave Guilin'],
  // Lhasa / Tíbet
  ['momos', 'Tibetan momo dumplings'],
  ['comida tibetana', 'Tibetan food momo'],
  ['jokhang', 'Jokhang Temple Lhasa'],
  ['barkhor', 'Barkhor Street Lhasa'],
  ['mantequilla de yak', 'yak butter tea Tibet'],
  ['palacio potala', 'Potala Palace Lhasa'],
  ['kora alrededor del potala', 'Potala Palace Lhasa pilgrims'],
  ['drepung', 'Drepung Monastery Lhasa'],
  ['monasterio de sera', 'Sera Monastery Lhasa monks debate'],
  ['namtso', 'Lake Namtso Tibet'],
  // Dali / Yunnan
  ['cangshan', 'Cangshan mountains Dali'],
  ['senderismo en cangshan', 'Cangshan mountains Dali'],
  ['tres pagodas', 'Three Pagodas Chongsheng Temple Dali'],
  ['tie-dye', 'Bai tie-dye batik Yunnan'],
  ['shuanglang', 'Shuanglang town Erhai Lake'],
  ['mercado de xizhou', 'Xizhou old town Bai Dali'],
  ['ciudad antigua de dali', 'Dali Old Town Yunnan'],
  ['lago erhai', 'Erhai Lake Dali'],
  ['cerveceria', 'Dali Old Town Yunnan'],
  // Dunhuang
  ['observacion de estrellas', 'Gobi desert starry night'],
  ['dunas de mingsha', 'Mingsha Shan Crescent Lake Dunhuang'],
  ['mingsha', 'Mingsha Shan Crescent Lake Dunhuang'],
  ['camello por el gobi', 'camel caravan Gobi desert Dunhuang'],
  ['mercado nocturno de shazhou', 'Shazhou night market Dunhuang'],
  ['yardang', 'Dunhuang Yardang National Geopark'],
  ['yumen', 'Yumen Pass Dunhuang'],
  ['paso de jade', 'Yumen Pass Dunhuang'],
  ['buda occidental', 'Western Thousand Buddha Caves Dunhuang'],
  ['xiqianfo', 'Western Thousand Buddha Caves Dunhuang'],
  ['mogao', 'Mogao Caves Dunhuang'],
  // Kunming
  ['bosque de piedra', 'Stone Forest Shilin Yunnan'],
  ['shilin', 'Stone Forest Shilin Yunnan'],
  ['lago dian', 'Dianchi Lake Kunming'],
  ['xishan', 'Xishan Western Hills Kunming'],
  ['montanas del oeste', 'Xishan Western Hills Kunming'],
  ['yuantong', 'Yuantong Temple Kunming'],
  ['mercado de flores', 'flower market Kunming Dounan'],
  ['pollo al vapor', 'Yunnan steam pot chicken'],
  ['fideos cruzando el puente', 'crossing the bridge noodles Yunnan'],
  ['pueblo etnico de yunnan', 'Yunnan Nationalities Village Kunming'],
  // Nanjing
  ['mausoleo de sun', 'Sun Yat-sen Mausoleum Nanjing'],
  ['pato salado', 'Nanjing salted duck dish'],
  ['lago xuanwu', 'Xuanwu Lake Nanjing'],
  ['masacre de nanjing', 'Nanjing Massacre Memorial Hall'],
  ['muralla de nanjing', 'Nanjing City Wall'],
  ['avenida de los platanos', 'Nanjing plane trees avenue autumn'],
  ['montana purpura', 'Purple Mountain Zijinshan Nanjing'],
  ['zijinshan', 'Purple Mountain Zijinshan Nanjing'],
  ['templo de confucio', 'Confucius Temple Fuzimiao Nanjing'],
  ['fuzimiao', 'Confucius Temple Fuzimiao Nanjing'],
  // Pingyao
  ['pingyao encounter', 'Pingyao ancient city night'],
  ['gastronomia de shanxi', 'Shanxi sliced noodles'],
  ['casa patio', 'Pingyao courtyard house'],
  ['muralla de pingyao', 'Pingyao city wall'],
  ['calle ming-qing', 'Pingyao Ming Qing Street'],
  ['templo shuanglin', 'Shuanglin Temple Pingyao'],
  ['vinagre de pingyao', 'Shanxi mature vinegar'],
  ['rishengchang', 'Rishengchang Pingyao'],
  // Sanya / Hainan
  ['bosque tropical yanoda', 'Yanoda rainforest Hainan'],
  ['fin del cielo', 'Tianya Haijiao Sanya'],
  ['tianya', 'Tianya Haijiao Sanya'],
  ['mariscos en dadonghai', 'Chinese seafood dish'],
  ['isla wuzhizhou', 'Wuzhizhou Island Sanya'],
  ['coco fresco', 'fresh coconut Hainan beach'],
  ['surf en houhai', 'surfing Houhai Sanya beach'],
  ['yalong', 'Yalong Bay Sanya beach'],
  ['guanyin', 'Nanshan Guanyin statue Sanya'],
  // Suzhou
  ['maestro de las redes', 'Master of the Nets Garden Suzhou'],
  ['gastronomia de suzhou', 'Suzhou cuisine Chinese food'],
  ['museo de la seda', 'silk weaving loom China'],
  ['colina del tigre', 'Tiger Hill Suzhou pagoda'],
  ['pingjiang', 'Pingjiang Road Suzhou canal'],
  ['canales de suzhou', 'Suzhou canal gondola'],
  ['tongli', 'Tongli water town'],
  ['administrador humilde', 'Humble Administrator Garden Suzhou'],
  // Lijiang
  ['baisha', 'Baisha murals Lijiang'],
  ['garganta del salto del tigre', 'Tiger Leaping Gorge Yunnan'],
  ['ciudad antigua de lijiang', 'Lijiang Old Town Yunnan'],
  ['dragon negro', 'Black Dragon Pool Lijiang Jade Dragon'],
  ['lago lugu', 'Lugu Lake Mosuo Yunnan'],
  ['cultura naxi', 'Naxi Dongba culture Lijiang'],
  ['impression lijiang', 'Impression Lijiang show Jade Dragon'],
  ['dragon de jade', 'Jade Dragon Snow Mountain Lijiang'],
  // Xiamen
  ['marisco en zengcuo', 'Zengcuoan Xiamen seafood'],
  ['gulangyu', 'Gulangyu Island Xiamen'],
  ['jardin botanico wanshi', 'Xiamen Botanical Garden'],
  ['cultura del te fujian', 'Fujian oolong tea ceremony'],
  ['tulou de fujian', 'Fujian Tulou earth building'],
  ['nanputuo', 'Nanputuo Temple Xiamen'],
  ['calle zhongshan', 'Zhongshan Road Xiamen'],
  ['piano museum', 'Gulangyu Piano Museum Xiamen'],
  ['ruta costera de xiamen', 'Xiamen island ring road coast'],
  // Zhangjiajie
  ['cocina de hunan', 'Hunan cuisine Chinese spicy food'],
  ['ascensor bailong', 'Bailong Elevator Zhangjiajie'],
  ['fenghuang', 'Fenghuang ancient town Hunan'],
  ['tianmen fox', 'Tianmen Mountain Zhangjiajie show'],
  ['montana tianmen', 'Tianmen Mountain Zhangjiajie'],
  ['parque nacional de zhangjiajie', 'Zhangjiajie National Forest Park pillars'],
  ['latigo dorado', 'Golden Whip Stream Zhangjiajie'],
  ['puente de cristal', 'Zhangjiajie glass bridge canyon'],
  // genéricos comida / temas (al final, tras lo específico)
  ['xiaolongbao', 'Xiaolongbao dumplings'],
  ['dumpling', 'Chinese dumplings jiaozi'],
  ['fideos', 'Chinese noodles bowl'],
  ['hot pot', 'Chinese hot pot'],
  ['hotpot', 'Chinese hot pot'],
  ['marisco', 'Chinese seafood dish'],
  ['oolong', 'Oolong tea'],
  ['ceremonia del te', 'Chinese tea ceremony'],
];

// Imagen representativa por ciudad para fallbacks.
const CITY_QUERY = {
  'pekin': 'Beijing skyline',
  'shanghai': 'Shanghai skyline Pudong',
  'chengdu': 'Chengdu city Sichuan',
  'chongqing': 'Chongqing skyline night',
  'harbin': 'Harbin ice festival',
  "xi'an": 'Xian city wall China',
  'xian': 'Xian city wall China',
  'canton (guangzhou)': 'Guangzhou skyline',
  'hangzhou': 'West Lake Hangzhou',
  'guilin': 'Guilin Li River karst',
  'lhasa': 'Potala Palace Lhasa',
  'dali': 'Dali Yunnan Erhai',
  'lijiang': 'Lijiang old town Yunnan',
  'nanjing': 'Nanjing China landmark',
  'pingyao': 'Pingyao ancient city',
  'sanya': 'Sanya Hainan beach',
  'suzhou': 'Suzhou garden canal',
  'dunhuang': 'Mogao Caves Dunhuang desert',
  'xiamen': 'Gulangyu Xiamen',
  'zhangjiajie': 'Zhangjiajie mountains',
  'kunming': 'Kunming Yunnan Stone Forest',
};

function buildQuery(name, cityName) {
  const n = norm(name);
  for (const [frag, q] of HINTS) {
    if (n.includes(frag)) return q;
  }
  // Sin hint: limpiar prefijos genéricos y añadir ciudad + China
  let cleaned = name
    .replace(/^(Clase de|Espect[aá]culo|Crucero( nocturno)?( por el| por la| en)?|Excursi[oó]n a|Visita( a| al)?|Paseo( por)?|Tour( de| por)?|Ruta( de| costera)?|Centro de)\s+/i, '')
    .replace(/\(.*?\)/g, '')
    .trim();
  const city = (cityName || '').replace(/\(.*?\)/g, '').trim();
  return `${cleaned} ${city} China`.trim();
}

async function commonsSearch(query, limit = 12) {
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json' +
    '&generator=search&gsrnamespace=6&gsrlimit=' + limit +
    '&gsrsearch=' + encodeURIComponent(query) +
    '&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=900';

  // Reintentos con back-off ante limitación de la API.
  let data = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      const text = await res.text();
      if (res.ok && text.startsWith('{')) { data = JSON.parse(text); break; }
    } catch { /* reintenta */ }
    await sleep(800 * (attempt + 1)); // 0.8s, 1.6s, 2.4s, 3.2s
  }
  if (!data) return [];

  try {
    const pages = data.query?.pages ? Object.values(data.query.pages) : [];
    // Conserva orden de relevancia de la búsqueda
    pages.sort((a, b) => (a.index || 0) - (b.index || 0));
    const out = [];
    for (const p of pages) {
      const info = p.imageinfo?.[0];
      if (!info || !info.thumburl) continue;
      if (BAD.test(p.title) || BAD.test(info.url)) continue;
      if (info.mime && !/jpeg|png/.test(info.mime)) continue;
      const landscape = (info.width || 0) >= (info.height || 0);
      out.push({ title: p.title, url: info.thumburl, landscape });
    }
    // Horizontales primero, manteniendo relevancia dentro de cada grupo
    return [...out.filter((x) => x.landscape), ...out.filter((x) => !x.landscape)];
  } catch {
    return [];
  }
}

const used = new Set();
function choose(candidates) {
  if (!candidates.length) return null;
  const fresh = candidates.find((c) => !used.has(c.url));
  const pick = fresh || candidates[0];
  used.add(pick.url);
  return pick.url;
}

async function resolveImage(name, cityName) {
  // 1) búsqueda específica del lugar
  let cands = await commonsSearch(buildQuery(name, cityName));
  let url = choose(cands);
  if (url) return url;
  // 2) fallback: ciudad
  const cq = CITY_QUERY[norm(cityName)];
  if (cq) {
    await sleep(400);
    cands = await commonsSearch(cq);
    url = choose(cands);
    if (url) return url;
  }
  return null;
}

async function run() {
  await connectDB();

  const activities = await Activity.find().populate('ciudad', 'nombre');
  let ok = 0, fail = 0;
  const misses = [];
  for (const act of activities) {
    const url = await resolveImage(act.nombre, act.ciudad?.nombre);
    if (url) { act.imagen = url; await act.save(); ok++; }
    else { fail++; misses.push(act.nombre); }
    await sleep(400);
  }
  console.log(`✅ Actividades: ${ok} OK, ${fail} sin foto`);

  const rutas = await Ruta.find().populate('ciudad', 'nombre');
  let rok = 0, rfail = 0;
  for (const ruta of rutas) {
    // Las rutas usan la imagen icónica de su ciudad (deduplicada entre rutas)
    const cq = CITY_QUERY[norm(ruta.ciudad?.nombre)] || `${ruta.ciudad?.nombre} China`;
    const url = choose(await commonsSearch(cq));
    if (url) { ruta.imagen = url; await ruta.save(); rok++; }
    else rfail++;
    await sleep(400);
  }
  console.log(`✅ Rutas: ${rok} OK, ${rfail} sin foto`);

  if (misses.length) console.log('Sin foto:', misses.join(' | '));
  console.log(`Imágenes únicas usadas: ${used.size}`);

  await mongoose.connection.close();
  console.log('🏁 Hecho.');
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
