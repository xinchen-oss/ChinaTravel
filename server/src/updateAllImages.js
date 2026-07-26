/**
 * Comprehensive image update for all activities and routes.
 * Maps each activity/route to a specific, contextually appropriate Unsplash CDN photo.
 */
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Activity from './models/Activity.js';
import Ruta from './models/Ruta.js';

const img = (id) => `https://images.unsplash.com/${id}?w=800&q=80`;

// ─────────────────────────────────────────────
//  ACTIVITIES  (name regex → CDN photo ID)
// ─────────────────────────────────────────────
const activityUpdates = [
  // ── PEKÍN ──────────────────────────────────
  { q: /ciudad prohibida/i,             id: 'photo-1547981609-4b6bfe67ca0b' }, // Forbidden City gate
  { q: /gran muralla/i,                 id: 'photo-1509624780899-f812439647e4' }, // Great Wall autumn
  { q: /templo del cielo/i,             id: 'photo-1780323837699-d4d1cf8f4e14' }, // Temple of Heaven circular
  { q: /hutongs en rickshaw/i,          id: 'photo-1756770403891-f08986c536a9' }, // Beijing hutong street
  { q: /pato pek/i,                     id: 'photo-1767818375229-be50b2b070ef' }, // roasted duck chef
  { q: /wangfujing/i,                   id: 'photo-1760535560909-15b15c3be8b5' }, // Chinese night market lanterns
  { q: /palacio de verano/i,            id: 'photo-1586788630595-bbd71f6f8646' }, // Summer Palace Beijing
  { q: /plaza de tianan/i,              id: 'photo-1753166890334-55a89f788a6c' }, // Tiananmen Square
  { q: /barrio art.stico 798/i,         id: 'photo-1760281809674-b9634e2abc4a' }, // keep: 798 art
  { q: /kung fu/i,                      id: 'photo-1762417422848-20e759043e99' }, // Chinese opera performance

  // ── SHANGHÁI ───────────────────────────────
  { q: /el bund/i,                      id: 'photo-1495446815901-a7297e633e8d' }, // Bund waterfront
  { q: /torre de shangh/i,              id: 'photo-1748078096034-46086f5b87da' }, // Shanghai skyline
  { q: /jard.n yuyuan/i,                id: 'photo-1576204557749-ca7052a2865a' }, // Yu Garden pond
  { q: /xiaolongbao/i,                  id: 'photo-1563245372-f21724e3856d' },    // steamed dumplings
  { q: /barrio franc.s en bici/i,       id: 'photo-1543569128-1221ed287623' },    // cycling city street
  { q: /crucero nocturno por el huangpu/i, id: 'photo-1748078096034-46086f5b87da' }, // Shanghai night skyline
  { q: /museo de shangh/i,              id: 'photo-1549167008-f02ad8abf052' },    // cultural museum
  { q: /zhujiajiao/i,                   id: 'photo-1689827524021-7d99d37c55c7' }, // water town Zhujiajiao
  { q: /tianzifang/i,                   id: 'photo-1754638335214-e61ae430b876' }, // Chinese night market
  { q: /nanjing road/i,                 id: 'photo-1526139334526-f591a54b477c' }, // shopping street lanterns

  // ── CHENGDÚ ────────────────────────────────
  { q: /centro de pandas/i,             id: 'photo-1704158679186-9e3082167277' }, // panda eating bamboo
  { q: /cambio de caras/i,              id: 'photo-1762417422848-20e759043e99' }, // Chinese opera mask
  { q: /hot pot sichua/i,               id: 'photo-1526401363794-c96708fb8089' }, // hot pot red broth
  { q: /calle jinli/i,                  id: 'photo-1748180749362-e498105ecc7f' }, // traditional Chengdu street
  { q: /templo wuhou/i,                 id: 'photo-1748786919806-464841e61654' }, // Buddhist temple complex
  { q: /buda gigante de leshan/i,       id: 'photo-1759108368762-dcadd0e31edd' }, // Leshan Giant Buddha
  { q: /calej.n ancho y estrecho/i,     id: 'photo-1740982880907-8283141e8db6' }, // Kuanzhai alley
  { q: /monte qingcheng/i,              id: 'photo-1771967141873-8b714205f4bd' }, // green mountain forest
  { q: /clase de cocina sichua/i,       id: 'photo-1613902260357-f5e11151d2bb' }, // cooking class wok

  // ── CHONGQING ──────────────────────────────
  { q: /hongya cave/i,                  id: 'photo-1586784444981-ac96e335555c' }, // Hongya Cave lit up
  { q: /hot pot de chongqing/i,         id: 'photo-1550388341-d3d5ac2a724e' },    // hot pot BBQ meat
  { q: /monorr.il de liziba/i,          id: 'photo-1733114103524-be9ba326a745' }, // monorail city
  { q: /ciqikou/i,                      id: 'photo-1761667625209-e3f9145e93eb' }, // ancient Chinese village
  { q: /crucero por el r.o yangtse/i,   id: 'photo-1773318901073-3d9304c6f48b' }, // Yangtze river
  { q: /dazu rock/i,                    id: 'photo-1760020423741-500a95bc5237' }, // cave Buddhist carvings
  { q: /telef.rico sobre el yangtse/i,  id: 'photo-1561031454-4f1331bd2a34' },    // mountain cable car view
  { q: /jiefangbei/i,                   id: 'photo-1526139334526-f591a54b477c' }, // city center square
  { q: /fideos de chongqing/i,          id: 'photo-1767324672653-84c017d85d8e' }, // Chinese noodle bowl

  // ── HARBIN ─────────────────────────────────
  { q: /festival de hielo y nieve/i,    id: 'photo-1768423935512-858cd32aecf7' }, // ice sculptures night
  { q: /sun island snow/i,              id: 'photo-1760645611765-a3df6c92bda3' }, // snow sculptures park
  { q: /calle zhongyang/i,              id: 'photo-1526139334526-f591a54b477c' }, // shopping pedestrian street
  { q: /catedral de santa sof.a/i,      id: 'photo-1748010195904-ccccbffc7978' }, // ornate cathedral architecture
  { q: /tigres siberianos/i,            id: 'photo-1641063157251-ae9d815e5daa' }, // tiger in snow
  { q: /ba.o termal en yabuli/i,        id: 'photo-1771967141873-8b714205f4bd' }, // mountain snow outdoor
  { q: /esqu. en yabuli/i,              id: 'photo-1773318901073-3d9304c6f48b' }, // mountain ski slopes
  { q: /comida rusa en harbin/i,        id: 'photo-1647068804459-5f0796b19935' }, // Eastern European cuisine
  { q: /aldea de la nieve/i,            id: 'photo-1760645611765-a3df6c92bda3' }, // snow village

  // ── XI'AN ──────────────────────────────────
  { q: /guerreros de terracota/i,       id: 'photo-1523946963389-207478f6cb2e' }, // terracotta warriors
  { q: /muralla de xi.an en bici/i,     id: 'photo-1716929955955-f6ef9c1ca084' }, // ancient city wall
  { q: /barrio musulm.n/i,              id: 'photo-1760535560909-15b15c3be8b5' }, // night market food stalls
  { q: /pagoda del gran ganso/i,        id: 'photo-1648726444582-6d108b5d13dc' }, // Chinese pagoda
  { q: /tang dynasty/i,                 id: 'photo-1762417422848-20e759043e99' }, // Chinese dance performance
  { q: /templo famen/i,                 id: 'photo-1748786919806-464841e61654' }, // Buddhist temple
  { q: /monte huashan/i,                id: 'photo-1771967141873-8b714205f4bd' }, // dramatic mountain cliffs
  { q: /clase de fabricaci.n de dumplings/i, id: 'photo-1762418967889-10abec43c325' }, // dumpling making
  { q: /torre de la campana y el tambor/i, id: 'photo-1659466248885-8b7a03205661' }, // Bell Tower Xi'an

  // ── CANTÓN (GUANGZHOU) ─────────────────────
  { q: /dim sum en cant.n/i,            id: 'photo-1767324672653-84c017d85d8e' }, // bamboo steamer dim sum
  { q: /torre canton/i,                 id: 'photo-1753172115293-32b2a08f0798' }, // Canton Tower rainbow
  { q: /isla shamian/i,                 id: 'photo-1542640244-7e672d6cef4e' },    // colonial architecture
  { q: /templo ancestral de la familia chen/i, id: 'photo-1748010195904-ccccbffc7978' }, // ornate Chinese temple
  { q: /crucero nocturno por el r.o perla/i, id: 'photo-1748078096034-46086f5b87da' }, // night river cruise
  { q: /mercado de medicina qingping/i, id: 'photo-1549167008-f02ad8abf052' },    // traditional market herbs
  { q: /pato asado canton/i,            id: 'photo-1767818375229-be50b2b070ef' }, // roasted duck
  { q: /jard.n yuexiu/i,                id: 'photo-1748786919806-464841e61654' }, // park/temple garden
  { q: /calle beijing lu/i,             id: 'photo-1526139334526-f591a54b477c' }, // pedestrian shopping street

  // ── HANGZHOU ───────────────────────────────
  { q: /lago del oeste en barco/i,      id: 'photo-1751012325074-94e4fab31697' }, // West Lake Hangzhou
  { q: /plantaciones de t. longjing/i,  id: 'photo-1743401434828-5a026d661211' }, // tea plantation harvest
  { q: /templo lingyin/i,               id: 'photo-1748786919806-464841e61654' }, // Buddhist temple forest
  { q: /calle hefang/i,                 id: 'photo-1760535560909-15b15c3be8b5' }, // traditional street market
  { q: /impression west lake/i,         id: 'photo-1701913997567-746dd137eff6' }, // outdoor show night
  { q: /pagoda de las seis armon/i,     id: 'photo-1648726444582-6d108b5d13dc' }, // Chinese pagoda river
  { q: /dongpo rou/i,                   id: 'photo-1613902260357-f5e11151d2bb' }, // Chinese braised pork dish
  { q: /bicicleta por el lago del oeste/i, id: 'photo-1751012325074-94e4fab31697' }, // West Lake cycling
  { q: /museo nacional del t./i,        id: 'photo-1759356864606-cf371a5ba5f5' }, // tea ceremony cups

  // ── GUILIN ─────────────────────────────────
  { q: /crucero por el r.o li/i,        id: 'photo-1773318901379-aac92fdf5611' }, // Li River karst mountains
  { q: /yangshuo en bicicleta/i,        id: 'photo-1773318901379-aac92fdf5611' }, // karst countryside cycling
  { q: /arrozales en terrazas de longji/i, id: 'photo-1559342825-3b44d9468086' }, // Longji rice terraces
  { q: /cueva de la flauta de ca.a/i,   id: 'photo-1619275044672-8b95b2d80ce7' }, // cave stalactites lit
  { q: /impression liu sanjie/i,        id: 'photo-1740982880907-8283141e8db6' }, // outdoor show night river
  { q: /rafting en el r.o yulong/i,     id: 'photo-1514920735211-8c697444a248' }, // river bamboo raft
  { q: /colina de la trompa de elefante/i, id: 'photo-1701668910380-b44dcc028525' }, // Elephant Trunk Hill
  { q: /mercado nocturno de yangshuo/i, id: 'photo-1754638335214-e61ae430b876' }, // Chinese night market
  { q: /pintura china en yangshuo/i,    id: 'photo-1762115839715-fbd4e2c65260' }, // Chinese ink painting

  // ── LHASA ──────────────────────────────────
  { q: /palacio potala/i,               id: 'photo-1741257091145-69d62cdf819a' }, // Potala Palace
  { q: /jokhang y barkhor/i,            id: 'photo-1782317341310-335b55dc6537' }, // Tibetan monastery
  { q: /monasterio de sera/i,           id: 'photo-1747643607854-9f0d93c8c790' }, // Tibetan monastery monks
  { q: /lago namtso/i,                  id: 'photo-1760326604065-a007f0b19646' }, // Tibetan snow mountain lake
  { q: /t. de mantequilla de yak/i,     id: 'photo-1735651705963-1e8bd1f01e47' }, // tea pouring traditional
  { q: /monasterio de drepung/i,        id: 'photo-1747643607854-9f0d93c8c790' }, // Tibetan monastery
  { q: /kora alrededor del potala/i,    id: 'photo-1741257091145-69d62cdf819a' }, // Potala Palace
  { q: /momos y thukpa/i,               id: 'photo-1560343787-b90cb337028e' },    // Tibetan dumplings food

  // ── DALI ───────────────────────────────────
  { q: /ciudad antigua de dali/i,       id: 'photo-1542640244-7e672d6cef4e' },    // Dali old town white walls
  { q: /lago erhai en bicicleta/i,      id: 'photo-1773318901073-3d9304c6f48b' }, // lake cycling Yunnan
  { q: /tres pagodas de chongsheng/i,   id: 'photo-1576631368362-bec8b131571b' }, // Three Pagodas Dali
  { q: /mercado de xizhou/i,            id: 'photo-1758021358414-59e46a1f1147' }, // flower market colorful
  { q: /senderismo en cangshan/i,       id: 'photo-1771967141873-8b714205f4bd' }, // mountain hiking
  { q: /ceremon.a del t. bai/i,         id: 'photo-1759356864606-cf371a5ba5f5' }, // tea ceremony three cups
  { q: /shuanglang/i,                   id: 'photo-1773318901073-3d9304c6f48b' }, // lakeside fishing village
  { q: /tie-dye bai/i,                  id: 'photo-1549167008-f02ad8abf052' },    // traditional craft fabric
  { q: /cervecer.a artesanal bad monkey/i, id: 'photo-1674038316942-cd7c80cf0057' }, // craft beer bohemian

  // ── XIAMEN ─────────────────────────────────
  { q: /isla de gulangyu/i,             id: 'photo-1740982880907-8283141e8db6' }, // island pedestrian colonial
  { q: /templo budista nanputuo/i,       id: 'photo-1748786919806-464841e61654' }, // Buddhist temple mountain
  { q: /ruta costera de xiamen/i,        id: 'photo-1784057098851-b31bb06b66e5' }, // coastal path beach
  { q: /cultura del t. fujian/i,         id: 'photo-1759356864606-cf371a5ba5f5' }, // Oolong tea ceremony
  { q: /marisco en zengcuo/i,            id: 'photo-1647068804459-5f0796b19935' }, // seafood coastal dinner
  { q: /jard.n bot.nico wanshi/i,        id: 'photo-1769931446194-ede80f4a1719' }, // tropical botanical garden
  { q: /tulou de fujian/i,               id: 'photo-1761667625209-e3f9145e93eb' }, // circular earthen village
  { q: /calle zhongshan.*peatonal/i,     id: 'photo-1526139334526-f591a54b477c' }, // colonial shopping arcade
  { q: /piano museum/i,                  id: 'photo-1759350414710-77dc7714fdae' }, // cultural island

  // ── SUZHOU ─────────────────────────────────
  { q: /administrador humilde/i,         id: 'photo-1765004775728-e99163f1767d' }, // Suzhou classical garden
  { q: /canales de suzhou en g.ndola/i,  id: 'photo-1726894369361-75f1ff62f366' }, // Suzhou canal gondola
  { q: /museo de la seda de suzhou/i,    id: 'photo-1549167008-f02ad8abf052' },    // silk cultural museum
  { q: /calle pingjiang/i,               id: 'photo-1760535560909-15b15c3be8b5' }, // canal street shopping
  { q: /maestro de las redes/i,          id: 'photo-1757604564946-d70adb40dd2e' }, // Suzhou garden pavilion
  { q: /colina del tigre/i,              id: 'photo-1565054590237-9ec80969fbc7' }, // Suzhou Tiger Hill pagoda
  { q: /tongli/i,                        id: 'photo-1689827524021-7d99d37c55c7' }, // water town canal
  { q: /gastronom.a de suzhou/i,         id: 'photo-1613902260357-f5e11151d2bb' }, // Suzhou refined cuisine

  // ── LIJIANG ────────────────────────────────
  { q: /ciudad antigua de lijiang/i,     id: 'photo-1761667625209-e3f9145e93eb' }, // Naxi old town wooden
  { q: /monta.a del drag.n de jade/i,    id: 'photo-1677922069750-944be2b9ad20' }, // Jade Dragon Snow Mountain
  { q: /impression lijiang/i,            id: 'photo-1762417422848-20e759043e99' }, // outdoor cultural show
  { q: /garganta del salto del tigre/i,  id: 'photo-1773318901073-3d9304c6f48b' }, // deep river canyon
  { q: /estanque del drag.n negro/i,     id: 'photo-1677922069750-944be2b9ad20' }, // Black Dragon Pool mountain
  { q: /m.sica dongba/i,                 id: 'photo-1759350414710-77dc7714fdae' }, // traditional Naxi music
  { q: /lago lugu/i,                     id: 'photo-1782317341310-335b55dc6537' }, // Tibetan/Mosuo mountain lake
  { q: /pueblo de baisha/i,              id: 'photo-1748786919806-464841e61654' }, // Naxi village temple fresco

  // ── ZHANGJIAJIE ────────────────────────────
  { q: /parque nacional de zhangjiajie/i, id: 'photo-1561031454-4f1331bd2a34' }, // avatar mountains pillars
  { q: /puente de cristal de zhangjiajie/i, id: 'photo-1543569128-1221ed287623' }, // glass bridge adventure
  { q: /monta.a tianmen/i,               id: 'photo-1561031454-4f1331bd2a34' }, // dramatic Tianmen cliffs
  { q: /arroyo del l.tigo dorado/i,      id: 'photo-1773318901073-3d9304c6f48b' }, // forested canyon stream
  { q: /ascensor bailong/i,              id: 'photo-1561031454-4f1331bd2a34' }, // Zhangjiajie elevator view
  { q: /tianmen fox fairy/i,             id: 'photo-1762417422848-20e759043e99' }, // outdoor night show
  { q: /fenghuang/i,                     id: 'photo-1761667625209-e3f9145e93eb' }, // ancient Chinese river town
  { q: /cocina de hunan/i,               id: 'photo-1526401363794-c96708fb8089' }, // spicy Hunan food

  // ── KUNMING ────────────────────────────────
  { q: /bosque de piedra/i,              id: 'photo-1561031454-4f1331bd2a34' }, // stone forest karst pillars
  { q: /mercado de flores de dounan/i,   id: 'photo-1758021358414-59e46a1f1147' }, // flower market colorful
  { q: /templo de yuantong/i,            id: 'photo-1659466248885-8b7a03205661' }, // Buddhist temple lake
  { q: /lago dian en bicicleta/i,        id: 'photo-1514920735211-8c697444a248' }, // lake cycling
  { q: /pueblo .tnico de yunnan/i,       id: 'photo-1542640244-7e672d6cef4e' },   // ethnic minority village
  { q: /pollo al vapor en olla/i,        id: 'photo-1613902260357-f5e11151d2bb' }, // Chinese clay pot cooking
  { q: /monta.as del oeste.*xishan/i,    id: 'photo-1771967141873-8b714205f4bd' }, // Xishan mountain hiking
  { q: /fideos cruzando el puente/i,     id: 'photo-1767818375229-be50b2b070ef' }, // Yunnan crossing bridge noodles

  // ── NANJING ────────────────────────────────
  { q: /mausoleo de sun yat/i,           id: 'photo-1619275044672-8b95b2d80ce7' }, // grand mausoleum steps
  { q: /templo de confucio.*fuzimiao/i,  id: 'photo-1760535560909-15b15c3be8b5' }, // Confucius Temple night market
  { q: /muralla de nanjing/i,            id: 'photo-1509624780899-f812439647e4' }, // ancient city wall
  { q: /masacre de nanjing/i,            id: 'photo-1701913997567-746dd137eff6' }, // solemn memorial
  { q: /lago xuanwu/i,                   id: 'photo-1749834182098-43048a2571ae' }, // lakeside pagoda wall
  { q: /pato salado de nanjing/i,        id: 'photo-1767818375229-be50b2b070ef' }, // duck dish Nanjing
  { q: /monta.a p.rpura.*zijinshan/i,    id: 'photo-1586788630595-bbd71f6f8646' }, // forested purple mountain park
  { q: /avenida de los pl.tanos/i,       id: 'photo-1549167008-f02ad8abf052' },    // tree-lined avenue

  // ── DUNHUANG ───────────────────────────────
  { q: /cuevas de mogao/i,               id: 'photo-1760020423741-500a95bc5237' }, // Mogao Buddhist cave art
  { q: /dunas de mingsha/i,              id: 'photo-1755417288410-38dec02df787' }, // Mingsha sand dunes aerial
  { q: /paso de yumen/i,                 id: 'photo-1755417288410-38dec02df787' }, // desert ruins ancient pass
  { q: /mercado nocturno de shazhou/i,   id: 'photo-1754638335214-e61ae430b876' }, // Silk Road night market
  { q: /yardang national/i,              id: 'photo-1755417288410-38dec02df787' }, // Gobi desert formations
  { q: /paseo en camello por el gobi/i,  id: 'photo-1613757963897-3cc6dd4b671f' }, // camel caravan desert
  { q: /buda occidental.*xiqianfo/i,     id: 'photo-1759108272457-e63341a65b20' }, // Buddhist cave statues
  { q: /observaci.n de estrellas.*gobi/i, id: 'photo-1778385186919-9dab23e69d35' }, // starry night desert

  // ── SANYA ──────────────────────────────────
  { q: /playa.*yalong bay/i,             id: 'photo-1784057098851-b31bb06b66e5' }, // tropical beach Sanya
  { q: /guanyin del mar del sur/i,       id: 'photo-1748786919806-464841e61654' }, // Buddhist Guanyin statue
  { q: /wuzhizhou.*snorkel/i,            id: 'photo-1756312091180-b591dd1559de' }, // snorkeling coral reef
  { q: /yanoda/i,                        id: 'photo-1769931446194-ede80f4a1719' }, // tropical rainforest
  { q: /mariscos en dadonghai/i,         id: 'photo-1647068804459-5f0796b19935' }, // tropical seafood
  { q: /tianya haijiao/i,                id: 'photo-1784057098851-b31bb06b66e5' }, // coastal rocks beach
  { q: /surf en houhai/i,                id: 'photo-1771967141873-8b714205f4bd' }, // ocean waves surfing
  { q: /coco fresco en hainan/i,         id: 'photo-1560343787-b90cb337028e' },    // tropical coconut food

  // ── PINGYAO ────────────────────────────────
  { q: /muralla de pingyao/i,            id: 'photo-1576204557749-ca7052a2865a' }, // Pingyao ancient wall
  { q: /primer banco de china/i,         id: 'photo-1576631368362-bec8b131571b' }, // Rishengchang historic bank
  { q: /calle ming-qing/i,               id: 'photo-1761667625209-e3f9145e93eb' }, // Ming-Qing old street lanterns
  { q: /vinagre de pingyao/i,            id: 'photo-1613902260357-f5e11151d2bb' }, // Shanxi vinegar fermentation
  { q: /templo shuanglin/i,              id: 'photo-1748786919806-464841e61654' }, // Buddhist temple sculptures
  { q: /pingyao encounter/i,             id: 'photo-1762417422848-20e759043e99' }, // immersive theater show
  { q: /noche en casa patio/i,           id: 'photo-1740982880907-8283141e8db6' }, // traditional courtyard house
  { q: /gastronom.a de shanxi.*fideos/i, id: 'photo-1767324672653-84c017d85d8e' }, // Shanxi handcut noodles
];

// ─────────────────────────────────────────────
//  ROUTES  (title regex → CDN photo ID)
// ─────────────────────────────────────────────
const rutaUpdates = [
  // PEKÍN
  { q: /pek.n imperial/i,               id: 'photo-1547981609-4b6bfe67ca0b' }, // Forbidden City
  { q: /pek.n express/i,                id: 'photo-1509624780899-f812439647e4' }, // Great Wall
  { q: /pek.n completo/i,               id: 'photo-1753166890334-55a89f788a6c' }, // Tiananmen Square

  // SHANGHÁI
  { q: /shangh.i moderna/i,             id: 'photo-1748078096034-46086f5b87da' }, // Shanghai night skyline
  { q: /shangh.i express/i,             id: 'photo-1495446815901-a7297e633e8d' }, // The Bund
  { q: /shangh.i y alrededores/i,       id: 'photo-1689827524021-7d99d37c55c7' }, // water town

  // CHENGDÚ
  { q: /pandas y sabores/i,             id: 'photo-1704158679186-9e3082167277' }, // panda
  { q: /chengd. express/i,              id: 'photo-1526401363794-c96708fb8089' }, // hot pot
  { q: /leshan/i,                       id: 'photo-1759108368762-dcadd0e31edd' }, // Leshan Buddha

  // CHONGQING
  { q: /ciudad monta.a/i,               id: 'photo-1586784444981-ac96e335555c' }, // Hongya Cave night
  { q: /chongqing nocturna/i,           id: 'photo-1748078096034-46086f5b87da' }, // Chongqing night skyline
  { q: /chongqing completo/i,           id: 'photo-1761667625209-e3f9145e93eb' }, // Ciqikou ancient town

  // HARBIN
  { q: /reino del hielo/i,              id: 'photo-1768423935512-858cd32aecf7' }, // ice sculptures night
  { q: /harbin express/i,               id: 'photo-1641063157251-ae9d815e5daa' }, // Siberian tiger
  { q: /aldea de la nieve/i,            id: 'photo-1760645611765-a3df6c92bda3' }, // snow village

  // XI'AN
  { q: /guerreros y murallas/i,         id: 'photo-1523946963389-207478f6cb2e' }, // terracotta warriors
  { q: /xi.an express/i,                id: 'photo-1716929955955-f6ef9c1ca084' }, // city wall
  { q: /monte huashan/i,                id: 'photo-1771967141873-8b714205f4bd' }, // Huashan mountain

  // CANTÓN
  { q: /cant.n express/i,               id: 'photo-1767324672653-84c017d85d8e' }, // dim sum
  { q: /cant.n gastron.mico/i,          id: 'photo-1767818375229-be50b2b070ef' }, // Cantonese food
  { q: /cant.n y hong kong/i,           id: 'photo-1753172115293-32b2a08f0798' }, // Canton Tower

  // HANGZHOU
  { q: /para.so en la tierra/i,         id: 'photo-1751012325074-94e4fab31697' }, // West Lake
  { q: /hangzhou express/i,             id: 'photo-1743401434828-5a026d661211' }, // tea plantation
  { q: /hangzhou completo/i,            id: 'photo-1748786919806-464841e61654' }, // Lingyin temple

  // GUILIN
  { q: /paisajes de pintura/i,          id: 'photo-1773318901379-aac92fdf5611' }, // Li River karst
  { q: /guilin express/i,               id: 'photo-1559342825-3b44d9468086' }, // Longji terraces
  { q: /terrazas de longji/i,           id: 'photo-1559342825-3b44d9468086' }, // Longji terraces

  // LHASA
  { q: /lhasa espiritual/i,             id: 'photo-1741257091145-69d62cdf819a' }, // Potala Palace
  { q: /lhasa express/i,                id: 'photo-1782317341310-335b55dc6537' }, // Tibetan monastery
  { q: /lago namtso/i,                  id: 'photo-1760326604065-a007f0b19646' }, // Namtso Lake Tibet

  // LIJIANG
  { q: /ciudad naxi/i,                  id: 'photo-1677922069750-944be2b9ad20' }, // Jade Dragon Mountain
  { q: /garganta y lago lugu/i,         id: 'photo-1782317341310-335b55dc6537' }, // mountain lake
  { q: /lijiang express/i,              id: 'photo-1761667625209-e3f9145e93eb' }, // Lijiang old town

  // ZHANGJIAJIE
  { q: /monta.as de avatar/i,           id: 'photo-1561031454-4f1331bd2a34' }, // avatar mountains
  { q: /zhangjiajie express/i,          id: 'photo-1561031454-4f1331bd2a34' }, // Zhangjiajie pillars
  { q: /zhangjiajie y fenghuang/i,      id: 'photo-1761667625209-e3f9145e93eb' }, // Fenghuang ancient town

  // KUNMING
  { q: /eterna primavera/i,             id: 'photo-1758021358414-59e46a1f1147' }, // Kunming flower market
  { q: /kunming express/i,              id: 'photo-1659466248885-8b7a03205661' }, // Yuantong temple
  { q: /kunming completo/i,             id: 'photo-1561031454-4f1331bd2a34' }, // Stone Forest

  // NANJING
  { q: /capital de seis din/i,          id: 'photo-1619275044672-8b95b2d80ce7' }, // Sun Yat-sen mausoleum
  { q: /nanjing express/i,              id: 'photo-1509624780899-f812439647e4' }, // Nanjing wall
  { q: /nanjing completo/i,             id: 'photo-1749834182098-43048a2571ae' }, // Xuanwu Lake

  // DUNHUANG
  { q: /ruta de la seda/i,              id: 'photo-1760020423741-500a95bc5237' }, // Mogao caves
  { q: /dunhuang express/i,             id: 'photo-1613757963897-3cc6dd4b671f' }, // camel desert
  { q: /dunhuang y el gobi/i,           id: 'photo-1755417288410-38dec02df787' }, // Gobi sand dunes

  // SANYA
  { q: /sanya tropical.*3/i,            id: 'photo-1784057098851-b31bb06b66e5' }, // Yalong Bay beach
  { q: /sanya express/i,                id: 'photo-1756312091180-b591dd1559de' }, // snorkeling coral
  { q: /sanya aventura/i,               id: 'photo-1769931446194-ede80f4a1719' }, // tropical adventure

  // PINGYAO
  { q: /viaje al pasado imperial/i,     id: 'photo-1576204557749-ca7052a2865a' }, // Pingyao ancient wall
  { q: /pingyao express/i,              id: 'photo-1576631368362-bec8b131571b' }, // historic bank
  { q: /templos de shanxi/i,            id: 'photo-1748786919806-464841e61654' }, // Shanxi Buddhist temple

  // DALI
  { q: /dali bohemia/i,                 id: 'photo-1542640244-7e672d6cef4e' }, // Dali old town
  { q: /dali express/i,                 id: 'photo-1773318901073-3d9304c6f48b' }, // Erhai lake
  { q: /dali y cangshan/i,              id: 'photo-1771967141873-8b714205f4bd' }, // Cangshan mountain

  // XIAMEN
  { q: /xiamen y gulangyu/i,            id: 'photo-1740982880907-8283141e8db6' }, // Gulangyu island
  { q: /xiamen express/i,               id: 'photo-1784057098851-b31bb06b66e5' }, // Xiamen coastal
  { q: /tulou de fujian/i,              id: 'photo-1761667625209-e3f9145e93eb' }, // Tulou earthen buildings

  // SUZHOU
  { q: /jardines y canales/i,           id: 'photo-1765004775728-e99163f1767d' }, // Suzhou garden
  { q: /suzhou express/i,               id: 'photo-1726894369361-75f1ff62f366' }, // Suzhou canal
  { q: /suzhou y tongli/i,              id: 'photo-1689827524021-7d99d37c55c7' }, // Tongli water town
];

// ─────────────────────────────────────────────
//  RUNNER
// ─────────────────────────────────────────────
const run = async () => {
  await connectDB();

  console.log('\n── Updating activities ──');
  let actUpdated = 0;
  for (const { q, id } of activityUpdates) {
    const url = img(id);
    const r = await Activity.updateMany({ nombre: q }, { $set: { imagen: url } });
    if (r.modifiedCount > 0) {
      console.log(`  ✓ ${q} → ${id} (${r.modifiedCount})`);
      actUpdated += r.modifiedCount;
    }
    // not printing "not found" to keep output clean
  }
  console.log(`\n  ${actUpdated} activities updated.\n`);

  console.log('── Updating routes ──');
  let rutaUpdated = 0;
  for (const { q, id } of rutaUpdates) {
    const url = img(id);
    const r = await Ruta.updateMany({ titulo: q }, { $set: { imagen: url } });
    if (r.modifiedCount > 0) {
      console.log(`  ✓ ${q} → ${id} (${r.modifiedCount})`);
      rutaUpdated += r.modifiedCount;
    }
  }
  console.log(`\n  ${rutaUpdated} routes updated.\n`);

  await mongoose.disconnect();
};

run().catch((err) => { console.error(err); process.exit(1); });
