import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Polyfill per __dirname in ES modules
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// Funzione per ottenere i percorsi assoluti relativi alla radice del progetto
export const getPath = (...relativePath: string[]): string => {
  return path.join(__dirname, '..', '..', ...relativePath);
};

// Percorso del file dei dati utente
export const USER_DATA_PATH = getPath('data', 'user.json'); 