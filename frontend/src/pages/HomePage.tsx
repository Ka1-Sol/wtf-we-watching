import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProfileSetup from '../components/features/ProfileSetup';
import ContentGrid from '../components/ui/ContentGrid';
import { getRecommendedContent, getTrendingContent } from '../services/api';
import type { RootState } from '../store';
import { setRecommendations, setTrendingContent } from '../store/slices/contentSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const { isProfileComplete } = useSelector((state: RootState) => state.user) as import('../store/slices/userSlice').UserState;
  const { recommendations, trendingContent } = useSelector((state: RootState) => state.content) as import('../store/slices/contentSlice').ContentState;
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch trending and recommended content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        
        // Get trending content
        if (trendingContent.length === 0) {
          const trending = await getTrendingContent();
          dispatch(setTrendingContent(trending));
        }
        
        // Get recommended content only if profile is complete
        if (isProfileComplete && recommendations.length === 0) {
          const recommended = await getRecommendedContent();
          dispatch(setRecommendations(recommended));
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, [dispatch, isProfileComplete, recommendations.length, trendingContent.length]);
  
  return (
    <div>
      {/* Hero Section - Simplified */}
      <section className="relative bg-primary text-white py-12 md:py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Discover content you'll <span className="text-accent">actually love</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Find films and shows tailored to your taste, not just what everyone else is watching.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/discover" className="btn btn-primary text-xl px-8 py-4">
                Start Exploring
              </Link>
              <Link to="/mood-compass" className="btn btn-secondary text-xl px-8 py-4">
                Try Mood Compass
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Profile Setup */}
      {!isProfileComplete && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <ProfileSetup />
          </div>
        </section>
      )}
      
      {/* Main Features */}
      <section className="py-12 md:py-20">
        <div className="container-custom">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Discover Your Way</h2>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <FeatureCard 
              title="Mood Compass"
              description="Find content that matches exactly how you're feeling right now."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              }
              link="/mood-compass"
            />
            
            <FeatureCard 
              title="Time Machine"
              description="Explore the best content from different eras and decades."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              link="/time-machine"
            />
            
            <FeatureCard 
              title="Director's Cut"
              description="Navigate through a filmmaker's work with personalized viewing order."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              }
              link="/directors-cut"
            />
          </div>
        </div>
      </section>
      
      {/* Trending Content */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center">Trending Now</h2>
          
          {/* Trending grid */}
          {trendingContent.length > 0 && (
            <ContentGrid 
              contents={trendingContent.slice(0, 12)}
              isLoading={isLoading && trendingContent.length === 0}
            />
          )}
          
          <div className="mt-10 text-center">
            <Link to="/discover" className="btn btn-primary text-xl px-8 py-4">
              View More
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Content - Only show if profile is complete */}
      {isProfileComplete && recommendations.length > 0 && (
        <section className="py-12 md:py-20">
          <div className="container-custom">
            <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center">Recommended For You</h2>
            <ContentGrid 
              contents={recommendations.slice(0, 12)}
              isLoading={isLoading && recommendations.length === 0} 
            />
            <div className="mt-10 text-center">
              <Link to="/discover" className="btn btn-primary text-xl px-8 py-4">
                View All Recommendations
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section - Simplified */}
      <section className="py-12 md:py-20 bg-secondary text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to find your next favorite?</h2>
          <Link to="/discover" className="btn bg-white text-secondary hover:bg-gray-100 text-xl px-8 py-4">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const FeatureCard = ({ title, description, icon, link }: FeatureCardProps) => (
  <Link 
    to={link}
    className="bg-white p-8 md:p-10 rounded-xl shadow-md hover:shadow-lg transition-shadow group"
  >
    <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-2xl md:text-3xl font-bold mb-4">{title}</h3>
    <p className="text-lg md:text-xl text-gray-600">{description}</p>
  </Link>
);

export default HomePage; 