import { useEffect, useState } from 'react';
import { searchContent } from '../../services/api';
import type { Content } from '../../store/slices/contentSlice';
import ContentCard from '../ui/ContentCard';

// Notable directors with their IDs from TMDb
const featuredDirectors = [
  { id: 138, name: 'Quentin Tarantino' },
  { id: 525, name: 'Christopher Nolan' },
  { id: 1032, name: 'Martin Scorsese' },
  { id: 4762, name: 'Steven Spielberg' },
  { id: 1223, name: 'Wes Anderson' },
  { id: 5655, name: 'Denis Villeneuve' },
  { id: 5249, name: 'Coen Brothers' },
  { id: 4385, name: 'Hayao Miyazaki' },
  { id: 6891, name: 'Ava DuVernay' },
  { id: 1769, name: 'Greta Gerwig' },
];

interface DirectorsCutProps {
  initialDirectorId?: number;
}

const DirectorsCut = ({ initialDirectorId }: DirectorsCutProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDirector, setSelectedDirector] = useState<{ id: number; name: string } | null>(
    initialDirectorId 
      ? featuredDirectors.find(d => d.id === initialDirectorId) || null
      : null
  );
  const [directorFilmography, setDirectorFilmography] = useState<Content[]>([]);
  const [suggestedOrder, setSuggestedOrder] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{ id: number; name: string }[]>([]);
  
  // Handle search for directors
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      // In a real app, you would have a specific endpoint for searching directors
      // Here we're simulating that with a basic search and filtering approach
      await searchContent(query);
      
      // Filter to find potential directors (this is a simplified approach)
      // In a real app, you'd have better data to identify directors
      const possibleDirectors = featuredDirectors.filter(
        director => director.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(possibleDirectors);
    } catch (error) {
      console.error('Error searching for directors:', error);
    }
  };
  
  const handleSelectDirector = (director: { id: number; name: string }) => {
    setSelectedDirector(director);
    setSearchQuery('');
    setSearchResults([]);
  };
  
  // Fetch director's filmography when director is selected
  useEffect(() => {
    const fetchFilmography = async () => {
      if (!selectedDirector) return;
      
      setIsLoading(true);
      setDirectorFilmography([]);
      setSuggestedOrder([]);
      
      try {
        // In a real app, you would have a specific API endpoint for director filmography
        // Here we're simulating it with a search query
        const results = await searchContent(selectedDirector.name);
        
        // Filter and process the results to find likely works by this director
        // This is a simplified approach since we don't have direct filmmaker data
        setDirectorFilmography(results.slice(0, 10));
        
        // Create a suggested viewing order (simplified for this example)
        // In a real app, you'd use more sophisticated algorithms or curated data
        const ordered = [...results.slice(0, 10)].sort((a, b) => {
          // Sort by release date as a simple heuristic
          const dateA = a.releaseDate ? new Date(a.releaseDate) : new Date(0);
          const dateB = b.releaseDate ? new Date(b.releaseDate) : new Date(0);
          return dateA.getTime() - dateB.getTime();
        });
        
        setSuggestedOrder(ordered);
      } catch (error) {
        console.error('Error fetching director filmography:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFilmography();
  }, [selectedDirector]);
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="bg-indigo-700 text-white p-6">
          <h2 className="text-2xl font-bold mb-1">Director's Cut</h2>
          <p className="text-indigo-100">
            Explore a filmmaker's complete work with personalized viewing order and contextual insights.
          </p>
        </div>
        
        {/* Director search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for a director or filmmaker..."
              className="input-field"
            />
            
            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                <ul className="max-h-60 overflow-auto">
                  {searchResults.map((director) => (
                    <li key={director.id}>
                      <button
                        onClick={() => handleSelectDirector(director)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700"
                      >
                        {director.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Featured directors */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Featured Filmmakers</h3>
            <div className="flex flex-wrap gap-2">
              {featuredDirectors.map((director) => (
                <button
                  key={director.id}
                  onClick={() => handleSelectDirector(director)}
                  className={`px-3 py-1 rounded-full text-xs font-medium
                    ${selectedDirector?.id === director.id
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {director.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {selectedDirector ? (
        <div>
          {/* Director information */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-2">{selectedDirector.name}</h2>
            <p className="text-gray-600 mb-4">
              Explore the complete filmography and find the best order to experience
              {' '}{selectedDirector.name}'s unique style and storytelling techniques.
            </p>
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <>
                {directorFilmography.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No films found for this director.
                  </div>
                ) : (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Directorial Style</h3>
                    <p className="text-gray-700">
                      {selectedDirector.name} is known for distinctive visual style, thematic depth,
                      and innovative narrative techniques that have influenced generations of filmmakers.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Suggested viewing order */}
          {!isLoading && suggestedOrder.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold mb-4">Recommended Viewing Order</h3>
              <p className="text-gray-600 mb-6">
                This curated sequence is designed to introduce you to {selectedDirector.name}'s
                work in a way that showcases their artistic evolution and thematic development.
              </p>
              
              <div className="space-y-4">
                {suggestedOrder.map((content, index) => (
                  <div key={content.id} className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
                      {index + 1}
                    </div>
                    <div className="flex-1 p-4">
                      <h4 className="font-medium">{content.title}</h4>
                      <p className="text-sm text-gray-500">
                        {content.releaseDate && new Date(content.releaseDate).getFullYear()}
                      </p>
                    </div>
                    <div className="w-28 h-auto aspect-[2/3] flex-shrink-0">
                      <ContentCard content={content} variant="compact" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Complete filmography */}
          {!isLoading && directorFilmography.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Complete Filmography</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {directorFilmography.map((content) => (
                  <ContentCard key={content.id} content={content} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Select a filmmaker to explore their work
          </h3>
          <p className="text-gray-500">
            Discover the complete filmography, recommended viewing order,
            and insights into directorial styles and themes.
          </p>
        </div>
      )}
    </div>
  );
};

export default DirectorsCut; 