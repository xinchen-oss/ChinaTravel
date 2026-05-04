import path from 'path';
import { fileURLToPath } from 'url';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_for_jest_only';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:0/chinatravel_test';
process.env.CLIENT_URL = 'http://localhost:5173';

delete process.env.MAILTRAP_HOST;
delete process.env.MAILTRAP_USER;
delete process.env.MAILTRAP_PASS;
delete process.env.MAILTRAP_PORT;

// Cambiamos el cwd al directorio de tests para que dotenv.config() (que
// busca .env en cwd) no encuentre el .env real de producción y no
// sobreescriba las variables que acabamos de eliminar arriba.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.chdir(__dirname);
