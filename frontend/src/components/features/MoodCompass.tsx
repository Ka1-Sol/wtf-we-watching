import { useEffect, useRef, useState } from 'react';
import type { Content } from '../../store/slices/contentSlice';

interface Point {
  x: number;
  y: number;
}

interface MoodCompassProps {
  contents?: Content[];
  onMoodChange?: (serious: number, reflective: number) => void;
  isLoading?: boolean;
}

interface CompassPoint {
  name: string;
  description: string;
  position: { angle: number, distance: number };
  color: string;
  mood: string;
  genres?: string[];
}

// Definiamo 8 punti cardinali della bussola come stati d'animo, non generi
const compassPoints: CompassPoint[] = [
  {
    name: "Cheerful",
    description: "In the mood for fun and lightheartedness",
    position: { angle: 0, distance: 0.8 }, // Nord
    color: "bg-yellow-400",
    mood: "Happy and carefree",
    genres: ["comedy", "family", "animation"]
  },
  {
    name: "Energetic",
    description: "Craving adrenaline and excitement",
    position: { angle: 45, distance: 0.8 }, // Nord-Est
    color: "bg-red-500",
    mood: "Charged and adventurous",
    genres: ["action", "adventure", "thriller"]
  },
  {
    name: "Reflective",
    description: "Seeking emotional and profound stories",
    position: { angle: 90, distance: 0.8 }, // Est
    color: "bg-blue-500",
    mood: "Contemplative",
    genres: ["drama", "romance"]
  },
  {
    name: "Curious",
    description: "Eager to discover and investigate",
    position: { angle: 135, distance: 0.8 }, // Sud-Est
    color: "bg-indigo-600",
    mood: "Intrigued",
    genres: ["mystery", "crime", "thriller"]
  },
  {
    name: "Intellectual",
    description: "Wanting to learn and explore deeper",
    position: { angle: 180, distance: 0.8 }, // Sud
    color: "bg-green-500",
    mood: "Analytical",
    genres: ["documentary", "history", "biography"]
  },
  {
    name: "Dreamy",
    description: "Seeking escape into fantastic worlds",
    position: { angle: 225, distance: 0.8 }, // Sud-Ovest
    color: "bg-purple-500",
    mood: "Imaginative",
    genres: ["fantasy", "sci-fi", "animation"]
  },
  {
    name: "Thoughtful",
    description: "Looking for tension and strong emotions",
    position: { angle: 270, distance: 0.8 }, // Ovest
    color: "bg-gray-700",
    mood: "Introspective and intense",
    genres: ["horror", "thriller", "psychological"]
  },
  {
    name: "Nostalgic",
    description: "In need of comfort and familiarity",
    position: { angle: 315, distance: 0.8 }, // Nord-Ovest
    color: "bg-orange-400",
    mood: "Sentimental",
    genres: ["animation", "family", "musical"]
  }
];

// Funzione per convertire coordinate polari (angolo, distanza) in coordinate cartesiane (x, y)
const polarToCartesian = (angle: number, distance: number): { x: number, y: number } => {
  // Converte angolo da gradi a radianti
  const angleRad = (angle - 90) * Math.PI / 180;
  
  // Calcola x e y, dove x e y sono percentuali (0-100)
  const x = 50 + (distance * 50 * Math.cos(angleRad));
  const y = 50 + (distance * 50 * Math.sin(angleRad));
  
  return { x, y };
};

// Funzione per convertire coordinate cartesiane (x, y) in coordinate polari (angolo, distanza)
const cartesianToPolar = (x: number, y: number): { angle: number, distance: number } => {
  // Normalizza x e y dove il centro è (50, 50)
  const dx = x - 50;
  const dy = y - 50;
  
  // Calcola distanza dal centro (normalizzata su 0-1 dove 1 è il raggio massimo)
  const distance = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 50);
  
  // Calcola angolo in gradi (0 è Nord, orario)
  let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
  if (angle < 0) angle += 360;
  
  return { angle, distance };
};

const MoodCompass = ({ 
  onMoodChange,
  isLoading = false 
}: MoodCompassProps) => {
  const [pointer, setPointer] = useState<Point>({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [activePoint, setActivePoint] = useState<CompassPoint | null>(null);
  const compassRef = useRef<HTMLDivElement>(null);

  // Calculate the active compass point based on pointer position
  useEffect(() => {
    const { angle } = cartesianToPolar(pointer.x, pointer.y);
    
    // Find the closest compass point based on angle
    // Normalize angles for comparison
    const points = compassPoints.map(point => ({
      ...point,
      normalizedAngle: ((point.position.angle % 360) + 360) % 360
    }));
    
    const normalizedUserAngle = ((angle % 360) + 360) % 360;
    
    // Find closest point by angle
    let closestPoint = points[0];
    let minAngleDiff = 360;
    
    points.forEach(point => {
      // Calculate the smallest angle between the two angles
      let angleDiff = Math.abs(point.normalizedAngle - normalizedUserAngle);
      if (angleDiff > 180) angleDiff = 360 - angleDiff;
      
      if (angleDiff < minAngleDiff) {
        minAngleDiff = angleDiff;
        closestPoint = point;
      }
    });
    
    // Find the original compass point from the matched normalized point
    const matchedOriginalPoint = compassPoints.find(p => 
      p.position.angle === closestPoint.position.angle
    );
    
    if (matchedOriginalPoint) {
      setActivePoint(matchedOriginalPoint);
    }
  }, [pointer]);

  // Debounced mood change to prevent too many API calls
  useEffect(() => {
    if (!onMoodChange) return;
    
    // Convert the pointer position to values for serious and reflective
    // Here we set:
    // - serious: increases going from left to right (0-100)
    // - reflective: increases going from top to bottom (0-100)
    const timer = setTimeout(() => {
      onMoodChange(pointer.x, 100 - pointer.y);
    }, 500); // Wait 500ms after last change before triggering API call
    
    return () => clearTimeout(timer);
  }, [pointer, onMoodChange]);

  const updatePointerPosition = (clientX: number, clientY: number) => {
    if (!compassRef.current) return;
    
    const rect = compassRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calcola la distanza dal centro come percentuale del raggio
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const radius = Math.min(rect.width, rect.height) / 2;
    
    // Limite la distanza massima al raggio del cerchio
    const distance = Math.min(radius, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);
    
    // Converti in coordinate x,y percentuali (0-100)
    const x = 50 + (50 * distance / radius) * Math.cos(angle);
    const y = 50 + (50 * distance / radius) * Math.sin(angle);
    
    setPointer({ 
      x: Math.max(0, Math.min(100, x)), 
      y: Math.max(0, Math.min(100, y)) 
    });
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePointerPosition(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    updatePointerPosition(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e.touches[0]) return;
    setIsDragging(true);
    updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    e.preventDefault(); // Prevent scrolling while dragging
    updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Get description based on pointer position
  const getMoodDescription = (): string => {
    const { angle, distance } = cartesianToPolar(pointer.x, pointer.y);
    
    // Determine intensity based on distance from center
    let intensity = "";
    if (distance < 0.3) {
      intensity = "Mild";
    } else if (distance < 0.7) {
      intensity = "Moderate";
    } else {
      intensity = "Intense";
    }
    
    // Find the nearest compass point for mood
    const normalizedAngle = ((angle % 360) + 360) % 360;
    let nearestMood = "";
    
    if (normalizedAngle >= 337.5 || normalizedAngle < 22.5) {
      nearestMood = "Cheerful";
    } else if (normalizedAngle >= 22.5 && normalizedAngle < 67.5) {
      nearestMood = "Energetic";
    } else if (normalizedAngle >= 67.5 && normalizedAngle < 112.5) {
      nearestMood = "Reflective";
    } else if (normalizedAngle >= 112.5 && normalizedAngle < 157.5) {
      nearestMood = "Curious";
    } else if (normalizedAngle >= 157.5 && normalizedAngle < 202.5) {
      nearestMood = "Intellectual";
    } else if (normalizedAngle >= 202.5 && normalizedAngle < 247.5) {
      nearestMood = "Dreamy";
    } else if (normalizedAngle >= 247.5 && normalizedAngle < 292.5) {
      nearestMood = "Thoughtful";
    } else if (normalizedAngle >= 292.5 && normalizedAngle < 337.5) {
      nearestMood = "Nostalgic";
    }
    
    if (distance < 0.2) {
      return "Neutral mood, open to various types of content";
    }
    
    return `${intensity} ${nearestMood.toLowerCase()} mood`;
  };

  return (
    <>
      <div className="relative w-full aspect-square max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-16">
        <div
          ref={compassRef}
          className="absolute inset-0 rounded-full m-4 bg-gradient-to-b from-indigo-100 to-indigo-200 cursor-pointer"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Compass outer design */}
          <div className="absolute inset-4 rounded-full border-4 border-indigo-400/30 bg-gradient-radial from-blue-50 to-indigo-100 shadow-inner overflow-hidden">
            {/* Circular grid lines */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[25%] h-[25%] rounded-full border border-indigo-400/20"></div>
              <div className="w-[50%] h-[50%] rounded-full border border-indigo-400/30"></div>
              <div className="w-[75%] h-[75%] rounded-full border border-indigo-400/40"></div>
            </div>
            
            {/* Directional lines */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/2 bottom-0 w-[1px] -translate-x-1/2 bg-indigo-400/30"></div>
              <div className="absolute left-0 top-1/2 right-0 h-[1px] -translate-y-1/2 bg-indigo-400/30"></div>
              <div className="absolute top-0 left-0 bottom-0 right-0 m-auto w-[1px] h-full bg-indigo-400/20 rotate-45 origin-center"></div>
              <div className="absolute top-0 left-0 bottom-0 right-0 m-auto w-[1px] h-full bg-indigo-400/20 -rotate-45 origin-center"></div>
            </div>
            
            {/* Compass rose center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[15%] h-[15%] rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-lg"></div>
            </div>
            
            {/* Compass points */}
            {compassPoints.map((point, index) => {
              // Convert polar coordinates to cartesian
              const { x, y } = polarToCartesian(point.position.angle, point.position.distance);
              
              // Calculate if this point is active
              const isActive = activePoint?.name === point.name;
              
              return (
                <div 
                  key={index}
                  className={`absolute p-0.5 rounded-full ${point.color} transition-all duration-300 text-white 
                    font-medium text-xs shadow-md cursor-pointer z-10
                    ${isActive ? 'opacity-100 scale-125' : 'opacity-60'}`}
                  style={{ 
                    left: `${x}%`, 
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '64px',
                    height: '64px',
                  }}
                >
                  <div className="h-full w-full rounded-full bg-opacity-80 flex items-center justify-center bg-gradient-to-br from-black/20 to-black/40">
                    {point.name}
                  </div>
                </div>
              );
            })}
            
            {/* Current position marker */}
            <div 
              className={`absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 z-30 cursor-grab transition-transform duration-100 ${isDragging ? 'scale-110 cursor-grabbing' : ''}`}
              style={{ left: `${pointer.x}%`, top: `${pointer.y}%` }}
            >
              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-red-200 to-red-300"></div>
              </div>
            </div>
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-indigo-100/80 z-50 rounded-full backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-indigo-600 border-r-indigo-600 border-b-transparent border-l-transparent"></div>
                  <p className="text-indigo-700 font-medium">Finding your mood...</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mood description box - now positioned below the compass instead of overlapping */}
      </div>
      
      {/* Current mood description - moved completely outside the compass component */}
      <div className="mt-4 bg-white p-4 text-gray-800 border border-indigo-200 rounded-lg max-w-3xl mx-auto shadow-sm">
        <div className="flex items-center gap-3">
          {activePoint && (
            <div className={`w-4 h-4 rounded-full ${activePoint.color}`}></div>
          )}
          <div>
            <h3 className="font-bold text-lg text-indigo-700">{activePoint?.name || "Your mood"}</h3>
            <p className="text-sm text-gray-600">
              {activePoint?.description || getMoodDescription()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoodCompass; 