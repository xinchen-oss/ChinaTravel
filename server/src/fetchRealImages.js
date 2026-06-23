// Fetch REAL Unsplash photo IDs by scraping photo pages
const searches = [
  // [label, unsplash photo slug from search results]
  // PEKIN
  ['pekin_city', '2RGwK0NDLv8'],      // forbidden city aerial
  ['pekin_g1', 'eLGhJO5Vlgw'],        // forbidden city grand
  ['pekin_g2', 'zgsC4lTn7W8'],        // beijing aerial
  ['pekin_g3', 'aaV5E1xWTn8'],        // forbidden city
  // SHANGHAI
  ['shanghai_city', 'NldT0B6aKrI'],   // shanghai skyline night
  ['shanghai_g1', '2PgV2SS1JiE'],     // shanghai skyline 2
  ['shanghai_g2', 'mnyJEvSLtvk'],     // oriental pearl
  ['shanghai_g3', '0p37Ch2LYQc'],     // shanghai cloudy
];

async function getPhotoId(slug) {
  try {
    const res = await fetch(`https://unsplash.com/photos/${slug}`, { redirect: 'follow' });
    const html = await res.text();
    const matches = [...html.matchAll(/https:\/\/images\.unsplash\.com\/(photo-[0-9]+-[a-f0-9]+)\?/g)];
    const ids = [...new Set(matches.map(m => m[1]))];
    return ids[0] || null;
  } catch (e) { return null; }
}

// First, let's try many search pages to find slugs
async function searchSlugs(query) {
  try {
    const res = await fetch(`https://unsplash.com/s/photos/${encodeURIComponent(query)}`, { redirect: 'follow' });
    const html = await res.text();
    // Extract photo slugs from search results
    const matches = [...html.matchAll(/\/photos\/([a-zA-Z0-9_-]{8,})/g)];
    const slugs = [...new Set(matches.map(m => m[1]))].filter(s => !s.includes('photos'));
    return slugs.slice(0, 5);
  } catch (e) { return []; }
}

async function getFirstWorkingId(query) {
  const slugs = await searchSlugs(query);
  for (const slug of slugs) {
    const id = await getPhotoId(slug);
    if (id) {
      const check = await fetch(`https://images.unsplash.com/${id}?w=100`, { method: 'HEAD' });
      if (check.ok) return id;
    }
  }
  return null;
}

// All searches we need: city + 3 guides = 4 per city x 30 cities = 120
const allSearches = [
  // Pekin
  'beijing-forbidden-city', 'beijing-great-wall', 'beijing-temple-heaven', 'beijing-tiananmen',
  // Shanghai
  'shanghai-bund', 'shanghai-pudong-skyline', 'shanghai-yuyuan-garden', 'shanghai-french-concession',
  // Chengdu
  'chengdu-panda', 'chengdu-jinli-street', 'sichuan-hot-pot', 'leshan-giant-buddha',
  // Chongqing
  'chongqing-skyline', 'chongqing-hongya-cave', 'chongqing-hotpot', 'yangtze-river-cruise',
  // Harbin
  'harbin-ice-festival', 'harbin-saint-sophia', 'harbin-snow', 'harbin-central-street',
  // Xian
  'xian-terracotta-warriors', 'xian-city-wall', 'xian-muslim-quarter', 'xian-wild-goose-pagoda',
  // Guangzhou
  'guangzhou-canton-tower', 'dim-sum-chinese', 'pearl-river-guangzhou', 'shamian-island',
  // Hangzhou
  'hangzhou-west-lake', 'longjing-tea-plantation', 'lingyin-temple', 'hangzhou-pagoda',
  // Guilin
  'guilin-karst-mountains', 'li-river-china', 'longji-rice-terraces', 'yangshuo-bicycle',
  // Lhasa
  'potala-palace-lhasa', 'tibet-prayer-flags', 'jokhang-temple', 'tibet-mountains',
  // Dali
  'dali-three-pagodas', 'erhai-lake', 'cangshan-mountain', 'dali-old-town',
  // Xiamen
  'gulangyu-island', 'xiamen-beach', 'nanputuo-temple', 'xiamen-coast',
  // Suzhou
  'suzhou-garden', 'suzhou-canal', 'suzhou-silk', 'tiger-hill-suzhou',
  // Lijiang
  'lijiang-old-town', 'jade-dragon-snow-mountain', 'naxi-culture', 'black-dragon-pool',
  // Zhangjiajie
  'zhangjiajie-pillars', 'zhangjiajie-glass-bridge', 'tianmen-mountain', 'zhangjiajie-forest',
  // Kunming
  'kunming-stone-forest', 'kunming-green-lake', 'yunnan-flowers', 'kunming-western-hills',
  // Nanjing
  'nanjing-city-wall', 'xuanwu-lake-nanjing', 'sun-yat-sen-mausoleum', 'confucius-temple-nanjing',
  // Dunhuang
  'dunhuang-mogao-caves', 'gobi-desert-dunes', 'crescent-moon-spring', 'silk-road-camel',
  // Sanya
  'sanya-beach', 'nanshan-guanyin', 'yalong-bay', 'hainan-tropical',
  // Pingyao
  'pingyao-ancient-city', 'pingyao-wall', 'chinese-courtyard-house', 'shanxi-noodles',
  // Shenzhen
  'shenzhen-skyline', 'shenzhen-technology', 'shenzhen-night', 'shenzhen-modern',
  // Wuhan
  'wuhan-yellow-crane-tower', 'wuhan-cherry-blossom', 'chinese-noodles-bowl', 'wuhan-east-lake',
  // Qingdao
  'qingdao-coast', 'tsingtao-beer', 'qingdao-german-architecture', 'sailing-regatta',
  // Changsha
  'changsha-orange-island', 'hunan-spicy-food', 'yuelu-academy', 'changsha-night',
  // Tianjin
  'tianjin-eye', 'tianjin-italian-quarter', 'chinese-baozi', 'tianjin-haihe-river',
  // Chengde
  'chengde-mountain-resort', 'putuozongcheng-temple', 'chinese-imperial-garden', 'chengde-temple',
  // Huangshan
  'huangshan-mountain', 'hongcun-village', 'huangshan-sunrise', 'chinese-hot-spring',
  // Fuzhou
  'fuzhou-three-lanes', 'chinese-banyan-tree', 'jasmine-tea', 'fujian-temple',
  // Luoyang
  'longmen-grottoes', 'peony-flower', 'shaolin-temple', 'chinese-buddhist-statue',
  // Guiyang
  'huangguoshu-waterfall', 'miao-village-china', 'guizhou-nature', 'miao-silver-jewelry',
];

console.log(`Searching ${allSearches.length} queries...`);

const results = {};
const usedIds = new Set();

for (let i = 0; i < allSearches.length; i++) {
  const query = allSearches[i];
  process.stdout.write(`[${i + 1}/${allSearches.length}] ${query}... `);

  const slugs = await searchSlugs(query);
  let found = false;

  for (const slug of slugs) {
    const id = await getPhotoId(slug);
    if (id && !usedIds.has(id)) {
      const check = await fetch(`https://images.unsplash.com/${id}?w=100`, { method: 'HEAD' });
      if (check.ok) {
        results[query] = id;
        usedIds.add(id);
        console.log('✅', id);
        found = true;
        break;
      }
    }
  }

  if (!found) {
    console.log('❌ no result');
  }

  // Small delay to avoid rate limiting
  await new Promise(r => setTimeout(r, 300));
}

console.log(`\nFound ${Object.keys(results).length}/${allSearches.length} images`);
console.log('\n// Copy this into fixRealImages.js:');
console.log('const VERIFIED = ' + JSON.stringify(results, null, 2) + ';');
