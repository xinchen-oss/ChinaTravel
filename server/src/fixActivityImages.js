import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Activity from './models/Activity.js';

// Specific image corrections for activities that have wrong/generic images
const updates = [
  // CHENGDÚ
  { nombre: 'Centro de Pandas Gigantes',     img: 'photo-1704158679186-9e3082167277' }, // panda eating bamboo
  { nombre: 'Buda Gigante de Leshan',        img: 'photo-1759108368762-dcadd0e31edd' }, // Leshan giant Buddha

  // SHANGHÁI
  { nombre: 'Xiaolongbao en Din Tai Fung',   img: 'photo-1563245372-f21724e3856d' }, // steamed dumplings

  // CANTÓN
  { nombre: 'Dim Sum en Cantón',             img: 'photo-1767324672653-84c017d85d8e' }, // bamboo steamer dim sum

  // HARBIN
  { nombre: 'Festival de Hielo y Nieve',     img: 'photo-1768423935512-858cd32aecf7' }, // ice sculptures in snow park
  { nombre: 'Tigres siberianos de Harbin',   img: 'photo-1641063157251-ae9d815e5daa' }, // tiger standing in snow
  { nombre: 'Aldea de la Nieve (Xuexiang)',  img: 'photo-1760645611765-a3df6c92bda3' }, // snow-covered village

  // XI'AN
  { nombre: 'Guerreros de Terracota',        img: 'photo-1523946963389-207478f6cb2e' }, // terracotta warriors

  // GUILIN
  { nombre: 'Crucero por el río Li',         img: 'photo-1773318901379-aac92fdf5611' }, // karst mountains river

  // LHASA
  { nombre: 'Palacio Potala',                img: 'photo-1741257091145-69d62cdf819a' }, // Potala Palace

  // SANYA
  { nombre: 'Playa de Yalong Bay',           img: 'photo-1784057098851-b31bb06b66e5' }, // tropical beach

  // DUNHUANG
  { nombre: 'Dunas de Mingsha y Lago de la Media Luna', img: 'photo-1755417288410-38dec02df787' }, // sand dunes aerial
  { nombre: 'Cuevas de Mogao',               img: 'photo-1760020423741-500a95bc5237' }, // cave Buddhist statues
  { nombre: 'Cuevas del Buda Occidental (Xiqianfo)', img: 'photo-1759108272457-e63341a65b20' }, // Buddhist cave art
];

const run = async () => {
  await connectDB();

  let updated = 0;
  for (const { nombre, img } of updates) {
    const url = `https://images.unsplash.com/${img}?w=800&q=80`;
    const result = await Activity.updateMany(
      { nombre: { $regex: nombre, $options: 'i' } },
      { $set: { imagen: url } }
    );
    if (result.modifiedCount > 0) {
      console.log(`✓ ${nombre} → ${img} (${result.modifiedCount} docs)`);
      updated += result.modifiedCount;
    } else {
      console.log(`✗ NOT FOUND: ${nombre}`);
    }
  }

  console.log(`\nDone. ${updated} activities updated.`);
  await mongoose.disconnect();
};

run().catch((err) => { console.error(err); process.exit(1); });
