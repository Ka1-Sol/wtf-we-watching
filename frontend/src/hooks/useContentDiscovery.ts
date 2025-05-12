import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { discoverContent, getRecommendedContent, searchContent } from '../services/api';
import type { RootState } from '../store';
import { setDiscoveryContent } from '../store/slices/contentSlice';
import type { Genre, UserState } from '../store/slices/userSlice';

interface UseContentDiscoveryOptions {
  filterWatched?: boolean;
}

const useContentDiscovery = (options: UseContentDiscoveryOptions = {}) => {
  const { filterWatched = true } = options;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const user = useSelector((state: RootState) => state.user) as UserState;
  const watchedContent = user.watchedContent;
  const preferences = user.preferences;
  
  // Discover content based on parameters
  const discover = useCallback(async (params: Record<string, any> = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      let results = await discoverContent(params);
      
      // Filter out already watched content if needed
      if (filterWatched && watchedContent.length > 0) {
        results = results.filter(content => !watchedContent.includes(content.id));
      }
      
      // Update Redux state
      dispatch(setDiscoveryContent(results));
      
      return results;
    } catch (err) {
      setError('Failed to discover content. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, filterWatched, watchedContent]);
  
  // Search content by query
  const search = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      let results = await searchContent(query);
      
      // Filter out already watched content if needed
      if (filterWatched && watchedContent.length > 0) {
        results = results.filter(content => !watchedContent.includes(content.id));
      }
      
      return results;
    } catch (err) {
      setError('Failed to search content. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [filterWatched, watchedContent]);
  
  // Get recommendations based on user preferences
  const getRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Extract genre IDs from user preferences
      const genreIds = preferences.genres.map((genre: Genre) => genre.id);
      
      let results = await getRecommendedContent(genreIds, filterWatched ? watchedContent : []);
      
      return results;
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [preferences.genres, watchedContent, filterWatched]);
  
  // Get content matching the user's current mood
  const getContentByMood = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // This is a simplified version; in a real app, you'd have more sophisticated
      // parameters based on the mood values
      const params = {
        sort_by: preferences.moodPreference.serious > 50 ? 'vote_average.desc' : 'popularity.desc',
        with_genres: preferences.moodPreference.reflective > 50 ? '18,9648,10749' : '28,12,35',
      };
      
      let results = await discoverContent(params);
      
      // Filter out already watched content if needed
      if (filterWatched && watchedContent.length > 0) {
        results = results.filter(content => !watchedContent.includes(content.id));
      }
      
      // Assign mood values to each content (in a real app, these would be determined by algorithm)
      const contentsWithMood = results.map(content => ({
        ...content,
        mood: {
          serious: Math.floor(Math.random() * 100),
          reflective: Math.floor(Math.random() * 100),
        }
      }));
      
      return contentsWithMood;
    } catch (err) {
      setError('Failed to get content by mood. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [preferences.moodPreference, filterWatched, watchedContent]);
  
  return {
    discover,
    search,
    getRecommendations,
    getContentByMood,
    isLoading,
    error,
  };
};

export default useContentDiscovery; 