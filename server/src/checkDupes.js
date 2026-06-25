import connectDB from './config/db.js';
import Ruta from './models/Ruta.js';
import City from './models/City.js';

const run = async () => {
  await connectDB();

  // Check specific guides
  const g1 = await Ruta.findById('69bd56528d5ee4d6a918ab43').populate('ciudad','nombre slug');
  const g2 = await Ruta.findById('69bae5e38f6a5296849b2522').populate('ciudad','nombre slug');
  console.log('G1:', g1?.titulo, '|', g1?.ciudad?.nombre, '|', g1?.imagen);
  console.log('G2:', g2?.titulo, '|', g2?.ciudad?.nombre, '|', g2?.imagen);

  // Check ALL guides for duplicate images
  const all = await Ruta.find({}, 'titulo imagen ciudad').populate('ciudad','nombre slug');
  const imgCount = {};
  for (const g of all) {
    const base = g.imagen?.split('?')[0] || 'none';
    if (!imgCount[base]) imgCount[base] = [];
    imgCount[base].push(`${g.titulo} (${g.ciudad?.nombre})`);
  }
  console.log('\n=== DUPLICATE GUIDE IMAGES ===');
  let dupes = 0;
  for (const [img, guides] of Object.entries(imgCount)) {
    if (guides.length > 1) {
      dupes++;
      console.log(`\n${img.replace('https://images.unsplash.com/','')}:`);
      guides.forEach(g => console.log(`  - ${g}`));
    }
  }
  if (!dupes) console.log('No duplicates found');
  else console.log(`\nTotal: ${dupes} duplicated images`);

  process.exit(0);
};
run();
