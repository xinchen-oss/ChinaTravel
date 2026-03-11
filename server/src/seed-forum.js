import connectDB from './config/db.js';
import User from './models/User.js';
import ForumPost from './models/ForumPost.js';
import City from './models/City.js';

const seed = async () => {
  await connectDB();

  // Get cities for references
  const cities = await City.find({}).lean();
  const cityMap = {};
  for (const c of cities) cityMap[c.nombre] = c._id;

  // Create forum users
  const users = await User.create([
    {
      nombre: 'Carlos',
      apellidos: 'Garcia Martinez',
      email: 'carlos.garcia@gmail.com',
      password: 'carlos123',
      telefono: '+34 612 345 678',
      fechaNacimiento: new Date('1990-05-15'),
      genero: 'MASCULINO',
      nacionalidad: 'Espanola',
      direccion: { calle: 'Calle Gran Via 42', ciudad: 'Madrid', codigoPostal: '28013', pais: 'Espana' },
      role: 'USER',
    },
    {
      nombre: 'Maria',
      apellidos: 'Lopez Fernandez',
      email: 'maria.lopez@hotmail.com',
      password: 'maria123',
      telefono: '+34 698 765 432',
      fechaNacimiento: new Date('1988-11-22'),
      genero: 'FEMENINO',
      nacionalidad: 'Espanola',
      direccion: { calle: 'Avinguda Diagonal 150', ciudad: 'Barcelona', codigoPostal: '08018', pais: 'Espana' },
      role: 'USER',
    },
    {
      nombre: 'Pablo',
      apellidos: 'Ruiz Sanchez',
      email: 'pablo.ruiz@yahoo.es',
      password: 'pablo123',
      telefono: '+34 655 123 789',
      fechaNacimiento: new Date('1995-03-08'),
      genero: 'MASCULINO',
      nacionalidad: 'Espanola',
      direccion: { calle: 'Calle Sierpes 28', ciudad: 'Sevilla', codigoPostal: '41004', pais: 'Espana' },
      role: 'USER',
    },
    {
      nombre: 'Ana',
      apellidos: 'Torres Navarro',
      email: 'ana.torres@gmail.com',
      password: 'anatorres123',
      telefono: '+34 677 456 321',
      fechaNacimiento: new Date('1992-07-30'),
      genero: 'FEMENINO',
      nacionalidad: 'Espanola',
      direccion: { calle: 'Calle Larios 10', ciudad: 'Malaga', codigoPostal: '29015', pais: 'Espana' },
      role: 'USER',
    },
    {
      nombre: 'Diego',
      apellidos: 'Hernandez Moreno',
      email: 'diego.hernandez@outlook.com',
      password: 'diego123',
      telefono: '+34 633 789 012',
      fechaNacimiento: new Date('1985-01-12'),
      genero: 'MASCULINO',
      nacionalidad: 'Espanola',
      direccion: { calle: 'Plaza del Ayuntamiento 5', ciudad: 'Valencia', codigoPostal: '46002', pais: 'Espana' },
      role: 'USER',
    },
  ]);

  console.log(`${users.length} usuarios creados`);

  // Create forum posts (main posts)
  const posts = await ForumPost.create([
    {
      titulo: 'Mi experiencia en la Gran Muralla China - Consejos para espanoles',
      contenido: 'Acabo de volver de Pekin y tengo que compartir mi experiencia en la Gran Muralla. Fui a la seccion de Mutianyu que esta menos masificada que Badaling. Recomiendo ir temprano, sobre las 8 de la manana, y llevar zapatillas comodas porque las escaleras son muy empinadas. El teleferico vale la pena. Desde alli las vistas son impresionantes, sobre todo en otono cuando las hojas cambian de color. Para comer, hay restaurantes cerca de la entrada con precios razonables. El hotpot de la zona es increible. Si vais desde Espana, preparaos para el jet lag, son 7 horas de diferencia.',
      ciudad: cityMap['Pekin'],
      autor: users[0]._id,
    },
    {
      titulo: 'Shanghai de noche: El Bund y Pudong iluminados',
      contenido: 'Shanghai me ha dejado sin palabras. El paseo por el Bund de noche es algo que todo espanol deberia vivir al menos una vez. Las luces de Pudong reflejandose en el rio Huangpu son de pelicula. Recomiendo ir al bar del hotel Peninsula para tomar algo con vistas. Para moverse por la ciudad, el metro es baratisimo y muy limpio comparado con el de Madrid. El tren magnetico Maglev desde el aeropuerto va a 430 km/h, una locura. La comida en Shanghai es mas dulce que en otras partes de China, probad los xiaolongbao (empanadillas al vapor) en Din Tai Fung.',
      ciudad: cityMap['Shanghai'],
      autor: users[1]._id,
    },
    {
      titulo: 'Chengdu: Pandas, hotpot picante y vida tranquila',
      contenido: 'Si os gustan los animales, Chengdu es obligatorio. La base de cria de pandas gigantes es una pasada, id a primera hora (antes de las 9) porque luego los pandas se duermen. El hotpot de Sichuan es el mas picante que he probado en mi vida, y eso que soy de los que echa tabasco a todo. Pedid el nivel "medio" de picante si no estais acostumbrados. La calle Jinli es perfecta para pasear por la noche y comprar souvenirs. Chengdu tiene un ritmo de vida mucho mas relajado que Pekin o Shanghai, la gente se sienta en los parques a tomar te. Me encanto.',
      ciudad: cityMap['Chengdu'],
      autor: users[2]._id,
    },
    {
      titulo: 'Consejos practicos para viajar a China desde Espana',
      contenido: 'Despues de 3 viajes a China, aqui van mis consejos:\n\n1. VISADO: Necesitais visado, tramitadlo con al menos 1 mes de antelacion en el consulado chino.\n2. VPN: Descargad una VPN antes de ir porque Google, WhatsApp e Instagram no funcionan alli. Usad WeChat para comunicaros.\n3. DINERO: Casi todo se paga con el movil (Alipay/WeChat Pay). Llevad algo de efectivo por si acaso.\n4. IDIOMA: Fuera de las zonas turisticas nadie habla ingles ni espanol. Descargad un traductor offline.\n5. COMIDA: Atreveos a probar de todo, la comida china real no tiene nada que ver con los restaurantes chinos de Espana.\n6. TRANSPORTE: Los trenes de alta velocidad son puntuales y comodisimos. Reservad billetes con antelacion en fiestas nacionales.\n7. ENCHUFES: Llevad un adaptador universal, los enchufes son diferentes.',
      autor: users[3]._id,
    },
    {
      titulo: 'Ruta de la Seda: Dunhuang y las Cuevas de Mogao',
      contenido: 'He hecho la ruta de la seda y ha sido el viaje mas increible de mi vida. Dunhuang es un lugar magico, las dunas del desierto al atardecer son espectaculares. Las Cuevas de Mogao tienen pinturas budistas de hace mas de 1000 anos que te dejan con la boca abierta. Reservad las entradas con mucha antelacion porque limitan las visitas diarias. El paseo en camello por las dunas de Mingsha es super turistico pero merece la pena. Para cenar, probad los fideos tirados a mano (lamian), los hacen delante de ti. El viaje desde Xian en tren de alta velocidad son unas 8 horas pero el paisaje del desierto es hipnotizante.',
      ciudad: cityMap['Dunhuang'],
      autor: users[4]._id,
    },
    {
      titulo: 'Guilin y el rio Li: paisajes de otra galaxia',
      contenido: 'Los paisajes de Guilin parecen sacados de una pelicula de fantasia. Hice el crucero por el rio Li desde Guilin hasta Yangshuo y es de las cosas mas bonitas que he visto. Las montanas karsticas cubiertas de niebla son exactamente como las pinturas chinas tradicionales. En Yangshuo alquile una bicicleta electrica y recorri los arrozales, una experiencia 10/10. La cerveza de arroz local esta buenisima. Si podeis, quedaos a ver el espectaculo de luces "Impresion Liu Sanjie" dirigido por Zhang Yimou, es al aire libre con las montanas de fondo.',
      ciudad: cityMap['Guilin'],
      autor: users[0]._id,
    },
    {
      titulo: 'Xian: Los Guerreros de Terracota y la comida musulmana',
      contenido: 'Xian me sorprendio muchisimo. Los Guerreros de Terracota son impresionantes en persona, las fotos no les hacen justicia. Hay 3 fosas y la numero 1 es la mas grande. Contratad un guia en espanol si podeis, merece la pena para entender la historia. Pero lo que mas me gusto de Xian fue el barrio musulman. La calle de comida es una locura: cordero a la brasa, pan roujiamo (el "hamburguesa china"), fideos biang biang que son anchos como un cinturon. Tambien subid a la muralla de la ciudad en bicicleta, se puede recorrer entera y tiene 14 km.',
      ciudad: cityMap["Xi'an"],
      autor: users[1]._id,
    },
    {
      titulo: 'Harbin en invierno: el festival de hielo mas grande del mundo',
      contenido: 'Fui a Harbin en enero y hacia -30 grados. Si, habeis leido bien, MENOS TREINTA. Pero merece absolutamente la pena. El Festival Internacional de Esculturas de Hielo y Nieve es de otro planeta. Los edificios de hielo iluminados con luces de colores son gigantes, algunos de 20 metros de altura. Llevad ropa termica de verdad: 3 capas arriba, 2 abajo, botas forradas, guantes dobles y gorro. El movil se apaga con el frio, llevadlo pegado al cuerpo. La comida manchuriana es contundente y perfecta para el frio, probad los dumplings (jiaozi) y el guiso de cerdo estofado.',
      ciudad: cityMap['Harbin'],
      autor: users[2]._id,
    },
  ]);

  console.log(`${posts.length} posts del foro creados`);

  // Create replies (comments) on some posts
  const replies = await ForumPost.create([
    {
      contenido: 'Totalmente de acuerdo con lo de Mutianyu! Yo fui a Badaling y estaba lleno de gente, imposible hacer buenas fotos. La proxima vez ire a Mutianyu seguro. Por cierto, el restaurante que hay al pie de la muralla tiene un pato pekinés bastante bueno.',
      autor: users[1]._id,
      parentPost: posts[0]._id,
    },
    {
      contenido: 'Gracias por los consejos! Voy en noviembre, me preocupa un poco el frio. Que temperatura habia cuando fuiste? Necesito comprar ropa especial?',
      autor: users[3]._id,
      parentPost: posts[0]._id,
    },
    {
      contenido: 'Lo del Maglev es verdad, yo pense que era broma hasta que lo vi en la pantalla del tren. 430 km/h y apenas se nota! Los xiaolongbao de Din Tai Fung estan increibles pero tambien probad los de Jia Jia Tang Bao que son mas autenticos y la mitad de precio.',
      autor: users[0]._id,
      parentPost: posts[1]._id,
    },
    {
      contenido: 'Yo estuve en Shanghai en octubre durante la Semana Dorada y estaba a tope de gente. Evitad esas fechas si podeis. Pero la ciudad es espectacular, me quede 5 dias y me faltaron.',
      autor: users[4]._id,
      parentPost: posts[1]._id,
    },
    {
      contenido: 'El hotpot de Sichuan me destrozo el estomago durante 2 dias jajaja. Pero volveria a repetir sin dudarlo. Es adictivo. Llevad pastillas para el estomago por si acaso!',
      autor: users[0]._id,
      parentPost: posts[2]._id,
    },
    {
      contenido: 'Lo del VPN es importantisimo! Yo no me lo descargue antes y fue un infierno los primeros dias sin poder usar Google Maps ni WhatsApp. Al final me aclare con WeChat y Baidu Maps pero cuesta adaptarse.',
      autor: users[2]._id,
      parentPost: posts[3]._id,
    },
    {
      contenido: 'Anadria otro consejo: sacad la tarjeta sanitaria internacional y un seguro de viaje. La sanidad en China es buena pero cara para extranjeros. A mi me dolio una muela en Pekin y la consulta me costo 800 yuan (unos 100 euros).',
      autor: users[4]._id,
      parentPost: posts[3]._id,
    },
    {
      contenido: 'Las Cuevas de Mogao son patrimonio de la humanidad y se nota. Pero es verdad que limitan mucho las visitas, yo intente comprar entrada el dia anterior y ya no habia. Reservad con al menos 1 semana de antelacion en temporada alta.',
      autor: users[3]._id,
      parentPost: posts[4]._id,
    },
    {
      contenido: 'Confirmo lo del crucero por el rio Li, es ESPECTACULAR. Nosotros lo hicimos en dia nublado y con la niebla entre las montanas era todavia mas bonito. Como en una pintura china de verdad.',
      autor: users[2]._id,
      parentPost: posts[5]._id,
    },
    {
      contenido: 'El roujiamo de Xian es lo mejor que he comido en China, sin duda. Es como un bocadillo de pulled pork pero mejor. Y cuesta menos de 1 euro! La muralla en bici es un planazo, tardamos unas 2 horas en dar la vuelta entera.',
      autor: users[4]._id,
      parentPost: posts[6]._id,
    },
    {
      contenido: 'Menos treinta grados?! Madre mia. Yo soy de Malaga, creo que me muero alli jajaja. Pero las fotos del festival de hielo son tan bonitas que igual me animo. Que mes es el mejor para ir?',
      autor: users[3]._id,
      parentPost: posts[7]._id,
    },
    {
      contenido: 'El festival suele ser en enero y febrero. Enero es mas frio pero las esculturas estan recien hechas y mas bonitas. Febrero empieza a subir un poco la temperatura (a -20, eso si jaja). Vale muchisimo la pena, es unico en el mundo.',
      autor: users[2]._id,
      parentPost: posts[7]._id,
    },
  ]);

  console.log(`${replies.length} respuestas del foro creadas`);
  console.log('Seed del foro completado!');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
