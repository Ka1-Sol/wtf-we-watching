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
    <div className="w-full max-w-full sm:max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100">
        <div 
          className="h-full bg-secondary transition-all duration-500"
          style={{ width: `${((currentStep + 1) / (Object.keys(SetupStep).length / 2)) * 100}%` }}
        ></div>
      </div>
      
      <div className="p-6 md:p-10">
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
            className={`btn btn-secondary text-lg px-6 py-3 ${currentStep === SetupStep.WELCOME ? 'invisible' : ''}`}
          >
            Back
          </button>
          
          <button
            onClick={handleNextStep}
            className="btn btn-primary text-lg px-8 py-3"
          >
            {currentStep === SetupStep.COMPLETE ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

const WelcomeStep = () => (
  <div className="text-center py-8">
    <h2 className="text-3xl md:text-4xl font-bold mb-6">Welcome to WTF We Watching?</h2>
    <p className="text-xl md:text-2xl text-gray-600 mb-6">
      Let's help you discover movies and shows you'll actually love.
    </p>
    <div className="max-w-2xl mx-auto bg-blue-50 rounded-lg p-6 text-left mb-6">
      <p className="text-lg md:text-xl text-gray-700 mb-3">
        We'll ask you to select your favorite:
      </p>
      <ul className="mt-2 space-y-4">
        <li className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-medium">1</span>
          <span className="text-lg">Movie genres you enjoy</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-medium">2</span>
          <span className="text-lg">Directors and creators you follow</span>
        </li>
      </ul>
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
    <h2 className="text-3xl font-bold mb-4 text-center">What genres do you enjoy?</h2>
    <p className="text-xl text-gray-600 mb-8 text-center">
      Select all that apply to get better recommendations.
    </p>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {genres.map(genre => (
        <button
          key={genre.id}
          onClick={() => onToggle(genre)}
          className={`px-4 py-3 rounded-lg text-lg font-medium transition-all flex items-center justify-center ${
            selectedGenres.some(g => g.id === genre.id)
              ? 'bg-secondary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {selectedGenres.some(g => g.id === genre.id) && (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          )}
          {genre.name}
        </button>
      ))}
    </div>
    {selectedGenres.length > 0 && (
      <p className="mt-6 text-lg text-center text-secondary font-medium">
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
    <h2 className="text-3xl font-bold mb-4 text-center">Which creators do you like?</h2>
    <p className="text-xl text-gray-600 mb-8 text-center">
      Choose directors or showrunners whose work you enjoy.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {creators.map(creator => (
        <button
          key={creator.id}
          onClick={() => onToggle(creator)}
          className={`px-4 py-3 rounded-lg text-lg font-medium transition-all flex items-center ${
            selectedCreators.some(c => c.id === creator.id)
              ? 'bg-secondary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {selectedCreators.some(c => c.id === creator.id) && (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          )}
          {creator.name}
        </button>
      ))}
    </div>
    {selectedCreators.length > 0 && (
      <p className="mt-6 text-lg text-center text-secondary font-medium">
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
    <h2 className="text-3xl font-bold mb-4">You're all set!</h2>
    <p className="text-xl text-gray-600 mb-8">
      Based on your preferences, we'll recommend content you'll actually love.
    </p>
    
    <div className="max-w-2xl mx-auto mt-6 bg-gray-50 rounded-lg p-6 text-left">
      <h3 className="text-xl font-medium mb-4 text-gray-700">Your preferences:</h3>
      
      {(selectedGenres.length > 0 || selectedCreators.length > 0) ? (
        <>
          {selectedGenres.length > 0 && (
            <div className="mb-6">
              <p className="text-lg font-medium text-gray-500 mb-2">Genres:</p>
              <div className="flex flex-wrap gap-2">
                {selectedGenres.map(genre => (
                  <span key={genre.id} className="bg-gray-200 text-gray-700 px-3 py-2 rounded text-base">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {selectedCreators.length > 0 && (
            <div>
              <p className="text-lg font-medium text-gray-500 mb-2">Creators:</p>
              <div className="flex flex-wrap gap-2">
                {selectedCreators.map(creator => (
                  <span key={creator.id} className="bg-gray-200 text-gray-700 px-3 py-2 rounded text-base">
                    {creator.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-lg text-gray-500 py-2">No preferences selected. You can update these anytime in your profile settings.</p>
      )}
    </div>
    
    <p className="text-lg text-gray-500 mt-8">
      Click "Finish" below to start discovering content.
    </p>
  </div>
);

export default ProfileSetup; 