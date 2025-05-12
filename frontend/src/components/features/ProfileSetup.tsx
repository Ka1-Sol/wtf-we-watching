import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCreatorPreference, addGenrePreference, setProfileComplete } from '../../store/slices/userSlice';

interface Genre {
  id: number;
  name: string;
}

interface Creator {
  id: number;
  name: string;
}

const popularGenres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const popularCreators: Creator[] = [
  { id: 138, name: 'Quentin Tarantino' },
  { id: 525, name: 'Christopher Nolan' },
  { id: 1032, name: 'Martin Scorsese' },
  { id: 4762, name: 'Steven Spielberg' },
  { id: 1223, name: 'Wes Anderson' },
  { id: 5655, name: 'Denis Villeneuve' },
  { id: 5281, name: 'David Fincher' },
  { id: 1769, name: 'Greta Gerwig' },
  { id: 5642, name: 'Bong Joon-ho' },
  { id: 1398, name: 'Spike Lee' },
  { id: 6891, name: 'Ava DuVernay' },
  { id: 5249, name: 'Coen Brothers' },
  { id: 1242, name: 'Sofia Coppola' },
  { id: 6741, name: 'Jordan Peele' },
  { id: 4385, name: 'Hayao Miyazaki' },
];

enum SetupStep {
  WELCOME,
  GENRES,
  CREATORS,
  COMPLETE
}

const ProfileSetup = () => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState<SetupStep>(SetupStep.WELCOME);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<Creator[]>([]);

  const handleGenreToggle = (genre: Genre) => {
    const isSelected = selectedGenres.some(g => g.id === genre.id);
    
    if (isSelected) {
      setSelectedGenres(selectedGenres.filter(g => g.id !== genre.id));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleCreatorToggle = (creator: Creator) => {
    const isSelected = selectedCreators.some(c => c.id === creator.id);
    
    if (isSelected) {
      setSelectedCreators(selectedCreators.filter(c => c.id !== creator.id));
    } else {
      setSelectedCreators([...selectedCreators, creator]);
    }
  };

  const handleNextStep = () => {
    if (currentStep === SetupStep.COMPLETE) {
      // Save all selected preferences to Redux
      selectedGenres.forEach(genre => {
        dispatch(addGenrePreference(genre));
      });
      
      selectedCreators.forEach(creator => {
        dispatch(addCreatorPreference(creator));
      });
      
      // Mark profile as complete
      dispatch(setProfileComplete(true));
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div 
          className="h-full bg-secondary transition-all duration-500"
          style={{ width: `${((currentStep + 1) / (Object.keys(SetupStep).length / 2)) * 100}%` }}
        ></div>
      </div>
      
      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[400px] flex flex-col"
          >
            {currentStep === SetupStep.WELCOME && (
              <WelcomeStep />
            )}
            
            {currentStep === SetupStep.GENRES && (
              <GenresStep
                genres={popularGenres}
                selectedGenres={selectedGenres}
                onToggle={handleGenreToggle}
              />
            )}
            
            {currentStep === SetupStep.CREATORS && (
              <CreatorsStep
                creators={popularCreators}
                selectedCreators={selectedCreators}
                onToggle={handleCreatorToggle}
              />
            )}
            
            {currentStep === SetupStep.COMPLETE && (
              <CompleteStep
                selectedGenres={selectedGenres}
                selectedCreators={selectedCreators}
              />
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrevStep}
            className={`btn btn-secondary ${currentStep === SetupStep.WELCOME ? 'invisible' : ''}`}
          >
            Back
          </button>
          
          <button
            onClick={handleNextStep}
            className="btn btn-primary"
          >
            {currentStep === SetupStep.COMPLETE ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

const WelcomeStep = () => (
  <div className="text-center py-12">
    <h2 className="text-3xl font-bold mb-6">Welcome to WTF We Watching?</h2>
    <p className="text-lg text-gray-600 mb-8">
      Let's help you discover movies and shows you'll actually love.
    </p>
    <p className="text-gray-600 mb-4">
      We'll ask you a few questions to understand your taste and preferences.
      This will help us recommend content that's right for you.
    </p>
    <div className="mt-8 flex justify-center space-x-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-secondary/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        </div>
        <p className="mt-2 text-sm font-medium">Pick Genres</p>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-secondary/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="mt-2 text-sm font-medium">Select Creators</p>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-secondary/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="mt-2 text-sm font-medium">Start Watching</p>
      </div>
    </div>
  </div>
);

interface GenresStepProps {
  genres: Genre[];
  selectedGenres: Genre[];
  onToggle: (genre: Genre) => void;
}

const GenresStep = ({ genres, selectedGenres, onToggle }: GenresStepProps) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">What genres do you enjoy?</h2>
    <p className="text-gray-600 mb-6">
      Select all that apply. This helps us understand what type of content you prefer.
    </p>
    <div className="flex flex-wrap gap-2">
      {genres.map(genre => (
        <button
          key={genre.id}
          onClick={() => onToggle(genre)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedGenres.some(g => g.id === genre.id)
              ? 'bg-secondary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
    {selectedGenres.length > 0 && (
      <p className="mt-4 text-sm text-gray-500">
        {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''} selected
      </p>
    )}
  </div>
);

interface CreatorsStepProps {
  creators: Creator[];
  selectedCreators: Creator[];
  onToggle: (creator: Creator) => void;
}

const CreatorsStep = ({ creators, selectedCreators, onToggle }: CreatorsStepProps) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Which creators do you like?</h2>
    <p className="text-gray-600 mb-6">
      Choose directors or showrunners whose work you enjoy.
    </p>
    <div className="flex flex-wrap gap-3">
      {creators.map(creator => (
        <button
          key={creator.id}
          onClick={() => onToggle(creator)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedCreators.some(c => c.id === creator.id)
              ? 'bg-secondary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {creator.name}
        </button>
      ))}
    </div>
    {selectedCreators.length > 0 && (
      <p className="mt-4 text-sm text-gray-500">
        {selectedCreators.length} creator{selectedCreators.length !== 1 ? 's' : ''} selected
      </p>
    )}
  </div>
);

interface CompleteStepProps {
  selectedGenres: Genre[];
  selectedCreators: Creator[];
}

const CompleteStep = ({ selectedGenres, selectedCreators }: CompleteStepProps) => (
  <div className="text-center py-8">
    <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h2 className="text-2xl font-bold mb-4">Your profile is ready!</h2>
    <p className="text-gray-600 mb-6">
      Based on your preferences, we'll help you discover amazing content.
    </p>
    <div className="mt-6 bg-gray-50 rounded-lg p-4 text-left">
      <h3 className="font-semibold mb-2">Your selected genres:</h3>
      <div className="flex flex-wrap gap-1 mb-4">
        {selectedGenres.length > 0 ? (
          selectedGenres.map(genre => (
            <span key={genre.id} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
              {genre.name}
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm">No genres selected</span>
        )}
      </div>
      
      <h3 className="font-semibold mb-2">Your selected creators:</h3>
      <div className="flex flex-wrap gap-1">
        {selectedCreators.length > 0 ? (
          selectedCreators.map(creator => (
            <span key={creator.id} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
              {creator.name}
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm">No creators selected</span>
        )}
      </div>
    </div>
  </div>
);

export default ProfileSetup; 