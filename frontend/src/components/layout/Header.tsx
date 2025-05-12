import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleRandomFind = () => {
    const paths = ['/discover', '/mood-compass', '/time-machine', '/serendipity', '/directors-cut'];
    const randomPath = paths[Math.floor(Math.random() * paths.length)];
    navigate(randomPath);
  };

  return (
    <header className="bg-primary text-white py-4 px-6 sticky top-0 z-50 shadow-md">
      <div className="container-custom flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold tracking-tight">
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
          <NavLinks isActive={isActive} onClick={() => {}} handleRandomFind={handleRandomFind} />
        </nav>
      </div>
      
      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden pt-4 pb-2 px-6 bg-primary border-t border-gray-700">
          <nav className="flex flex-col space-y-4">
            <NavLinks isActive={isActive} onClick={() => setIsMenuOpen(false)} handleRandomFind={handleRandomFind} />
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

const NavLinks = ({ isActive, onClick, handleRandomFind }: NavLinksProps) => {
  return (
    <>
      <Link 
        to="/" 
        className={`transition-colors duration-200 hover:text-accent ${isActive('/') ? 'text-accent' : ''}`} 
        onClick={onClick}
      >
        Home
      </Link>
      <Link 
        to="/discover" 
        className={`transition-colors duration-200 hover:text-accent ${isActive('/discover') ? 'text-accent' : ''}`} 
        onClick={onClick}
      >
        Discover
      </Link>
      <Link 
        to="/mood-compass" 
        className={`transition-colors duration-200 hover:text-accent ${isActive('/mood-compass') ? 'text-accent' : ''}`} 
        onClick={onClick}
      >
        Mood Compass
      </Link>
      <Link 
        to="/time-machine" 
        className={`transition-colors duration-200 hover:text-accent ${isActive('/time-machine') ? 'text-accent' : ''}`} 
        onClick={onClick}
      >
        Time Machine
      </Link>
      <Link 
        to="/serendipity" 
        className={`transition-colors duration-200 hover:text-accent ${isActive('/serendipity') ? 'text-accent' : ''}`} 
        onClick={onClick}
      >
        Serendipity
      </Link>
      <Link 
        to="/directors-cut" 
        className={`transition-colors duration-200 hover:text-accent ${isActive('/directors-cut') ? 'text-accent' : ''}`} 
        onClick={onClick}
      >
        Director's Cut
      </Link>
      <Link 
        to="/decision-timer" 
        className={`transition-colors duration-200 hover:text-accent ${isActive('/decision-timer') ? 'text-accent' : ''}`} 
        onClick={onClick}
      >
        Decision Timer
      </Link>
      <Link 
        to="/library" 
        className={`transition-colors duration-200 hover:text-accent ${isActive('/library') ? 'text-accent' : ''}`} 
        onClick={onClick}
      >
        My Library
      </Link>
      <button 
        className="btn btn-primary cursor-pointer"
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