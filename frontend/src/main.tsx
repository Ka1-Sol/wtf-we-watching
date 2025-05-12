import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import ContentDetailPage from './pages/ContentDetailPage'
import DecisionTimerPage from './pages/DecisionTimerPage'
import DirectorsCutPage from './pages/DirectorsCutPage'
import DiscoverPage from './pages/DiscoverPage'
import HomePage from './pages/HomePage'
import LibraryPage from './pages/LibraryPage'
import MoodCompassPage from './pages/MoodCompassPage'
import SerendipityPage from './pages/SerendipityPage'
import TimeMachinePage from './pages/TimeMachinePage'
import { store } from './store/index'

// Create router with the new createBrowserRouter API for React Router v7
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'discover', element: <DiscoverPage /> },
      { path: 'mood-compass', element: <MoodCompassPage /> },
      { path: 'time-machine', element: <TimeMachinePage /> },
      { path: 'serendipity', element: <SerendipityPage /> },
      { path: 'directors-cut', element: <DirectorsCutPage /> },
      { path: 'decision-timer', element: <DecisionTimerPage /> },
      { path: 'library', element: <LibraryPage /> },
      { path: 'content/:type/:id', element: <ContentDetailPage /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
