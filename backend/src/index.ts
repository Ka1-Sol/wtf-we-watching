import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

// Import delle routes
import contentRoutes from './routes/content.routes.js';
import tmdbRoutes from './routes/tmdb.routes.js';
import userRoutes from './routes/user.routes.js';

// Configurazione delle variabili d'ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  limit: 100, // 100 richieste per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false
});
app.use(limiter);

// Routes
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);

// Route di base per verificare che l'API sia in funzione
app.get('/', (req, res) => {
  res.json({
    message: 'WTF We Watching API',
    status: 'online',
    version: '1.0.0'
  });
});

// Gestione degli errori 404
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    status: 404
  });
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
});

export default app; 