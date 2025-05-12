# WTF We Watching?

A sophisticated content discovery platform that helps users find movies and TV shows they'll actually love, not just what everyone else is watching.

## Features

- **Advanced User Profiling**: Personalized recommendations based on your specific tastes and preferences
- **Mood Compass**: Find content that matches your current mood with an interactive visual interface
- **Serendipity Engine**: Discover unexpected content that you might love
- **Time Machine**: Explore content from different eras with contextual recommendations
- **Director's Cut**: Navigate through a filmmaker's work with personalized viewing order
- **Decision Timer**: Combat choice paralysis with guided decision support

## Technology Stack

- **React** with TypeScript for UI development
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **TMDb API** for content data

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wtf-we-watching.git
   cd wtf-we-watching
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Add your TMDb API key:
   - Sign up for an API key at [TMDb](https://www.themoviedb.org/documentation/api)
   - Open `src/services/api.ts` and replace `YOUR_TMDB_API_KEY` with your actual API key

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser to `http://localhost:5173`

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # React components
│   ├── features/    # Feature-specific components
│   ├── layout/      # Layout components
│   └── ui/          # Reusable UI components
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── services/        # API services
├── store/           # Redux store
│   └── slices/      # Redux slices
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [TMDb API](https://www.themoviedb.org/documentation/api) for providing movie and TV show data
- All contributors who have helped shape and improve this project
