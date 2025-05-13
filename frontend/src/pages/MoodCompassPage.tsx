import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MoodCompass from '../components/features/MoodCompass';
import ContentGrid from '../components/ui/ContentGrid';
import { discoverContent } from '../services/api';
import type { RootState } from '../store';
import type { Content } from '../store/slices/contentSlice';
import { setMoodPreference } from '../store/slices/userSlice';

interface ApiError {
  message: string;
}

const MoodCompassPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [moodTips, setMoodTips] = useState<string>('');
  
  // Safely access user preferences with fallbacks using useMemo
  const moodPreference = useMemo(() => {
    return user?.preferences?.moodPreference || { serious: 50, reflective: 50 };
  }, [user?.preferences?.moodPreference]);
  
  // Generate mood tips based on current preferences
  useEffect(() => {
    const { serious, reflective } = moodPreference;
    
    // Convert cartesian coordinates to polar
    // Compass center is at (50, 50)
    const dx = serious - 50;
    const dy = (100 - reflective) - 50; // inverted on y-axis
    
    // Calculate angle in degrees (0° is North, clockwise)
    let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    if (angle < 0) angle += 360;
    
    // Calculate distance from center (normalized to 0-1)
    const distance = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 50);
    
    // Determine compass zone based on angle and corresponding mood
    if (distance < 0.25) {
      setMoodTips("You're at the center of the mood compass! Explore by moving the marker toward moods that interest you most.");
      return;
    }
    
    // North (Cheerful): 337.5° - 22.5°
    if (angle >= 337.5 || angle < 22.5) {
      setMoodTips("You're in the mood for cheerful content! Movies and shows that will make you smile and enjoy lighthearted moments.");
    }
    // North-East (Energetic): 22.5° - 67.5°
    else if (angle >= 22.5 && angle < 67.5) {
      setMoodTips("Your compass points to energy and adrenaline! Get ready for breathtaking adventures and action-packed stories.");
    }
    // East (Reflective): 67.5° - 112.5°
    else if (angle >= 67.5 && angle < 112.5) {
      setMoodTips("You're in a reflective mood. Emotional and deep stories that will resonate with your current state of mind.");
    }
    // South-East (Curious): 112.5° - 157.5°
    else if (angle >= 112.5 && angle < 157.5) {
      setMoodTips("Curiosity guides you! Intrigues, mysteries, and cases to solve will keep you on the edge of your seat.");
    }
    // South (Intellectual): 157.5° - 202.5°
    else if (angle >= 157.5 && angle < 202.5) {
      setMoodTips("You're in the mood for intellectual stimulation! Documentaries and fact-based stories to enrich your knowledge.");
    }
    // South-West (Dreamy): 202.5° - 247.5°
    else if (angle >= 202.5 && angle < 247.5) {
      setMoodTips("Your mood is dreamy! Fantastic content that will take you to imaginary worlds rich with magic.");
    }
    // West (Thoughtful): 247.5° - 292.5°
    else if (angle >= 247.5 && angle < 292.5) {
      setMoodTips("You feel thoughtful and introspective. Intense stories that explore the depths of the human soul.");
    }
    // North-West (Nostalgic): 292.5° - 337.5°
    else if (angle >= 292.5 && angle < 337.5) {
      setMoodTips("Nostalgia embraces you! Films that evoke comforting memories and make you feel at home.");
    }
  }, [moodPreference]);
  
  // Mood change handler
  const handleMoodChange = (serious: number, reflective: number) => {
    try {
      dispatch(setMoodPreference({ serious, reflective }));
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error('Error dispatching mood preference:', apiError);
      setError('Error updating mood preference. Please try again.');
    }
  };
  
  // Fetch content based on the current mood
  useEffect(() => {
    // Track if component is mounted to prevent state updates after unmount
    let isMounted = true;
    
    const fetchContentByMood = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Convert cartesian coordinates to polar
        const dx = moodPreference.serious - 50;
        const dy = (100 - moodPreference.reflective) - 50;
        let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
        if (angle < 0) angle += 360;
        const distance = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 50);
        
        // Base parameters
        const params: Record<string, string | number | boolean> = {
          sort_by: 'popularity.desc', // default sorting
        };
        
        // If we're near the center, show varied content
        if (distance < 0.25) {
          params.sort_by = 'popularity.desc';
        } else {
          // Select genres based on angle (cardinal points related to moods)
          // North (Cheerful): 337.5° - 22.5°
          if (angle >= 337.5 || angle < 22.5) {
            params.with_genres = '35,10751,16'; // Comedy, Family, Animation
          }
          // North-East (Energetic): 22.5° - 67.5°
          else if (angle >= 22.5 && angle < 67.5) {
            params.with_genres = '28,12,53'; // Action, Adventure, Thriller
          }
          // East (Reflective): 67.5° - 112.5°
          else if (angle >= 67.5 && angle < 112.5) {
            params.with_genres = '18,10749'; // Drama, Romance
          }
          // South-East (Curious): 112.5° - 157.5°
          else if (angle >= 112.5 && angle < 157.5) {
            params.with_genres = '9648,80,53'; // Mystery, Crime, Thriller
          }
          // South (Intellectual): 157.5° - 202.5°
          else if (angle >= 157.5 && angle < 202.5) {
            params.with_genres = '99,36'; // Documentary, History
          }
          // South-West (Dreamy): 202.5° - 247.5°
          else if (angle >= 202.5 && angle < 247.5) {
            params.with_genres = '14,878,16'; // Fantasy, Sci-Fi, Animation
          }
          // West (Thoughtful): 247.5° - 292.5°
          else if (angle >= 247.5 && angle < 292.5) {
            params.with_genres = '27,53,9648'; // Horror, Thriller, Mystery
          }
          // North-West (Nostalgic): 292.5° - 337.5°
          else if (angle >= 292.5 && angle < 337.5) {
            params.with_genres = '16,10751,10402'; // Animation, Family, Musical
          }
          
          // Modify sorting based on distance from center
          if (distance > 0.7) {
            params.sort_by = 'vote_average.desc'; // Quality results for strong preferences
            params.vote_count_gte = 100; // Ensure enough ratings
          }
        }
        
        // Limit to first page with lower number of results to avoid performance issues
        params.page = 1;
        params.per_page = 20;
        
        // Execute the API call with a timeout to prevent hanging
        const timeoutPromise = new Promise<Content[]>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 10000); // 10-second timeout
        });
        
        const results = await Promise.race([
          discoverContent(params),
          timeoutPromise
        ]) as Content[];
        
        // Ensure component is still mounted before updating state
        if (isMounted) {
          if (!Array.isArray(results) || results.length === 0) {
            setError('No content found for this mood. Try adjusting the compass.');
            setContents([]);
          } else {
            // Limit number of results to improve performance
            setContents(results.slice(0, 12));
          }
          setIsLoading(false);
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        console.error('Error fetching content by mood:', apiError);
        // Only update state if still mounted
        if (isMounted) {
          setError('Unable to load content. Please try again later.');
          setContents([]);
          setIsLoading(false);
        }
      }
    };
    
    // Use setTimeout to debounce the API calls when mood changes
    const timer = setTimeout(() => {
      fetchContentByMood();
    }, 800);
    
    // Clean up function to clear timeout and track mount state
    return () => {
      clearTimeout(timer);
      isMounted = false;
    };
  }, [moodPreference.serious, moodPreference.reflective]);
  
  return (
    <div className="py-12 bg-slate-50 min-h-screen text-gray-800">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-600">Mood Compass</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Navigate the vast ocean of cinematic content based on your current mood.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 max-w-2xl mx-auto">
            <span className="flex items-center"><span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-1"></span>Cheerful</span>
            <span className="flex items-center"><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>Energetic</span>
            <span className="flex items-center"><span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>Reflective</span>
            <span className="flex items-center"><span className="inline-block w-3 h-3 bg-indigo-600 rounded-full mr-1"></span>Curious</span>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}
        
        <div className="mb-24">
          <MoodCompass
            contents={contents}
            onMoodChange={handleMoodChange}
            isLoading={isLoading}
          />
        </div>
        
        {moodTips && (
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 p-4 rounded-lg mb-10 text-center">
            <div className="font-medium mb-1">Your current mood:</div>
            <p>{moodTips}</p>
          </div>
        )}
        
        {!isLoading && contents.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-600">Content for your mood</h2>
            </div>
            <ContentGrid
              contents={contents}
              isLoading={isLoading}
              emptyMessage="Adjust the compass to discover new content"
              initialLimit={6}
              incrementAmount={6}
              columns={3}
            />
            <div className="mt-6 text-center">
              <Link 
                to="/discover"
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-block"
              >
                View all in Discover →
              </Link>
            </div>
          </div>
        )}
        
        <div className="mt-16 bg-white border border-indigo-100 p-6 md:p-8 rounded-xl shadow-md">
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-indigo-600">How the Mood Compass Works</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
              <h4 className="font-semibold text-lg mb-3 flex items-center text-indigo-700">
                <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-2">1</span>
                Mood States
              </h4>
              <p className="text-gray-600">
                Each direction of the compass represents a different mood. From the lightheartedness of Cheerful to the depth of Reflective, from the rigor of Intellectual to nostalgia, you'll find content that matches your mood.
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
              <h4 className="font-semibold text-lg mb-3 flex items-center text-indigo-700">
                <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-2">2</span>
                Emotion Intensity
              </h4>
              <p className="text-gray-600">
                The further you move from the center of the compass, the more intense the emotion you're seeking. The center offers a balanced mix of different moods, ideal when you don't have specific preferences.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center text-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
              </svg>
              The Compass Philosophy
            </h4>
            <p className="text-gray-600">
              Just as sailors of old followed the compass to navigate unknown waters, this compass guides you through your emotions to discover content that resonates with your current inner world. A unique cinematic journey that begins within you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodCompassPage; 