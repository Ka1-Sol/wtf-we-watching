# WTF We Watching Backend

API backend for the "WTF We Watching?" application, providing personalized recommendations for movies and TV series.

## Technologies

- Node.js
- Express
- TypeScript
- TMDb API for movie and TV series data

## Structure

```
backend/
├── src/               # Source code
│   ├── controllers/   # Controllers for handling requests
│   ├── routes/        # API route definitions
│   ├── models/        # Data model definitions
│   ├── services/      # Business logic services
│   ├── middleware/    # Express middleware
│   ├── config/        # Configuration files
│   └── utils/         # Utility functions
├── data/              # JSON files for data storage (no database)
├── dist/              # Compiled code (generated)
└── package.json       # Dependencies and scripts
```

## API Endpoints

### TMDb API Proxy

- `GET /api/tmdb/trending` - Get trending content
- `GET /api/tmdb/movie/:id` - Get movie details
- `GET /api/tmdb/tv/:id` - Get TV series details
- `GET /api/tmdb/search` - Search for movies and TV series
- `GET /api/tmdb/discover` - Discover content based on various parameters

### User Management

- `GET /api/users/preferences` - Get user preferences
- `PUT /api/users/preferences` - Update user preferences
- `POST /api/users/watched` - Add content to watched list
- `POST /api/users/saved` - Add content to saved list
- `DELETE /api/users/saved/:id` - Remove content from saved list
- `POST /api/users/rate` - Rate content

### Custom Content

- `GET /api/content/recommended` - Get recommended content based on user preferences
- `GET /api/content/mood` - Get content based on mood
- `GET /api/content/time` - Get content based on time period
- `GET /api/content/director/:id` - Get content from a specific director
- `GET /api/content/random` - Get a random recommendation

## Development

To install dependencies:
```
npm install
```

To run in development mode:
```
npm run dev
```

To build the application:
```
npm run build
```

To run the built version:
```
npm start
``` 