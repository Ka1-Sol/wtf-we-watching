import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { discoverContent } from '../../services/api';
import type { Content } from '../../store/slices/contentSlice';
import ContentCard from '../ui/ContentCard';

// Default time for decision making
const DEFAULT_DECISION_TIME = 120; // 2 minutes

interface DecisionTimerProps {
  onDecisionMade?: (content: Content | null) => void;
  preferredGenres?: number[];
}

const DecisionTimer = ({ onDecisionMade, preferredGenres = [] }: DecisionTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_DECISION_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [options, setOptions] = useState<Content[]>([]);
  const [selectedOption, setSelectedOption] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // Reset everything to initial state
  const resetTimer = useCallback(() => {
    setTimeRemaining(DEFAULT_DECISION_TIME);
    setIsActive(false);
    setIsPaused(false);
    setSelectedOption(null);
    setShowResult(false);
  }, []);
  
  // Toggle pause state
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  // Fetch content options
  const fetchOptions = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const params: Record<string, any> = {
        sort_by: 'popularity.desc',
      };
      
      // Add genre filtering if preferred genres are provided
      if (preferredGenres.length > 0) {
        params.with_genres = preferredGenres.join('|');
      }
      
      const results = await discoverContent(params);
      
      // Take random 2 options from the results
      const shuffled = [...results].sort(() => 0.5 - Math.random());
      setOptions(shuffled.slice(0, 2));
    } catch (error) {
      console.error('Error fetching options:', error);
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [preferredGenres]);
  
  // Start the timer and fetch options
  const startTimer = async () => {
    await fetchOptions();
    setIsActive(true);
    setIsPaused(false);
  };
  
  // Handle timer expiration
  const handleTimerExpired = useCallback(() => {
    setIsActive(false);
    
    // Randomly select one of the options
    if (options.length > 0) {
      const randomIndex = Math.floor(Math.random() * options.length);
      setSelectedOption(options[randomIndex]);
    }
    
    setShowResult(true);
    
    // Call callback if provided
    if (onDecisionMade) {
      onDecisionMade(selectedOption);
    }
  }, [options, onDecisionMade, selectedOption]);
  
  // Handle manual selection
  const handleSelectOption = (content: Content) => {
    setSelectedOption(content);
    setIsActive(false);
    setShowResult(true);
    
    // Call callback if provided
    if (onDecisionMade) {
      onDecisionMade(content);
    }
  };
  
  // Timer effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && !isPaused) {
      interval = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            window.clearInterval(interval);
            handleTimerExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (interval) {
      window.clearInterval(interval);
    }
    
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isActive, isPaused, handleTimerExpired]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progressPercent = (timeRemaining / DEFAULT_DECISION_TIME) * 100;
  
  return (
    <div className="max-w-4xl mx-auto">
      {!isActive && !showResult ? (
        <div className="bg-white rounded-xl shadow-lg text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Decision Timer</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Can't decide what to watch? Let us help you overcome choice paralysis
            with our guided decision timer.
          </p>
          
          <button
            onClick={startTimer}
            disabled={isLoading}
            className="btn btn-primary px-6 py-3"
          >
            {isLoading ? 'Loading options...' : 'Start Decision Timer'}
          </button>
        </div>
      ) : showResult ? (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Your Decision</h2>
          
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-sm mx-auto mb-6"
            >
              {selectedOption ? (
                <div className="text-center">
                  <div className="mb-4">
                    <ContentCard content={selectedOption} />
                  </div>
                  <h3 className="text-xl font-bold">{selectedOption.title}</h3>
                  <p className="text-gray-500">
                    {selectedOption.type === 'movie' ? 'Movie' : 'TV Show'}
                    {selectedOption.releaseDate && ` • ${new Date(selectedOption.releaseDate).getFullYear()}`}
                  </p>
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No selection was made. Try again!
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={resetTimer}
              className="btn btn-secondary"
            >
              Start Over
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">Choose Within</h2>
              <div className="text-2xl font-mono font-bold">
                {formatTime(timeRemaining)}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          
          <p className="text-center text-gray-600 mb-6">
            Select one option before time runs out, or we'll choose for you!
          </p>
          
          {isLoading ? (
            <div className="flex justify-center p-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {options.map((option) => (
                <div 
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className="cursor-pointer transform transition-all hover:scale-105"
                >
                  <ContentCard content={option} />
                  <div className="mt-2 text-center">
                    <h3 className="font-bold">{option.title}</h3>
                    <p className="text-sm text-gray-500">
                      {option.releaseDate && new Date(option.releaseDate).getFullYear()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-center gap-4">
            <button
              onClick={togglePause}
              className="btn btn-secondary"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={resetTimer}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionTimer; 