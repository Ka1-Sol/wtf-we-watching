import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { discoverContent } from '../../services/api';
import type { Content } from '../../store/slices/contentSlice';
import ContentGrid from '../ui/ContentGrid';

// Decades available for exploration
const decades = [
  { id: '1950s', label: '1950s', range: '1950-01-01,1959-12-31' },
  { id: '1960s', label: '1960s', range: '1960-01-01,1969-12-31' },
  { id: '1970s', label: '1970s', range: '1970-01-01,1979-12-31' },
  { id: '1980s', label: '1980s', range: '1980-01-01,1989-12-31' },
  { id: '1990s', label: '1990s', range: '1990-01-01,1999-12-31' },
  { id: '2000s', label: '2000s', range: '2000-01-01,2009-12-31' },
  { id: '2010s', label: '2010s', range: '2010-01-01,2019-12-31' },
  { id: '2020s', label: 'Current Era', range: '2020-01-01,2029-12-31' },
];

// Historical events for context
const historicalContext: Record<string, string[]> = {
  '1950s': [
    'Post-WWII economic boom',
    'Beginning of the Cold War',
    'Rise of television as mass medium',
    'Rock and roll revolution in music',
    'Civil Rights Movement begins',
  ],
  '1960s': [
    'Space Race and Moon Landing',
    'Vietnam War',
    'Counterculture movement',
    'Assassination of JFK and MLK',
    'Woodstock music festival',
  ],
  '1970s': [
    'Watergate scandal',
    'Oil crisis and economic recession',
    'Rise of personal computers',
    'Disco music era',
    'End of Vietnam War',
  ],
  '1980s': [
    'MTV launches',
    'AIDS epidemic begins',
    'Fall of the Berlin Wall',
    'Reagan and Thatcher era',
    'Personal computers become mainstream',
  ],
  '1990s': [
    'End of the Cold War',
    'Rise of the internet',
    'Grunge and hip-hop music',
    'Gulf War',
    'Dot-com bubble begins',
  ],
  '2000s': [
    '9/11 terrorist attacks',
    'Social media emergence',
    'Iraq and Afghanistan wars',
    'Global financial crisis',
    'Smartphones transform communication',
  ],
  '2010s': [
    'Streaming services transform entertainment',
    'Rise of social justice movements',
    'Climate change activism grows',
    'Social media dominates culture',
    'Smartphone era peaks',
  ],
  '2020s': [
    'COVID-19 pandemic',
    'Streaming wars intensify',
    'Rise of metaverse concepts',
    'Artificial intelligence breakthrough',
    'Climate crisis escalation',
  ],
};

interface TimeMachineProps {
  initialDecade?: string;
}

const TimeMachine: React.FC<TimeMachineProps> = ({ initialDecade = '1990s' }) => {
  const [selectedDecade, setSelectedDecade] = useState(initialDecade);
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contextIndex, setContextIndex] = useState(0);
  
  // Fetch content for the selected decade
  useEffect(() => {
    const fetchDecadeContent = async () => {
      setIsLoading(true);
      setContent([]);
      
      try {
        const selectedDecadeData = decades.find(d => d.id === selectedDecade);
        if (!selectedDecadeData) return;
        
        const [startDate, endDate] = selectedDecadeData.range.split(',');
        
        const params = {
          'primary_release_date.gte': startDate,
          'primary_release_date.lte': endDate,
          sort_by: 'popularity.desc',
        };
        
        const results = await discoverContent(params);
        setContent(results);
        
        // Reset context index
        setContextIndex(0);
      } catch (error) {
        console.error('Error fetching decade content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDecadeContent();
  }, [selectedDecade]);
  
  // Cycle through historical context items
  useEffect(() => {
    const contextItems = historicalContext[selectedDecade] || [];
    if (contextItems.length === 0) return;
    
    const interval = setInterval(() => {
      setContextIndex(prev => (prev + 1) % contextItems.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [selectedDecade]);
  
  const currentContext = historicalContext[selectedDecade] || [];
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="bg-indigo-700 text-white p-6">
          <h2 className="text-2xl font-bold mb-1">Time Machine</h2>
          <p className="text-indigo-100">
            Explore the films and shows that shaped different eras, with historical context.
          </p>
        </div>
        
        {/* Decade selection */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-nowrap overflow-x-auto pb-2 gap-2">
            {decades.map(decade => (
              <button
                key={decade.id}
                onClick={() => setSelectedDecade(decade.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors 
                  ${selectedDecade === decade.id 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {decade.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Historical context */}
        <div className="bg-indigo-50 p-6 min-h-28">
          <h3 className="text-sm font-semibold text-indigo-800 uppercase mb-2">
            Historical Context: {selectedDecade}
          </h3>
          
          <div className="relative h-16">
            {currentContext.map((context, index) => (
              <motion.div
                key={`${selectedDecade}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: contextIndex === index ? 1 : 0,
                  y: contextIndex === index ? 0 : 20 
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <p className="text-indigo-900 text-lg">
                  {context}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content grid */}
      <div>
        <h3 className="text-xl font-bold mb-4">Popular from the {selectedDecade}</h3>
        <ContentGrid 
          contents={content}
          isLoading={isLoading}
          emptyMessage={`No content found for the ${selectedDecade}`}
          columns={4}
        />
      </div>
      
      {/* Additional decade context */}
      {!isLoading && content.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">Why this era matters</h3>
          <p className="text-gray-700">
            The {selectedDecade} represented a pivotal moment in film and television history. 
            Technical innovations, cultural shifts, and global events shaped the stories told 
            during this decade, influencing content creators to this day.
          </p>
          
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-indigo-700 mb-2">Cultural Significance</h4>
              <p className="text-sm text-gray-600">
                Content from this era reflects the societal values, fears, and aspirations of the time.
                Watching these works provides insight into how people viewed the world and themselves.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-indigo-700 mb-2">Technical Evolution</h4>
              <p className="text-sm text-gray-600">
                The filmmaking techniques, special effects, and narrative structures of this period
                show the evolution of the medium and provide context for modern entertainment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeMachine; 