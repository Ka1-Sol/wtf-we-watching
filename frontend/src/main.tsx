import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'
import './debug'
import './index.css'
import ContentDetailPage from './pages/ContentDetailPage'
import DecisionTimerPage from './pages/DecisionTimerPage'
import DirectorsCutPage from './pages/DirectorsCutPage'
import DiscoverPage from './pages/DiscoverPage'
import HomePage from './pages/HomePage'
import LibraryPage from './pages/LibraryPage'
import MoodCompassPage from './pages/MoodCompassPage'
import SerendipityPage from './pages/SerendipityPage'
import TestPage from './pages/TestPage'
import TimeMachinePage from './pages/TimeMachinePage'
import { store } from './store/index'

// Error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Qualcosa è andato storto</h1>
            <p className="text-gray-700 mb-4">Si è verificato un errore durante il caricamento dell'applicazione.</p>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700 mb-4">
              <p className="font-medium">Dettagli errore:</p>
              <p className="text-sm font-mono whitespace-pre-wrap overflow-auto max-h-60">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
            >
              Ricarica la pagina
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Create router with the new createBrowserRouter API for React Router v7
// Simplified router without nesting to avoid potential issues
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><HomePage /></Layout>,
    errorElement: <div className="p-8">Errore nel caricamento della pagina</div>
  },
  {
    path: '/test',
    element: <Layout><TestPage /></Layout>,
    errorElement: <div className="p-8">Errore nel caricamento della pagina di test</div>
  },
  {
    path: '/discover',
    element: <Layout><DiscoverPage /></Layout>,
    errorElement: <div className="p-8">Errore nel caricamento della pagina Discover</div>
  },
  {
    path: '/mood-compass',
    element: <Layout><MoodCompassPage /></Layout>,
    errorElement: <div className="p-8">Errore nel caricamento della pagina Mood Compass</div>
  },
  {
    path: '/time-machine',
    element: <Layout><TimeMachinePage /></Layout>,
    errorElement: <div className="p-8">Errore nel caricamento della pagina Time Machine</div>
  },
  {
    path: '/serendipity',
    element: <Layout><SerendipityPage /></Layout>,
    errorElement: <div className="p-8">Errore nel caricamento della pagina Serendipity</div>
  },
  {
    path: '/directors-cut',
    element: <Layout><DirectorsCutPage /></Layout>,
    errorElement: <div className="p-8">Errore nel caricamento della pagina Director's Cut</div>
  },
  {
    path: '/decision-timer',
    element: <Layout><DecisionTimerPage /></Layout>,
    errorElement: <div className="p-8">Errore nel caricamento della pagina Decision Timer</div>
  },
  {
    path: '/library',
    element: <Layout><LibraryPage /></Layout>,
    errorElement: <div className="p-8">Errore nel caricamento della pagina Library</div>
  },
  {
    path: '/content/:type/:id',
    element: <Layout><ContentDetailPage /></Layout>,
    errorElement: <div className="p-8">Errore nel caricamento della pagina del contenuto</div>
  }
])

// Aggiungi dei log per debug
console.log('React version:', React.version);
console.log('Initial Redux state:', store.getState());

// Tempo di montaggio dell'app
const startTime = performance.now();

// Monitora la renderizzazione
let renderComplete = false;
setTimeout(() => {
  if (!renderComplete) {
    console.warn('Render sta impiegando più di 5 secondi, possibile problema di performance');
  }
}, 5000);

// Renderizza l'app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
);

renderComplete = true;
console.log(`App renderizzata in ${(performance.now() - startTime).toFixed(2)}ms`);
