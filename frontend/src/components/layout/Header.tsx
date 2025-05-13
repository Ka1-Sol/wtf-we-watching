import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDiscoverMenuOpen, setIsDiscoverMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleRandomFind = () => {
    const paths = ['/discover', '/mood-compass', '/time-machine', '/serendipity', '/directors-cut'];
    const randomPath = paths[Math.floor(Math.random() * paths.length)];
    navigate(randomPath);
  };

  const toggleDiscoverMenu = () => {
    setIsDiscoverMenuOpen(!isDiscoverMenuOpen);
  };

  return (
    <header className="bg-primary text-white py-4 md:py-6 px-6 sticky top-0 z-50 shadow-md">
      <div className="container-custom flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            WTF <span className="text-accent">We Watching?</span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
          </svg>
        </button>
        
        {/* Desktop menu */}
        <nav className="hidden lg:flex space-x-8 items-center">
          <Link 
            to="/" 
            className={`transition-colors duration-200 hover:text-accent text-lg xl:text-xl ${isActive('/') ? 'text-accent' : ''}`}
          >
            Home
          </Link>
          
          {/* Discover dropdown */}
          <div className="relative">
            <button 
              onClick={toggleDiscoverMenu}
              className={`flex items-center transition-colors duration-200 hover:text-accent text-lg xl:text-xl ${
                ['/discover', '/mood-compass', '/time-machine', '/serendipity', '/directors-cut'].some(path => isActive(path)) 
                  ? 'text-accent' 
                  : ''
              }`}
            >
              Discover
              <svg xmlns="http://www.w3.org/2000/svg" className={`ml-1 h-5 w-5 transition-transform ${isDiscoverMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {isDiscoverMenuOpen && (
              <div className="absolute mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                <Link 
                  to="/discover" 
                  className={`block px-4 py-2 text-gray-800 hover:bg-indigo-100 ${isActive('/discover') ? 'bg-indigo-100 text-indigo-700 font-medium' : ''}`}
                  onClick={() => setIsDiscoverMenuOpen(false)}
                >
                  All Content
                </Link>
                <Link 
                  to="/mood-compass" 
                  className={`block px-4 py-2 text-gray-800 hover:bg-indigo-100 ${isActive('/mood-compass') ? 'bg-indigo-100 text-indigo-700 font-medium' : ''}`}
                  onClick={() => setIsDiscoverMenuOpen(false)}
                >
                  Mood Compass
                </Link>
                <Link 
                  to="/time-machine" 
                  className={`block px-4 py-2 text-gray-800 hover:bg-indigo-100 ${isActive('/time-machine') ? 'bg-indigo-100 text-indigo-700 font-medium' : ''}`}
                  onClick={() => setIsDiscoverMenuOpen(false)}
                >
                  Time Machine
                </Link>
                <Link 
                  to="/serendipity" 
                  className={`block px-4 py-2 text-gray-800 hover:bg-indigo-100 ${isActive('/serendipity') ? 'bg-indigo-100 text-indigo-700 font-medium' : ''}`}
                  onClick={() => setIsDiscoverMenuOpen(false)}
                >
                  Serendipity
                </Link>
                <Link 
                  to="/directors-cut" 
                  className={`block px-4 py-2 text-gray-800 hover:bg-indigo-100 ${isActive('/directors-cut') ? 'bg-indigo-100 text-indigo-700 font-medium' : ''}`}
                  onClick={() => setIsDiscoverMenuOpen(false)}
                >
                  Director's Cut
                </Link>
              </div>
            )}
          </div>
          
          <Link 
            to="/decision-timer" 
            className={`transition-colors duration-200 hover:text-accent text-lg xl:text-xl ${isActive('/decision-timer') ? 'text-accent' : ''}`}
          >
            Decision Timer
          </Link>
          
          <Link 
            to="/library" 
            className={`transition-colors duration-200 hover:text-accent text-lg xl:text-xl ${isActive('/library') ? 'text-accent' : ''}`}
          >
            My Library
          </Link>
          
          <button 
            className="btn btn-primary cursor-pointer text-lg px-6 py-3"
            onClick={handleRandomFind}
          >
            Find Something Now
          </button>
        </nav>
      </div>
      
      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden pt-4 pb-2 px-6 bg-primary border-t border-gray-700">
          <nav className="flex flex-col space-y-4">
            <MobileNavLinks isActive={isActive} onClick={() => setIsMenuOpen(false)} handleRandomFind={handleRandomFind} />
          </nav>
        </div>
      )}
    </header>
  );
};

interface NavLinksProps {
  isActive: (path: string) => boolean;
  onClick?: () => void;
  handleRandomFind: () => void;
}

const MobileNavLinks = ({ isActive, onClick, handleRandomFind }: NavLinksProps) => {
  return (
    <>
      <Link 
        to="/" 
        className={`transition-colors duration-200 hover:text-accent text-base md:text-lg ${isActive('/') ? 'text-accent' : ''}`} 
        onClick={onClick}
      >
        Home
      </Link>
      <Link 
        to="/discover" 
        className={`transition-colors duration-200 hover:text-accent text-base md:text-lg ${isActive('/discover') ? 'text-accent' : ''}`} 
        onClick={onClick}
      >
        Discover
      </Link>
      <Link 
        to="/mood-compass" 
        className={`transition-colors duration-200 hover:text-accent text-base md:text-lg ${isActive('/mood-compass') ? 'text-accent' : ''}`} 
        onClick={onClick}
      >
        Mood Compass
      </Link>
      <Link 
        to="/time-machine" 
        className={`transition-colors duration-200 hover:text-accent text-base md:text-lg ${isActive('/time-machine') ? 'text-accent' : ''}`} 
        onClick={onClick}
      >
        Time Machine
      </Link>
      <Link 
        to="/serendipity" 
        className={`transition-colors duration-200 hover:text-accent text-base md:text-lg ${isActive('/serendipity') ? 'text-accent' : ''}`} 
        onClick={onClick}
      >
        Serendipity
      </Link>
      <Link 
        to="/directors-cut" 
        className={`transition-colors duration-200 hover:text-accent text-base md:text-lg ${isActive('/directors-cut') ? 'text-accent' : ''}`} 
        onClick={onClick}
      >
        Director's Cut
      </Link>
      <Link 
        to="/decision-timer" 
        className={`transition-colors duration-200 hover:text-accent text-base md:text-lg ${isActive('/decision-timer') ? 'text-accent' : ''}`} 
        onClick={onClick}
      >
        Decision Timer
      </Link>
      <Link 
        to="/library" 
        className={`transition-colors duration-200 hover:text-accent text-base md:text-lg ${isActive('/library') ? 'text-accent' : ''}`} 
        onClick={onClick}
      >
        My Library
      </Link>
      <button 
        className="btn btn-primary cursor-pointer text-base md:text-lg px-4 md:px-6 py-2 md:py-3"
        onClick={(e) => {
          e.preventDefault();
          if (onClick) onClick();
          handleRandomFind();
        }}
      >
        Find Something Now
      </button>
    </>
  );
};

export default Header; 