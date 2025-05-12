import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MoodCompass from '../components/features/MoodCompass';
import ContentGrid from '../components/ui/ContentGrid';
import { discoverContent } from '../services/api';
import type { RootState } from '../store';
import type { Content } from '../store/slices/contentSlice';
import { setMoodPreference } from '../store/slices/userSlice';

const MoodCompassPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Safely access user preferences with fallbacks
  const moodPreference = user?.preferences?.moodPreference || { serious: 50, reflective: 50 };
  
  // Fetch content based on the current mood
  useEffect(() => {
    const fetchContentByMood = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // This is a simplified version; in a real app, you'd have more sophisticated
        // parameters based on the mood values
        const params = {
          sort_by: moodPreference.serious > 50 ? 'vote_average.desc' : 'popularity.desc',
          with_genres: moodPreference.reflective > 50 ? '18,9648,10749' : '28,12,35',
        };
        
        const results = await discoverContent(params);
        
        if (!Array.isArray(results) || results.length === 0) {
          setError('No content found matching your mood. Try adjusting the compass.');
          setContents([]);
        } else {
          // Assign random mood values to each content (in a real app, these would be determined by algorithm)
          const contentsWithMood = results.map(content => ({
            ...content,
            mood: {
              serious: Math.floor(Math.random() * 100),
              reflective: Math.floor(Math.random() * 100),
            }
          }));
          
          setContents(contentsWithMood);
        }
      } catch (error) {
        console.error('Error fetching content by mood:', error);
        setError('Failed to load content. Please try again later.');
        setContents([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContentByMood();
  }, [moodPreference.serious, moodPreference.reflective]);
  
  const handleMoodChange = (serious: number, reflective: number) => {
    try {
      dispatch(setMoodPreference({ serious, reflective }));
    } catch (error) {
      console.error('Error dispatching mood preference:', error);
      setError('Error updating mood preference. Please try again.');
    }
  };
  
  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Mood Compass</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Drag the compass to find content that matches your current mood, from light-hearted fun to serious drama, action-packed to deeply reflective.
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
            {error}
          </div>
        )}
        
        <div className="mb-16">
          <MoodCompass
            contents={contents}
            onMoodChange={handleMoodChange}
            isLoading={isLoading}
          />
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Discovered For Your Mood</h2>
          <ContentGrid
            contents={contents}
            isLoading={isLoading}
            emptyMessage="Adjust the mood compass to discover content"
          />
        </div>
        
        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-4">How It Works</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Horizontal Axis: Tone</h4>
              <p className="text-gray-600">
                From light-hearted comedies and feel-good content on the left to serious dramas and intense thrillers on the right.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Vertical Axis: Engagement</h4>
              <p className="text-gray-600">
                From action-packed and adrenaline-fueled at the top to thoughtful and reflective at the bottom.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">
              As you move the compass, we dynamically adjust our recommendations to match your precise mood. The closer a title appears to your pointer, the better it matches your current mood preference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodCompassPage; 