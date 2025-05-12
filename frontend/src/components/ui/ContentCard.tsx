import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/api';
import type { Content } from '../../store/slices/contentSlice';

interface ContentCardProps {
  content: Content;
  variant?: 'default' | 'featured' | 'compact';
  isLoading?: boolean;
}

const ContentCard = ({ 
  content, 
  variant = 'default',
  isLoading = false 
}: ContentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  if (isLoading) {
    return (
      <div className={`card animate-pulse ${getCardSizeClass(variant)}`}>
        <div className="bg-gray-300 h-full w-full rounded-xl"></div>
      </div>
    );
  }

  return (
    <Link 
      to={`/content/${content.type}/${content.id}`}
      className={`card overflow-hidden ${getCardSizeClass(variant)} transition-all duration-300 transform ${isHovered ? 'scale-[1.03]' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full">
        {/* Poster Image */}
        <img 
          src={getImageUrl(content.posterPath)} 
          alt={content.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Overlay with content info */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}>
          <h3 className="text-white font-bold text-lg line-clamp-2">{content.title}</h3>
          
          {variant !== 'compact' && (
            <>
              <div className="flex items-center gap-2 mt-2">
                {content.voteAverage && (
                  <span className="bg-accent/90 text-white text-xs px-2 py-0.5 rounded-md font-medium">
                    {content.voteAverage.toFixed(1)}
                  </span>
                )}
                <span className="text-gray-300 text-xs capitalize">
                  {content.type} {content.releaseDate && `• ${new Date(content.releaseDate).getFullYear()}`}
                </span>
              </div>
              
              {variant === 'featured' && (
                <p className="text-gray-300 text-sm mt-2 line-clamp-2">{content.overview}</p>
              )}
            </>
          )}
        </div>
        
        {/* Type badge (Movie/TV) */}
        <div className="absolute top-2 right-2 bg-primary/80 text-white text-xs px-2 py-0.5 rounded-md backdrop-blur-sm">
          {content.type === 'movie' ? 'Movie' : 'TV'}
        </div>
      </div>
    </Link>
  );
};

const getCardSizeClass = (variant: 'default' | 'featured' | 'compact'): string => {
  switch (variant) {
    case 'featured':
      return 'aspect-[16/9] md:aspect-[2/1]';
    case 'compact':
      return 'aspect-[2/3] h-40';
    default:
      return 'aspect-[2/3]';
  }
};

export default ContentCard; 