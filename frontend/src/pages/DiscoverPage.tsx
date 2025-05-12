import { Tab } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ContentGrid from '../components/ui/ContentGrid';
import { discoverContent, searchContent } from '../services/api';
import type { RootState } from '../store';
import type { Content } from '../store/slices/contentSlice';
import type { UserState } from '../store/slices/userSlice';

const DiscoverPage = () => {
  const user = useSelector((state: RootState) => state.user) as UserState;
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [contents, setContents] = useState<{
    popular: Content[];
    topRated: Content[];
    trending: Content[];
    forYou: Content[];
    search: Content[];
  }>({
    popular: [],
    topRated: [],
    trending: [],
    forYou: [],
    search: [],
  });

  // Fetch discovery content on initial load
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      
      try {
        // Popular content
        const popular = await discoverContent({ sort_by: 'popularity.desc' });
        
        // Top rated content
        const topRated = await discoverContent({ sort_by: 'vote_average.desc', 'vote_count.gte': 200 });
        
        // Trending content (default from API service)
        const trending = await discoverContent({ sort_by: 'trending.desc' });
        
        // Personalized recommendations based on user preferences
        const genreIds = user.preferences.genres.map(genre => genre.id).join(',');
        const forYou = await discoverContent({ 
          with_genres: genreIds,
          sort_by: 'popularity.desc',
        });
        
        setContents(prev => ({
          ...prev,
          popular,
          topRated,
          trending,
          forYou,
        }));
      } catch (error) {
        console.error('Error fetching discovery content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, [user.preferences.genres]);
  
  // Handle search functionality
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setActiveTab(4); // Switch to search tab
    
    try {
      const results = await searchContent(searchQuery);
      setContents(prev => ({
        ...prev,
        search: results,
      }));
    } catch (error) {
      console.error('Error searching content:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Tab categories
  const categories = [
    { key: 'popular', label: 'Popular', data: contents.popular },
    { key: 'topRated', label: 'Top Rated', data: contents.topRated },
    { key: 'trending', label: 'Trending', data: contents.trending },
    { key: 'forYou', label: 'For You', data: contents.forYou },
    { key: 'search', label: 'Search Results', data: contents.search },
  ];
  
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-6">Discover</h1>
        
        {/* Search Bar */}
        <div className="w-full max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies, shows, actors, or directors..."
              className="input-field pr-12"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 text-white rounded-md"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
        
        {/* Content Tabs */}
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex space-x-2 border-b border-gray-200 mb-8 overflow-x-auto">
            {categories.slice(0, 4).map((category) => (
              <Tab
                key={category.key}
                className={({ selected }) =>
                  `py-3 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${selected 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                {category.label}
              </Tab>
            ))}
            {contents.search.length > 0 && (
              <Tab
                className={({ selected }) =>
                  `py-3 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${selected 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                Search Results
              </Tab>
            )}
          </Tab.List>
          <Tab.Panels>
            {categories.map((category) => (
              <Tab.Panel key={category.key}>
                <ContentGrid
                  contents={category.data}
                  isLoading={isLoading && category.data.length === 0}
                  emptyMessage={
                    category.key === 'search'
                      ? 'No search results found. Try another query.'
                      : category.key === 'forYou'
                      ? user.preferences.genres.length === 0
                        ? 'Set up your genre preferences to get personalized recommendations.'
                        : 'No content found matching your preferences.'
                      : 'No content found.'
                  }
                />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default DiscoverPage; 