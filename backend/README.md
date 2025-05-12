# WTF We Watching Backend

API backend per l'applicazione "WTF We Watching?", che fornisce consigli personalizzati su film e serie TV.

## Tecnologie

- Node.js
- Express
- TypeScript
- TMDb API per i dati su film e serie TV

## Struttura

```
backend/
├── src/               # Codice sorgente
│   ├── controllers/   # Controller per la gestione delle richieste
│   ├── routes/        # Definizione delle route API
│   ├── models/        # Definizioni dei modelli dati
│   ├── services/      # Servizi business logic
│   ├── middleware/    # Middleware Express
│   ├── config/        # File di configurazione
│   └── utils/         # Funzioni di utilità
├── data/              # File JSON per l'archiviazione dati (no database)
├── dist/              # Codice compilato (generato)
└── package.json       # Dipendenze e script
```

## Endpoints API

### TMDb API Proxy

- `GET /api/tmdb/trending` - Ottiene contenuti di tendenza
- `GET /api/tmdb/movie/:id` - Ottiene dettagli di un film
- `GET /api/tmdb/tv/:id` - Ottiene dettagli di una serie TV
- `GET /api/tmdb/search` - Cerca film e serie TV
- `GET /api/tmdb/discover` - Scopre contenuti in base a vari parametri

### Gestione Utente

- `GET /api/users/preferences` - Ottiene le preferenze dell'utente
- `PUT /api/users/preferences` - Aggiorna le preferenze dell'utente
- `POST /api/users/watched` - Aggiunge un contenuto alla lista dei guardati
- `POST /api/users/saved` - Aggiunge un contenuto alla lista dei salvati
- `DELETE /api/users/saved/:id` - Rimuove un contenuto dalla lista dei salvati
- `POST /api/users/rate` - Valuta un contenuto

### Contenuti Personalizzati

- `GET /api/content/recommended` - Ottiene contenuti raccomandati in base alle preferenze dell'utente
- `GET /api/content/mood` - Ottiene contenuti in base all'umore
- `GET /api/content/time` - Ottiene contenuti in base all'epoca
- `GET /api/content/director/:id` - Ottiene contenuti di un regista specifico
- `GET /api/content/random` - Ottiene una raccomandazione casuale

## Sviluppo

Per installare le dipendenze:
```
npm install
```

Per eseguire in modalità sviluppo:
```
npm run dev
```

Per buildare l'applicazione:
```
npm run build
```

Per eseguire la versione buildata:
```
npm start
``` 