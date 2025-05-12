import { Tab } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ContentGrid from '../components/ui/ContentGrid';
import { getContentDetails } from '../services/api';
import type { RootState } from '../store';
import type { Content, ContentState } from '../store/slices/contentSlice';
import type { UserState } from '../store/slices/userSlice';

const LibraryPage = () => {
  const user = useSelector((state: RootState) => state.user) as UserState;
  const contentState = useSelector((state: RootState) => state.content) as ContentState;
  
  const [savedContent, setSavedContent] = useState<Content[]>([]);
  const [watchedContent, setWatchedContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchLibraryContent = async () => {
      setIsLoading(true);
      
      try {
        // Fetch details for saved content
        const savedContentPromises = user.savedContent.map(async (id) => {
          // Check if we already have the content details in state
          const existingContent = contentState.contentDetails[id];
          if (existingContent) return existingContent;
          
          // If not, fetch it from the API
          // Note: In a real app, you'd use a more optimized batch fetch approach
          const content = await getContentDetails(id, 'movie'); // Assuming movie as default
          return content;
        });
        
        // Fetch details for watched content
        const watchedContentPromises = user.watchedContent.map(async (id) => {
          const existingContent = contentState.contentDetails[id];
          if (existingContent) return existingContent;
          
          const content = await getContentDetails(id, 'movie');
          return content;
        });
        
        const savedResults = await Promise.all(savedContentPromises);
        const watchedResults = await Promise.all(watchedContentPromises);
        
        // Filter out null results (failed fetches)
        setSavedContent(savedResults.filter(Boolean) as Content[]);
        setWatchedContent(watchedResults.filter(Boolean) as Content[]);
      } catch (error) {
        console.error('Error fetching library content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLibraryContent();
  }, [user.savedContent, user.watchedContent, contentState.contentDetails]);
  
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-6">My Library</h1>
        
        <Tab.Group>
          <Tab.List className="flex space-x-2 border-b border-gray-200 mb-8">
            <Tab 
              className={({ selected }) =>
                `py-3 px-6 text-sm font-medium border-b-2 transition-colors 
                ${selected 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              Saved Content ({savedContent.length})
            </Tab>
            <Tab
              className={({ selected }) =>
                `py-3 px-6 text-sm font-medium border-b-2 transition-colors 
                ${selected 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              Watch History ({watchedContent.length})
            </Tab>
          </Tab.List>
          
          <Tab.Panels>
            <Tab.Panel>
              <ContentGrid
                contents={savedContent}
                isLoading={isLoading}
                emptyMessage="You haven't saved any content yet."
              />
              
              {!isLoading && savedContent.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center mt-4">
                  <h3 className="text-lg font-semibold mb-2">Start building your collection</h3>
                  <p className="text-gray-600 mb-4">
                    Save movies and TV shows you want to watch later by clicking the save button
                    on any content card.
                  </p>
                </div>
              )}
            </Tab.Panel>
            
            <Tab.Panel>
              <ContentGrid
                contents={watchedContent}
                isLoading={isLoading}
                emptyMessage="Your watch history is empty."
              />
              
              {!isLoading && watchedContent.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center mt-4">
                  <h3 className="text-lg font-semibold mb-2">Track what you watch</h3>
                  <p className="text-gray-600 mb-4">
                    Mark content as watched to keep track of your viewing history and to improve
                    your recommendations.
                  </p>
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default LibraryPage; 