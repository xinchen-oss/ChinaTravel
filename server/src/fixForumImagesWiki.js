/**
 * Asigna FOTOS REALES (Wikimedia Commons) a los posts del FORO,
 * según el tema de cada publicación.  Ejecutar:
 *   node src/fixForumImagesWiki.js
 */
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import ForumPost from './models/ForumPost.js';

const UA = 'ChinaTravelThesis/1.0 (educational project; contact: student@upm.es)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const BAD = /(\bmap\b|mapa|flag|bandera|logo|icon|coat[_ ]of[_ ]arms|escudo|locator|location|seal|\.svg|\.gif|\.pdf|diagram|plan_|chart|stamp|sello|banknote|coin|moneda|portrait|emblem|topograph|satellite|nasa|metro|subway|light[_ ]rail|railway[_ ]station|\bsta\b|\bstation\b|airport|aeropuerto)/i;

// Según palabras clave del título → búsqueda precisa en Commons.
const HINTS = [
  ['ano nuevo', 'Chinese New Year temple fair lanterns'],
  ['nuevo chino', 'Chinese New Year temple fair lanterns'],
  ['bund', 'The Bund Shanghai night Pudong'],
  ['pudong', 'Pudong Shanghai skyline night'],
  ['gran muralla', 'Great Wall of China Mutianyu'],
  ['terracota', 'Terracotta Army Xian'],
  ['guerreros', 'Terracotta Army Xian'],
  ['pandas', 'Giant panda Chengdu'],
  ['chengdu', 'Giant panda Chengdu'],
  ['mogao', 'Mogao Caves Dunhuang'],
  ['dunhuang', 'Mogao Caves Dunhuang'],
  ['ruta de la seda', 'Mogao Caves Dunhuang'],
  ['harbin', 'Harbin International Ice and Snow Festival'],
  ['festival de hielo', 'Harbin International Ice and Snow Festival'],
  ['guilin', 'Guilin Li River karst landscape'],
  ['rio li', 'Li River Guilin karst'],
  ['xian', 'Terracotta Army Xian'],
];

function buildQuery(title) {
  const n = norm(title);
  for (const [frag, q] of HINTS) if (n.includes(frag)) return q;
  return 'China landscape Great Wall'; // genérico para consejos generales
}

async function commonsSearch(query, limit = 12) {
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json' +
    '&generator=search&gsrnamespace=6&gsrlimit=' + limit +
    '&gsrsearch=' + encodeURIComponent(query) +
    '&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=900';
  let data = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      const text = await res.text();
      if (res.ok && text.startsWith('{')) { data = JSON.parse(text); break; }
    } catch { /* reintenta */ }
    await sleep(800 * (attempt + 1));
  }
  if (!data) return [];
  const pages = data.query?.pages ? Object.values(data.query.pages) : [];
  pages.sort((a, b) => (a.index || 0) - (b.index || 0));
  const out = [];
  for (const p of pages) {
    const info = p.imageinfo?.[0];
    if (!info || !info.thumburl) continue;
    if (BAD.test(p.title) || BAD.test(info.url)) continue;
    if (info.mime && !/jpeg|png/.test(info.mime)) continue;
    out.push({ url: info.thumburl, landscape: (info.width || 0) >= (info.height || 0) });
  }
  return [...out.filter((x) => x.landscape), ...out.filter((x) => !x.landscape)];
}

const used = new Set();
function choose(c) {
  if (!c.length) return null;
  const pick = c.find((x) => !used.has(x.url)) || c[0];
  used.add(pick.url);
  return pick.url;
}

async function run() {
  await connectDB();
  // Solo posts principales (no respuestas).
  const posts = await ForumPost.find({ parentPost: null });
  let ok = 0;
  for (const post of posts) {
    const url = choose(await commonsSearch(buildQuery(post.titulo)));
    if (url) { post.imagen = url; await post.save(); ok++; }
    await sleep(400);
  }
  console.log(`✅ Posts del foro actualizados: ${ok}/${posts.length} (únicas: ${used.size})`);
  await mongoose.connection.close();
  console.log('🏁 Hecho.');
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
