/**
 * Patches seed.js by adding imagen fields to every activity and
 * updating imagen URLs in every route, based on the same mappings
 * used in updateAllImages.js.
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, 'seed.js');

const img = (id) => `https://images.unsplash.com/${id}?w=800&q=80`;

// ── Activity mappings: exact name → CDN photo ID ───────────────
const activityImages = {
  // PEKÍN
  'Ciudad Prohibida':              'photo-1547981609-4b6bfe67ca0b',
  'Gran Muralla (Mutianyu)':       'photo-1509624780899-f812439647e4',
  'Templo del Cielo':              'photo-1780323837699-d4d1cf8f4e14',
  'Hutongs en rickshaw':           'photo-1756770403891-f08986c536a9',
  'Pato pekinés en Quanjude':      'photo-1767818375229-be50b2b070ef',
  'Mercado nocturno de Wangfujing':'photo-1760535560909-15b15c3be8b5',
  'Palacio de Verano':             'photo-1586788630595-bbd71f6f8646',
  'Plaza de Tiananmén':            'photo-1753166890334-55a89f788a6c',
  'Barrio artístico 798':          'photo-1760281809674-b9634e2abc4a',
  'Espectáculo de Kung Fu':        'photo-1762417422848-20e759043e99',

  // SHANGHÁI
  'El Bund':                       'photo-1495446815901-a7297e633e8d',
  'Torre de Shanghái':             'photo-1748078096034-46086f5b87da',
  'Jardín Yuyuan':                 'photo-1576204557749-ca7052a2865a',
  'Xiaolongbao en Din Tai Fung':   'photo-1563245372-f21724e3856d',
  'Barrio francés en bicicleta':   'photo-1543569128-1221ed287623',
  'Crucero nocturno por el Huangpu':'photo-1748078096034-46086f5b87da',
  'Museo de Shanghái':             'photo-1549167008-f02ad8abf052',
  'Zhujiajiao - Pueblo de agua':   'photo-1689827524021-7d99d37c55c7',
  'Tianzifang':                    'photo-1754638335214-e61ae430b876',
  'Nanjing Road':                  'photo-1526139334526-f591a54b477c',

  // CHENGDÚ
  'Centro de Pandas Gigantes':     'photo-1704158679186-9e3082167277',
  'Espectáculo cambio de caras':   'photo-1762417422848-20e759043e99',
  'Hot pot sichuanés':             'photo-1526401363794-c96708fb8089',
  'Calle Jinli':                   'photo-1748180749362-e498105ecc7f',
  'Templo Wuhou':                  'photo-1748786919806-464841e61654',
  'Buda Gigante de Leshan':        'photo-1759108368762-dcadd0e31edd',
  'Callejón ancho y estrecho':     'photo-1740982880907-8283141e8db6',
  'Monte Qingcheng':               'photo-1771967141873-8b714205f4bd',
  'Clase de cocina sichuanesa':    'photo-1613902260357-f5e11151d2bb',

  // CHONGQING
  'Hongya Cave':                   'photo-1586784444981-ac96e335555c',
  'Hot pot de Chongqing':          'photo-1550388341-d3d5ac2a724e',
  'Monorraíl de Liziba':           'photo-1733114103524-be9ba326a745',
  'Ciqikou - Pueblo antiguo':      'photo-1761667625209-e3f9145e93eb',
  'Crucero por el río Yangtsé':    'photo-1773318901073-3d9304c6f48b',
  'Dazu Rock Carvings':            'photo-1760020423741-500a95bc5237',
  'Teleférico sobre el Yangtsé':   'photo-1561031454-4f1331bd2a34',
  'Jiefangbei - Centro comercial': 'photo-1526139334526-f591a54b477c',
  'Fideos de Chongqing (xiaomian)':'photo-1767324672653-84c017d85d8e',

  // HARBIN
  'Festival de Hielo y Nieve':     'photo-1768423935512-858cd32aecf7',
  'Sun Island Snow Sculptures':    'photo-1760645611765-a3df6c92bda3',
  'Calle Zhongyang (Central Street)':'photo-1526139334526-f591a54b477c',
  'Catedral de Santa Sofía':       'photo-1748010195904-ccccbffc7978',
  'Tigres siberianos de Harbin':   'photo-1641063157251-ae9d815e5daa',
  'Baño termal en Yabuli':         'photo-1771967141873-8b714205f4bd',
  'Esquí en Yabuli':               'photo-1773318901073-3d9304c6f48b',
  'Comida rusa en Harbin':         'photo-1647068804459-5f0796b19935',
  'Aldea de la Nieve (Xuexiang)':  'photo-1760645611765-a3df6c92bda3',

  // XI'AN
  'Guerreros de Terracota':        'photo-1523946963389-207478f6cb2e',
  "Muralla de Xi'an en bicicleta": 'photo-1716929955955-f6ef9c1ca084',
  "Barrio musulmán de Xi'an":      'photo-1760535560909-15b15c3be8b5',
  'Pagoda del Gran Ganso Salvaje': 'photo-1648726444582-6d108b5d13dc',
  'Espectáculo Tang Dynasty':      'photo-1762417422848-20e759043e99',
  'Templo Famen':                  'photo-1748786919806-464841e61654',
  'Monte Huashan':                 'photo-1771967141873-8b714205f4bd',
  "Clase de fabricación de dumplings":'photo-1762418967889-10abec43c325',
  'Torre de la Campana y el Tambor':'photo-1659466248885-8b7a03205661',

  // CANTÓN
  'Dim Sum en Cantón':             'photo-1767324672653-84c017d85d8e',
  'Torre Canton (Canton Tower)':   'photo-1753172115293-32b2a08f0798',
  'Isla Shamian':                  'photo-1542640244-7e672d6cef4e',
  'Templo ancestral de la familia Chen':'photo-1748010195904-ccccbffc7978',
  'Crucero nocturno por el río Perla':'photo-1748078096034-46086f5b87da',
  'Mercado de medicina Qingping':  'photo-1549167008-f02ad8abf052',
  'Pato asado cantonés':           'photo-1767818375229-be50b2b070ef',
  'Jardín Yuexiu y la estatua de los Cinco Carneros':'photo-1748786919806-464841e61654',
  'Calle Beijing Lu (Peatonal)':   'photo-1526139334526-f591a54b477c',

  // HANGZHOU
  'Lago del Oeste en barco':       'photo-1751012325074-94e4fab31697',
  'Plantaciones de té Longjing':   'photo-1743401434828-5a026d661211',
  'Templo Lingyin':                'photo-1748786919806-464841e61654',
  'Calle Hefang':                  'photo-1760535560909-15b15c3be8b5',
  'Espectáculo Impression West Lake':'photo-1701913997567-746dd137eff6',
  'Pagoda de las Seis Armonías':   'photo-1648726444582-6d108b5d13dc',
  'Cocina de Hangzhou: Dongpo Rou':'photo-1613902260357-f5e11151d2bb',
  'Paseo en bicicleta por el Lago del Oeste':'photo-1751012325074-94e4fab31697',
  'Museo Nacional del Té':         'photo-1759356864606-cf371a5ba5f5',

  // GUILIN
  'Crucero por el río Li':         'photo-1773318901379-aac92fdf5611',
  'Yangshuo en bicicleta':         'photo-1773318901379-aac92fdf5611',
  'Arrozales en terrazas de Longji':'photo-1559342825-3b44d9468086',
  'Cueva de la Flauta de Caña':    'photo-1619275044672-8b95b2d80ce7',
  'Espectáculo Impression Liu Sanjie':'photo-1740982880907-8283141e8db6',
  'Rafting en el río Yulong':      'photo-1514920735211-8c697444a248',
  'Colina de la Trompa de Elefante':'photo-1701668910380-b44dcc028525',
  'Mercado nocturno de Yangshuo':  'photo-1754638335214-e61ae430b876',
  'Clase de pintura china en Yangshuo':'photo-1762115839715-fbd4e2c65260',

  // LHASA
  'Palacio Potala':                'photo-1741257091145-69d62cdf819a',
  'Templo de Jokhang y Barkhor':   'photo-1782317341310-335b55dc6537',
  'Monasterio de Sera - Debate de monjes':'photo-1747643607854-9f0d93c8c790',
  'Lago Namtso':                   'photo-1760326604065-a007f0b19646',
  'Té de mantequilla de yak':      'photo-1735651705963-1e8bd1f01e47',
  'Monasterio de Drepung':         'photo-1747643607854-9f0d93c8c790',
  'Kora alrededor del Potala':     'photo-1741257091145-69d62cdf819a',
  'Comida tibetana: momos y thukpa':'photo-1560343787-b90cb337028e',

  // DALI
  'Ciudad antigua de Dali':        'photo-1542640244-7e672d6cef4e',
  'Lago Erhai en bicicleta':       'photo-1773318901073-3d9304c6f48b',
  'Tres Pagodas de Chongsheng':    'photo-1576631368362-bec8b131571b',
  'Mercado de Xizhou':             'photo-1758021358414-59e46a1f1147',
  'Senderismo en Cangshan':        'photo-1771967141873-8b714205f4bd',
  'Ceremonia del té Bai "Tres Sabores"':'photo-1759356864606-cf371a5ba5f5',
  'Pueblo pesquero de Shuanglang': 'photo-1773318901073-3d9304c6f48b',
  'Tie-dye Bai (batik)':           'photo-1549167008-f02ad8abf052',
  'Cervecería artesanal Bad Monkey':'photo-1674038316942-cd7c80cf0057',

  // XIAMEN
  'Isla de Gulangyu':              'photo-1740982880907-8283141e8db6',
  'Templo budista Nanputuo':       'photo-1748786919806-464841e61654',
  'Ruta costera de Xiamen (Huandao Lu)':'photo-1784057098851-b31bb06b66e5',
  'Cultura del té Fujian (Oolong)':'photo-1759356864606-cf371a5ba5f5',
  "Marisco en Zengcuo'an":         'photo-1647068804459-5f0796b19935',
  'Jardín botánico Wanshi':        'photo-1769931446194-ede80f4a1719',
  'Tulou de Fujian (excursión)':   'photo-1761667625209-e3f9145e93eb',
  'Calle Zhongshan (peatonal)':    'photo-1526139334526-f591a54b477c',
  'Piano Museum en Gulangyu':      'photo-1759350414710-77dc7714fdae',

  // SUZHOU
  'Jardín del Administrador Humilde':'photo-1765004775728-e99163f1767d',
  'Canales de Suzhou en góndola':  'photo-1726894369361-75f1ff62f366',
  'Museo de la Seda de Suzhou':    'photo-1549167008-f02ad8abf052',
  'Calle Pingjiang Lu':            'photo-1760535560909-15b15c3be8b5',
  'Jardín del Maestro de las Redes':'photo-1757604564946-d70adb40dd2e',
  'Colina del Tigre':              'photo-1565054590237-9ec80969fbc7',
  'Tongli - Pueblo de agua':       'photo-1689827524021-7d99d37c55c7',
  'Gastronomía de Suzhou':         'photo-1613902260357-f5e11151d2bb',

  // LIJIANG
  'Ciudad antigua de Lijiang':     'photo-1761667625209-e3f9145e93eb',
  'Montaña del Dragón de Jade':    'photo-1677922069750-944be2b9ad20',
  'Espectáculo Impression Lijiang':'photo-1762417422848-20e759043e99',
  'Garganta del Salto del Tigre':  'photo-1773318901073-3d9304c6f48b',
  'Estanque del Dragón Negro':     'photo-1677922069750-944be2b9ad20',
  'Cultura Naxi y música Dongba':  'photo-1759350414710-77dc7714fdae',
  'Lago Lugu - Reino Mosuo':       'photo-1782317341310-335b55dc6537',
  'Pueblo de Baisha y frescos':    'photo-1748786919806-464841e61654',

  // ZHANGJIAJIE
  'Parque Nacional de Zhangjiajie':'photo-1561031454-4f1331bd2a34',
  'Puente de cristal de Zhangjiajie':'photo-1543569128-1221ed287623',
  'Montaña Tianmen':               'photo-1561031454-4f1331bd2a34',
  'Arroyo del Látigo Dorado':      'photo-1773318901073-3d9304c6f48b',
  'Ascensor Bailong (Elevador de los 100 Dragones)':'photo-1561031454-4f1331bd2a34',
  'Espectáculo Tianmen Fox Fairy': 'photo-1762417422848-20e759043e99',
  'Pueblo antiguo de Fenghuang':   'photo-1761667625209-e3f9145e93eb',
  'Cocina de Hunan (Xiang cai)':   'photo-1526401363794-c96708fb8089',

  // KUNMING
  'Bosque de Piedra (Shilin)':     'photo-1561031454-4f1331bd2a34',
  'Mercado de flores de Dounan':   'photo-1758021358414-59e46a1f1147',
  'Templo de Yuantong':            'photo-1659466248885-8b7a03205661',
  'Lago Dian en bicicleta':        'photo-1514920735211-8c697444a248',
  'Pueblo étnico de Yunnan':       'photo-1542640244-7e672d6cef4e',
  'Pollo al vapor en olla de barro (Qiguoji)':'photo-1613902260357-f5e11151d2bb',
  'Montañas del Oeste (Xishan)':   'photo-1771967141873-8b714205f4bd',
  'Fideos cruzando el puente (Guoqiao Mixian)':'photo-1767818375229-be50b2b070ef',

  // NANJING
  'Mausoleo de Sun Yat-sen':       'photo-1619275044672-8b95b2d80ce7',
  'Templo de Confucio (Fuzimiao)': 'photo-1760535560909-15b15c3be8b5',
  'Muralla de Nanjing':            'photo-1509624780899-f812439647e4',
  'Memorial de la Masacre de Nanjing':'photo-1701913997567-746dd137eff6',
  'Lago Xuanwu':                   'photo-1749834182098-43048a2571ae',
  'Pato salado de Nanjing':        'photo-1767818375229-be50b2b070ef',
  'Montaña Púrpura (Zijinshan)':   'photo-1586788630595-bbd71f6f8646',
  'Avenida de los plátanos (Yihe Lu)':'photo-1549167008-f02ad8abf052',

  // DUNHUANG
  'Cuevas de Mogao':               'photo-1760020423741-500a95bc5237',
  'Dunas de Mingsha y Lago de la Media Luna':'photo-1755417288410-38dec02df787',
  'Paso de Yumen (Paso de Jade)':  'photo-1755417288410-38dec02df787',
  'Mercado nocturno de Shazhou':   'photo-1754638335214-e61ae430b876',
  'Yardang National Geopark':      'photo-1755417288410-38dec02df787',
  'Paseo en camello por el Gobi':  'photo-1613757963897-3cc6dd4b671f',
  'Cuevas del Buda Occidental (Xiqianfo)':'photo-1759108272457-e63341a65b20',
  'Observación de estrellas en el Gobi':'photo-1778385186919-9dab23e69d35',

  // SANYA
  'Playa de Yalong Bay':           'photo-1784057098851-b31bb06b66e5',
  'Guanyin del Mar del Sur':       'photo-1748786919806-464841e61654',
  'Isla Wuzhizhou - Snorkel':      'photo-1756312091180-b591dd1559de',
  'Bosque tropical Yanoda':        'photo-1769931446194-ede80f4a1719',
  'Mariscos en Dadonghai':         'photo-1647068804459-5f0796b19935',
  'Fin del Cielo (Tianya Haijiao)':'photo-1784057098851-b31bb06b66e5',
  'Surf en Houhai':                'photo-1771967141873-8b714205f4bd',
  'Coco fresco en Hainan':         'photo-1560343787-b90cb337028e',

  // PINGYAO
  'Muralla de Pingyao':            'photo-1576204557749-ca7052a2865a',
  'Primer banco de China (Rishengchang)':'photo-1576631368362-bec8b131571b',
  'Calle Ming-Qing':               'photo-1761667625209-e3f9145e93eb',
  'Vinagre de Pingyao':            'photo-1613902260357-f5e11151d2bb',
  'Templo Shuanglin':              'photo-1748786919806-464841e61654',
  'Espectáculo Pingyao Encounter': 'photo-1762417422848-20e759043e99',
  'Noche en casa patio tradicional':'photo-1740982880907-8283141e8db6',
  'Gastronomía de Shanxi: fideos': 'photo-1767324672653-84c017d85d8e',
};

// ── Route image mappings: title → CDN photo ID ─────────────────
const rutaImages = {
  'Pekín Imperial - Lo Esencial':            'photo-1547981609-4b6bfe67ca0b',
  'Pekín Express - Fin de Semana':           'photo-1509624780899-f812439647e4',
  'Pekín Completo - 5 Días':                 'photo-1753166890334-55a89f788a6c',
  'Shanghái Moderna y Clásica':              'photo-1748078096034-46086f5b87da',
  'Shanghái Express - 2 Días':               'photo-1495446815901-a7297e633e8d',
  'Shanghái y Alrededores - 4 Días':         'photo-1689827524021-7d99d37c55c7',
  'Chengdú - Pandas y Sabores':              'photo-1704158679186-9e3082167277',
  'Chengdú Express - 2 Días':               'photo-1526401363794-c96708fb8089',
  'Chengdú y el Buda de Leshan - 4 Días':   'photo-1759108368762-dcadd0e31edd',
  'Chongqing - La Ciudad Montaña':           'photo-1586784444981-ac96e335555c',
  'Chongqing Nocturna - 2 Días':             'photo-1748078096034-46086f5b87da',
  'Chongqing Completo - 5 Días':             'photo-1761667625209-e3f9145e93eb',
  'Harbin - Reino del Hielo':                'photo-1768423935512-858cd32aecf7',
  'Harbin Express - 2 Días':                 'photo-1641063157251-ae9d815e5daa',
  'Harbin y Aldea de la Nieve - 5 Días':    'photo-1760645611765-a3df6c92bda3',
  "Xi'an Histórica - Guerreros y Murallas":  'photo-1523946963389-207478f6cb2e',
  "Xi'an Express - 2 Días":                 'photo-1716929955955-f6ef9c1ca084',
  "Xi'an Aventurera - Monte Huashan - 4 Días":'photo-1771967141873-8b714205f4bd',
  'Cantón Express - 2 Días':                 'photo-1767324672653-84c017d85d8e',
  'Cantón Gastronómico - 3 Días':            'photo-1767818375229-be50b2b070ef',
  'Cantón y Hong Kong Puerta a Puerta - 5 Días':'photo-1753172115293-32b2a08f0798',
  'Hangzhou - Paraíso en la Tierra':         'photo-1751012325074-94e4fab31697',
  'Hangzhou Express - 2 Días':               'photo-1743401434828-5a026d661211',
  'Hangzhou Completo - 4 Días':              'photo-1748786919806-464841e61654',
  'Guilin y Yangshuo - Paisajes de Pintura': 'photo-1773318901379-aac92fdf5611',
  'Guilin Express - 2 Días':                 'photo-1559342825-3b44d9468086',
  'Guilin Completo con Terrazas de Longji - 5 Días':'photo-1559342825-3b44d9468086',
  'Lhasa Espiritual - 3 Días':               'photo-1741257091145-69d62cdf819a',
  'Lhasa Express - 2 Días':                  'photo-1782317341310-335b55dc6537',
  'Lhasa y Lago Namtso - 5 Días':            'photo-1760326604065-a007f0b19646',
  'Lijiang - Ciudad Naxi y Montaña de Jade': 'photo-1677922069750-944be2b9ad20',
  'Lijiang Aventurera - Garganta y Lago Lugu - 5 Días':'photo-1782317341310-335b55dc6537',
  'Lijiang Express - 2 Días':                'photo-1761667625209-e3f9145e93eb',
  'Zhangjiajie - Montañas de Avatar':        'photo-1561031454-4f1331bd2a34',
  'Zhangjiajie Express - 2 Días':            'photo-1561031454-4f1331bd2a34',
  'Zhangjiajie y Fenghuang - 5 Días':        'photo-1761667625209-e3f9145e93eb',
  'Kunming - Eterna Primavera':              'photo-1758021358414-59e46a1f1147',
  'Kunming Express - 2 Días':               'photo-1659466248885-8b7a03205661',
  'Kunming Completo - 4 Días':              'photo-1561031454-4f1331bd2a34',
  'Nanjing - Capital de Seis Dinastías':    'photo-1619275044672-8b95b2d80ce7',
  'Nanjing Express - 2 Días':               'photo-1509624780899-f812439647e4',
  'Nanjing Completo - 4 Días':              'photo-1749834182098-43048a2571ae',
  'Dunhuang - Ruta de la Seda':             'photo-1760020423741-500a95bc5237',
  'Dunhuang Express - 2 Días':              'photo-1613757963897-3cc6dd4b671f',
  'Dunhuang y el Gobi - 5 Días':            'photo-1755417288410-38dec02df787',
  'Sanya Tropical - 3 Días':               'photo-1784057098851-b31bb06b66e5',
  'Sanya Express - 2 Días':                'photo-1756312091180-b591dd1559de',
  'Sanya Aventura Tropical - 5 Días':      'photo-1769931446194-ede80f4a1719',
  'Pingyao - Viaje al Pasado Imperial':    'photo-1576204557749-ca7052a2865a',
  'Pingyao Express - 2 Días':              'photo-1576631368362-bec8b131571b',
  'Pingyao y Templos de Shanxi - 4 Días':  'photo-1748786919806-464841e61654',
  'Dali Bohemia - 3 Días':                 'photo-1542640244-7e672d6cef4e',
  'Dali Express - 2 Días':                 'photo-1773318901073-3d9304c6f48b',
  'Dali y Cangshan - 4 Días':              'photo-1771967141873-8b714205f4bd',
  'Xiamen y Gulangyu - 3 Días':            'photo-1740982880907-8283141e8db6',
  'Xiamen Express - 2 Días':              'photo-1784057098851-b31bb06b66e5',
  'Xiamen y Tulou de Fujian - 4 Días':    'photo-1761667625209-e3f9145e93eb',
  'Suzhou - Jardines y Canales':           'photo-1765004775728-e99163f1767d',
  'Suzhou Express - 2 Días':              'photo-1726894369361-75f1ff62f366',
  'Suzhou y Tongli - 4 Días':             'photo-1689827524021-7d99d37c55c7',
};

// ── Patch the seed.js text ──────────────────────────────────────
let source = readFileSync(seedPath, 'utf-8');

// 1. Add imagen field to each activity (insert after `nombre: '...',`)
for (const [nombre, photoId] of Object.entries(activityImages)) {
  // Escape special regex chars in the nombre
  const escaped = nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const imageUrl = img(photoId);
  // Match: nombre: 'EXACT_NAME', — capture what's after to preserve it
  const pattern = new RegExp(
    `(nombre:\\s*'${escaped}'(?:,|\\s))`,
    'g'
  );
  // Only add imagen if not already present nearby (avoid double-adding on re-run)
  source = source.replace(pattern, (match) => {
    // Check if imagen already follows in the same object (simple check)
    return match;
  });
}

// Approach: insert `imagen: 'URL',` right before `ciudad:` in each activity
// that matches the nombre, since all activities have ciudad after nombre/descripcion.
// We'll do a targeted replace per activity name.
for (const [nombre, photoId] of Object.entries(activityImages)) {
  const imageUrl = img(photoId);
  // Skip if imagen already present (idempotent)
  if (source.includes(`imagen: '${imageUrl}'`)) continue;

  const escaped = nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Pattern: find the activity block that starts with nombre: 'NAME'
  // and inject imagen before the closing brace of that object
  // Strategy: find "nombre: 'NAME'" then find the next "consejos: [...]"
  // and insert imagen right before "ciudad:" in that same line/object
  const pattern = new RegExp(
    `(nombre:\\s*'${escaped}'[^}]*?)(, ciudad:)`,
    's'
  );
  const replacement = `$1, imagen: '${imageUrl}'$2`;
  source = source.replace(pattern, replacement);
}

// 2. Update route imagen URLs
for (const [titulo, photoId] of Object.entries(rutaImages)) {
  const imageUrl = img(photoId);
  const escaped = titulo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match: titulo: 'TITLE', ... imagen: 'OLD_URL'
  const pattern = new RegExp(
    `(titulo:\\s*'${escaped}'[\\s\\S]*?imagen:\\s*')([^']+)(')`
  );
  source = source.replace(pattern, `$1${imageUrl}$3`);
}

writeFileSync(seedPath, source, 'utf-8');
console.log('✅ seed.js patched successfully.');
console.log(`   ${Object.keys(activityImages).length} activity images`);
console.log(`   ${Object.keys(rutaImages).length} route images`);
