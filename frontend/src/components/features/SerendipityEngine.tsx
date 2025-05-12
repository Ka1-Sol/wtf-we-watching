import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getImageUrl } from '../../services/api';
import type { Content } from '../../store/slices/contentSlice';

interface SerendipityEngineProps {
  onDiscover: () => Promise<Content>;
  onAccept?: (content: Content) => void;
  onReject?: (content: Content) => void;
  isLoading?: boolean;
}

const SerendipityEngine = ({
  onDiscover,
  onAccept,
  onReject,
  isLoading = false,
}: SerendipityEngineProps) => {
  const [content, setContent] = useState<Content | null>(null);
  const [discovering, setDiscovering] = useState(false);
  const [rejectReasons, setRejectReasons] = useState<string[]>([]);
  const [showReasons, setShowReasons] = useState(false);
  const [activeExplanation, setActiveExplanation] = useState(0);
  
  // Sample reasons why this content might be interesting
  const explanations = [
    "Unique narrative structure that breaks conventions",
    "Visual style that influenced many later works",
    "Cultural importance that transcends the genre",
    "Explores themes relevant to today in a fresh way",
    "Hidden gem with outstanding performances"
  ];
  
  // Periodically cycle through explanations
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveExplanation((prev) => (prev + 1) % explanations.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [explanations.length]);
  
  const handleDiscover = async () => {
    try {
      setDiscovering(true);
      const discoveredContent = await onDiscover();
      setContent(discoveredContent);
      setRejectReasons([]);
      setShowReasons(false);
    } catch (error) {
      console.error('Error discovering content:', error);
    } finally {
      setDiscovering(false);
    }
  };
  
  const handleAccept = () => {
    if (content && onAccept) {
      onAccept(content);
    }
  };
  
  const handleReject = () => {
    if (content && onReject) {
      onReject(content);
      
      // Generate rejection reasons
      const reasons = [
        "Seen it already",
        "Not in the mood for this genre",
        "Not interested in this theme",
        "Don't like the creators",
        "Prefer something more recent",
        "Prefer something older/classic",
      ];
      
      // Randomly select 3 reasons
      const selectedReasons = [...reasons]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      setRejectReasons(selectedReasons);
      setShowReasons(true);
    }
  };
  
  const handleRejectReason = (reason: string) => {
    // In a real app, we would use this feedback to improve future recommendations
    console.log('Rejection reason:', reason);
    setShowReasons(false);
    handleDiscover();
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Serendipity Engine</h2>
        <p className="text-gray-600">
          Discover something unexpected but delightful. Let us surprise you with content that might be outside your usual preferences but could become a new favorite.
        </p>
      </div>
      
      <div className="relative bg-white rounded-xl shadow-xl overflow-hidden min-h-[500px]">
        {!content && !discovering && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="w-24 h-24 rounded-full bg-secondary/20 mb-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Ready for a Discovery?</h3>
            <p className="text-gray-600 mb-8 max-w-md">
              Our algorithm will suggest something you might not have considered, but could be perfect for you.
            </p>
            <button
              onClick={handleDiscover}
              disabled={isLoading}
              className="btn btn-primary"
            >
              Discover Something Unexpected
            </button>
          </div>
        )}
        
        {(discovering || isLoading) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full border-t-4 border-secondary opacity-25 animate-spin"></div>
              <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-secondary animate-pulse-slow"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Finding something special...</p>
          </div>
        )}
        
        {content && !discovering && !showReasons && (
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Content Image */}
            <div className="relative aspect-[2/3] md:aspect-auto">
              <img
                src={getImageUrl(content.posterPath, 'w780')}
                alt={content.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <span className="inline-block px-2 py-1 bg-primary/80 text-white text-xs uppercase tracking-wider rounded-md backdrop-blur-sm mb-2">
                  {content.type}
                </span>
                <h3 className="text-white text-2xl font-bold">{content.title}</h3>
                {content.releaseDate && (
                  <p className="text-gray-300">
                    {new Date(content.releaseDate).getFullYear()}
                    {content.genres && content.genres.length > 0 && (
                      <span> • {content.genres.map(g => g.name).join(', ')}</span>
                    )}
                  </p>
                )}
              </div>
            </div>
            
            {/* Content Details */}
            <div className="p-6 flex flex-col">
              <h3 className="text-xl font-bold mb-4">Why This Might Surprise You</h3>
              
              <div className="mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeExplanation}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <p className="text-gray-700">
                      {explanations[activeExplanation]}
                    </p>
                  </motion.div>
                </AnimatePresence>
                
                <div className="flex justify-center mt-2">
                  {explanations.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveExplanation(index)}
                      className={`w-2 h-2 mx-1 rounded-full transition-all ${
                        index === activeExplanation ? 'bg-secondary' : 'bg-gray-300'
                      }`}
                      aria-label={`Explanation ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              {content.overview && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Overview</h4>
                  <p className="text-gray-700 line-clamp-4">{content.overview}</p>
                </div>
              )}
              
              <div className="mt-auto flex gap-4">
                <button 
                  onClick={handleReject}
                  className="btn btn-secondary flex-1"
                >
                  Not Interested
                </button>
                <button 
                  onClick={handleAccept}
                  className="btn btn-primary flex-1"
                >
                  Add to Watchlist
                </button>
              </div>
              
              <button 
                onClick={handleDiscover}
                className="mt-4 text-secondary hover:text-secondary/70 text-sm font-medium"
              >
                Try Another Suggestion
              </button>
            </div>
          </div>
        )}
        
        {/* Rejection Reasons */}
        {showReasons && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white">
            <h3 className="text-xl font-bold mb-6">Why weren't you interested?</h3>
            <p className="text-gray-600 mb-6">
              Your feedback helps us make better suggestions next time.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-sm">
              {rejectReasons.map((reason, index) => (
                <button
                  key={index}
                  onClick={() => handleRejectReason(reason)}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-left text-gray-800 transition-colors"
                >
                  {reason}
                </button>
              ))}
              <button
                onClick={() => handleRejectReason('Other reason')}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-left text-gray-800 transition-colors"
              >
                Other reason
              </button>
            </div>
            <button 
              onClick={() => setShowReasons(false)}
              className="mt-6 text-secondary hover:text-secondary/70 text-sm font-medium"
            >
              Skip Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SerendipityEngine; 