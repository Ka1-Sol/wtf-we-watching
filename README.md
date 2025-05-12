# WTF We Watching?

Un'applicazione web per scoprire film e serie TV personalizzate in base ai tuoi gusti.

## Funzionalità

- **Mood Compass**: Trova contenuti che corrispondono al tuo stato d'animo attuale
- **Time Machine**: Esplora i migliori contenuti di diverse epoche e decenni
- **Serendipity Engine**: Lasciati sorprendere da contenuti inaspettati che potresti amare
- **Director's Cut**: Naviga attraverso l'opera di un regista con ordine di visione personalizzato
- **Decision Timer**: Combatti la paralisi da scelta con supporto decisionale guidato
- **Library**: Tieni traccia di ciò che hai guardato e vuoi guardare

## Tecnologie

- **Frontend**: React 19.1.0, React Router 7.6.0, Redux Toolkit, Tailwind CSS
- **Backend**: Express, Node.js con TypeScript
- **API**: TMDb per dati su film e serie TV

## Installazione

```bash
# Clona il repository
git clone https://github.com/yourusername/wtf-we-watching.git
cd wtf-we-watching

# Installa le dipendenze
npm install

# Avvia in modalità sviluppo
npm run dev
```

## Configurazione

Crea un file `.env` nella cartella backend con le seguenti variabili:

```
PORT=5001
CORS_ORIGIN=http://localhost:5173
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_API_URL=https://api.themoviedb.org/3
NODE_ENV=development
```

## Deployment

Il progetto è configurato per il deployment su Vercel. Collega semplicemente il repository GitHub a Vercel e configura le variabili d'ambiente necessarie.

## Licenza

MIT
