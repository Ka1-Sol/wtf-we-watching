import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getContentDetails, getImageUrl } from '../services/api';
import type { Content } from '../store/slices/contentSlice';

const ContentDetailPage = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!id || !type || (type !== 'movie' && type !== 'tv')) {
          setError('Invalid content ID or type');
          setIsLoading(false);
          return;
        }

        const contentData = await getContentDetails(parseInt(id, 10), type as 'movie' | 'tv');
        
        if (!contentData) {
          setError('Content not found');
        } else {
          setContent(contentData);
        }
      } catch (error) {
        console.error('Error fetching content details:', error);
        setError('Failed to load content details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContentDetails();
  }, [id, type]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error || 'Failed to load content'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Titolo e informazioni di base in alto */}
      <div className="container-custom px-4 pt-6 pb-3">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">{content.title}</h1>
        
        <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
          <span className="text-sm bg-blue-500 text-white px-2 py-1 rounded-md">
            {content.type === 'movie' ? 'Movie' : 'TV Show'}
          </span>
          {content.releaseDate && (
            <span className="text-sm bg-gray-200 px-2 py-1 rounded-md">
              {new Date(content.releaseDate).getFullYear()}
            </span>
          )}
          <span className="text-sm bg-yellow-500 text-black px-2 py-1 rounded-md">
            ★ {content.voteAverage?.toFixed(1) || 'N/A'}
          </span>
          {content.genres && content.genres.slice(0, 2).map(genre => (
            <span 
              key={genre.id} 
              className="text-xs px-2 py-1 bg-gray-100 rounded-full"
            >
              {genre.name}
            </span>
          ))}
        </div>
      </div>
      
      {/* Immagine di sfondo con poster centrato sopra */}
      <div className="relative">
        {content.backdropPath && (
          <div className="w-full h-96 md:h-[450px] bg-cover bg-center bg-no-repeat" 
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url(${getImageUrl(content.backdropPath, 'original')})` 
            }}>
          </div>
        )}
        
        {/* Poster centrato sull'immagine di sfondo */}
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <img 
            src={getImageUrl(content.posterPath)} 
            alt={content.title} 
            className="w-48 md:w-72 rounded-lg shadow-xl border-2 border-white"
          />
        </div>
      </div>
      
      {/* Descrizione sotto l'immagine */}
      <div className="container-custom px-4 py-6">
        <p className="text-gray-700 mb-6 text-center md:text-left">{content.overview}</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Details</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-3">
                <h3 className="font-semibold text-gray-700">Release Date</h3>
                <p>
                  {content.releaseDate 
                    ? new Date(content.releaseDate).toLocaleDateString()
                    : 'N/A'
                  }
                </p>
              </div>
              
              {content.type === 'movie' && content.runtime && (
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-700">Runtime</h3>
                  <p>{content.runtime} minutes</p>
                </div>
              )}
              
              {content.type === 'tv' && (
                <>
                  {content.seasonCount && (
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-700">Seasons</h3>
                      <p>{content.seasonCount}</p>
                    </div>
                  )}
                  
                  {content.episodeCount && (
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-700">Episodes</h3>
                      <p>{content.episodeCount}</p>
                    </div>
                  )}
                </>
              )}
              
              {content.genres && content.genres.length > 0 && (
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-700">Genres</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {content.genres.map(genre => (
                      <span 
                        key={genre.id} 
                        className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">              
              {content.creators && content.creators.length > 0 && (
                <div className="mt-2">
                  <h3 className="font-semibold text-gray-700 mb-4">
                    {content.type === 'movie' ? 'Directors' : 'Creators'}
                  </h3>
                  <div className="flex flex-wrap gap-6">
                    {content.creators.map(person => (
                      <div key={person.id} className="text-center">
                        <div className="mb-1">
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                            <span className="text-gray-500 text-xl">{person.name.charAt(0)}</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium">{person.name}</p>
                        <p className="text-xs text-gray-500">{person.job}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPage; 