import { useEffect, useState } from 'react';
import type { Content } from '../../store/slices/contentSlice';
import ContentCard from '../ui/ContentCard';

interface Point {
  x: number;
  y: number;
}

interface MoodCompassProps {
  contents: Content[];
  onMoodChange?: (serious: number, reflective: number) => void;
  isLoading?: boolean;
}

const MoodCompass = ({ 
  contents = [], // Provide a default empty array 
  onMoodChange,
  isLoading = false 
}: MoodCompassProps) => {
  const [pointer, setPointer] = useState<Point>({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [compassRef, setCompassRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (onMoodChange) {
      // Convert x to 'serious' value (0-100) and y to 'reflective' value (0-100)
      // Note: Y-axis is inverted in the DOM, so we need to invert the value
      onMoodChange(pointer.x, 100 - pointer.y);
    }
  }, [pointer, onMoodChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updatePointerPosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updatePointerPosition(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updatePointerPositionFromTouch(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      updatePointerPositionFromTouch(e);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const updatePointerPosition = (e: React.MouseEvent) => {
    if (!compassRef) return;
    
    const rect = compassRef.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    
    setPointer({ x, y });
  };

  const updatePointerPositionFromTouch = (e: React.TouchEvent) => {
    if (!compassRef || !e.touches[0]) return;
    
    const rect = compassRef.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    
    setPointer({ x, y });
  };

  // Position content cards based on their mood values
  const positionContent = (content: Content): { left: string, top: string } => {
    // Default position if content has no mood
    if (!content.mood) {
      return { left: '50%', top: '50%' };
    }
    
    const { serious, reflective } = content.mood;
    
    // Convert mood values to percentages for positioning
    return {
      left: `${serious}%`,
      top: `${100 - reflective}%`, // Invert y-axis for DOM
    };
  };

  // Filter contents to display based on proximity to the current pointer
  const getVisibleContents = () => {
    // During loading or if content array is not valid, return empty array
    if (isLoading || !Array.isArray(contents)) return [];
    
    // Sort by proximity to the current pointer
    return [...contents]
      .filter(content => content?.mood) // Only consider content with mood data
      .sort((a, b) => {
        if (!a.mood || !b.mood) return 0;
        const aDist = getDistance(a.mood, pointer);
        const bDist = getDistance(b.mood, pointer);
        return aDist - bDist;
      })
      .slice(0, 5); // Take the closest 5 items
  };

  // Calculate distance between mood and pointer
  const getDistance = (mood: { serious: number, reflective: number } | undefined, point: Point): number => {
    if (!mood) return 100; // Return max distance if no mood is defined
    const dx = mood.serious - point.x;
    const dy = (100 - mood.reflective) - point.y; // Invert y for DOM
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Check for valid contents array before calling getVisibleContents
  const visibleContents = Array.isArray(contents) ? getVisibleContents() : [];

  return (
    <div className="relative w-full aspect-square max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div
        ref={setCompassRef}
        className="absolute inset-0 bg-gradient-to-br from-blue-100 to-yellow-100"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Axes and labels */}
        <div className="absolute left-0 top-0 w-full h-full">
          {/* Horizontal axis */}
          <div className="absolute left-0 top-1/2 w-full h-[1px] bg-gray-300"></div>
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">Light</span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">Serious</span>
          
          {/* Vertical axis */}
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-gray-300"></div>
          <span className="absolute left-1/2 top-2 -translate-x-1/2 text-xs text-gray-500">Action</span>
          <span className="absolute left-1/2 bottom-2 -translate-x-1/2 text-xs text-gray-500">Reflective</span>
        </div>
        
        {/* Pointer */}
        <div 
          className="absolute w-6 h-6 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md z-20 cursor-move"
          style={{ left: `${pointer.x}%`, top: `${pointer.y}%` }}
        >
          <div className="absolute inset-1 bg-white rounded-full"></div>
        </div>
        
        {/* Content cards */}
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : (
          <>
            {visibleContents.map((content, index) => {
              const position = positionContent(content);
              const distance = content.mood ? getDistance(content.mood, pointer) : 100;
              const opacity = Math.max(0.2, 1 - distance / 100);
              const scale = Math.max(0.5, 1 - distance / 200);
              
              return (
                <div
                  key={content.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-500"
                  style={{
                    left: position.left,
                    top: position.top,
                    opacity,
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    zIndex: Math.floor(opacity * 10),
                  }}
                >
                  <div className="w-20 h-30 md:w-28 md:h-40">
                    <ContentCard content={content} variant="compact" />
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
      
      {/* Current mood description */}
      <div className="absolute bottom-0 left-0 w-full bg-white p-4 shadow-md">
        <h3 className="font-bold text-lg">Current Mood</h3>
        <p className="text-sm text-gray-600">
          {getMoodDescription(pointer.x, pointer.y)}
        </p>
      </div>
    </div>
  );
};

const getMoodDescription = (x: number, y: number): string => {
  // Split the compass into quadrants
  if (x < 40 && y < 40) {
    return "Light-hearted action adventures and comedies";
  } else if (x >= 60 && y < 40) {
    return "Intense thrillers and action-packed blockbusters";
  } else if (x < 40 && y >= 60) {
    return "Thoughtful comedies and feel-good dramas";
  } else if (x >= 60 && y >= 60) {
    return "Deep, emotional dramas and thought-provoking content";
  } else {
    return "Balanced mix of entertainment and substance";
  }
};

export default MoodCompass; 