import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SerendipityEngine from '../components/features/SerendipityEngine';
import { discoverContent } from '../services/api';
import type { RootState } from '../store';
import type { Content } from '../store/slices/contentSlice';
import { addSavedContent, addWatchedContent } from '../store/slices/userSlice';

const SerendipityPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user) as import('../store/slices/userSlice').UserState;
  const { watchedContent, savedContent } = user;
  
  // Discover a single random content item
  const handleDiscover = useCallback(async (): Promise<Content> => {
    // A random page number between 1 and 10
    const randomPage = Math.floor(Math.random() * 10) + 1;
    
    // Get a list of content with randomized parameters
    const params = {
      page: randomPage,
      sort_by: Math.random() > 0.5 ? 'vote_average.desc' : 'popularity.desc',
      // Randomly choose between movie and TV
      media_type: Math.random() > 0.5 ? 'movie' : 'tv',
    };
    
    const results = await discoverContent(params);
    
    // Filter out content the user has already seen or saved
    const newContent = results.filter(
      (content) => 
        !watchedContent.includes(content.id) && 
        !savedContent.includes(content.id)
    );
    
    // Pick a random item from the results
    const randomIndex = Math.floor(Math.random() * newContent.length);
    return newContent[randomIndex] || results[0]; // Fallback if all content has been seen
  }, [watchedContent, savedContent]);
  
  const handleAccept = (content: Content) => {
    // Add to saved content
    dispatch(addSavedContent(content.id));
  };
  
  const handleReject = (content: Content) => {
    // Add to watched content to avoid recommending it again
    dispatch(addWatchedContent(content.id));
  };
  
  return (
    <div className="py-16">
      <div className="container-custom">
        <SerendipityEngine
          onDiscover={handleDiscover}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </div>
    </div>
  );
};

export default SerendipityPage; 