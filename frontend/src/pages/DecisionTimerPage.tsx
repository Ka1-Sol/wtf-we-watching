import { useState } from 'react';
import { useSelector } from 'react-redux';
import DecisionTimer from '../components/features/DecisionTimer';
import type { RootState } from '../store';
import type { Content } from '../store/slices/contentSlice';
import type { UserState } from '../store/slices/userSlice';

const DecisionTimerPage = () => {
  const user = useSelector((state: RootState) => state.user) as UserState;
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  
  // Get user's preferred genres for the decision timer
  const preferredGenreIds = user.preferences.genres.map(genre => genre.id);
  
  const handleDecisionMade = (content: Content | null) => {
    setSelectedContent(content);
    // In a real app, you might also save this to user history or take other actions
  };
  
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Decision Timer</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stuck in analysis paralysis? Let our Decision Timer guide you to a choice 
            with a time-bound selection process.
          </p>
        </div>
        
        <DecisionTimer 
          onDecisionMade={handleDecisionMade}
          preferredGenres={preferredGenreIds}
        />
        
        {/* Decision psychology section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Why It Works</h2>
          <p className="text-gray-700 mb-6">
            The Decision Timer leverages psychological principles to overcome choice paralysis:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 p-5 rounded-lg">
              <h3 className="font-bold text-indigo-700 mb-2">Time Constraints</h3>
              <p className="text-gray-700">
                Adding a time limit activates your intuitive decision-making system and
                reduces overthinking.
              </p>
            </div>
            
            <div className="bg-indigo-50 p-5 rounded-lg">
              <h3 className="font-bold text-indigo-700 mb-2">Limited Options</h3>
              <p className="text-gray-700">
                By presenting just two choices, we eliminate the overwhelming feeling
                that comes with too many possibilities.
              </p>
            </div>
            
            <div className="bg-indigo-50 p-5 rounded-lg">
              <h3 className="font-bold text-indigo-700 mb-2">Curated Selection</h3>
              <p className="text-gray-700">
                Options are tailored to your preferences, ensuring both choices
                have a high likelihood of satisfying you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionTimerPage; 