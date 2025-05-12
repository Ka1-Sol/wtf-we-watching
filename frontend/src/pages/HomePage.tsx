import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProfileSetup from '../components/features/ProfileSetup';
import ContentCard from '../components/ui/ContentCard';
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
    <div className="pb-16">
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-16 md:py-24">
        <div className="container-custom grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Discover content you'll <span className="text-accent">actually love</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Break out of your content bubble. Find films and shows tailored to your unique taste, not just what everyone else is watching.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/discover" className="btn btn-primary">
                Start Exploring
              </Link>
              <Link to="/mood-compass" className="btn btn-secondary">
                Try Mood Compass
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            className="relative hidden md:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src="/hero-illustration.png" 
              alt="Content discovery illustration" 
              className="max-w-full"
              onError={(e) => {
                // If image fails to load (in case the image doesn't exist yet)
                e.currentTarget.style.display = 'none';
              }}
            />
          </motion.div>
        </div>
      </section>
      
      {/* Profile Setup */}
      {!isProfileComplete && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <ProfileSetup />
          </div>
        </section>
      )}
      
      {/* Featured Content */}
      {isProfileComplete && recommendations.length > 0 && (
        <section className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8">Recommended For You</h2>
            <ContentGrid 
              contents={recommendations.slice(0, 8)}
              isLoading={isLoading && recommendations.length === 0} 
            />
            <div className="mt-6 text-center">
              <Link to="/discover" className="text-secondary hover:text-secondary/70 font-medium">
                View All Recommendations →
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* Trending Content */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8">Trending Now</h2>
          
          {/* Featured trending item */}
          {trendingContent.length > 0 && (
            <div className="mb-8">
              <ContentCard 
                content={trendingContent[0]}
                variant="featured"
                isLoading={isLoading && trendingContent.length === 0}
              />
            </div>
          )}
          
          {/* Trending grid */}
          <ContentGrid 
            contents={trendingContent.slice(1, 7)}
            isLoading={isLoading && trendingContent.length === 0}
          />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Discover In Your Own Way</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Mood Compass"
              description="Find content that matches exactly how you're feeling right now."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              }
              link="/mood-compass"
            />
            
            <FeatureCard 
              title="Time Machine"
              description="Explore the best content from different eras and decades."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              link="/time-machine"
            />
            
            <FeatureCard 
              title="Serendipity Engine"
              description="Be surprised by unexpected content you might love."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              }
              link="/serendipity"
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <FeatureCard 
              title="Director's Cut"
              description="Navigate through a filmmaker's work with personalized viewing order."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              }
              link="/directors-cut"
            />
            
            <FeatureCard 
              title="Decision Timer"
              description="Combat choice paralysis with guided decision support."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              link="/decision-timer"
            />
            
            <FeatureCard 
              title="Personal Library"
              description="Keep track of what you've watched and want to watch."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              }
              link="/library"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to find your next favorite?</h2>
          <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
            Stop scrolling endlessly. Start discovering content that's actually worth your time.
          </p>
          <Link to="/discover" className="btn bg-white text-secondary hover:bg-gray-100">
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
    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
  >
    <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </Link>
);

export default HomePage; 