import type { Content } from '../../store/slices/contentSlice';
import ContentCard from './ContentCard';

interface ContentGridProps {
  contents: Content[];
  title?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  columns?: number;
  variant?: 'default' | 'featured' | 'compact';
}

const ContentGrid = ({
  contents,
  title,
  isLoading = false,
  emptyMessage = 'No content found',
  columns = 4,
  variant = 'default',
}: ContentGridProps) => {
  // Generate skeleton cards for loading state
  const skeletonCards = Array(8).fill(0).map((_, index) => (
    <ContentCard key={`skeleton-${index}`} content={{
      id: index,
      title: '',
      type: 'movie',
    }} isLoading={true} variant={variant} />
  ));

  const getGridClass = (): string => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3';
      case 5:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
      case 6:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
      default:
        return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
      )}
      
      {contents.length === 0 && !isLoading ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className={`grid ${getGridClass()} gap-4 md:gap-6`}>
          {isLoading 
            ? skeletonCards 
            : contents.map(content => (
                <ContentCard key={content.id} content={content} variant={variant} />
              ))
          }
        </div>
      )}
    </div>
  );
};

export default ContentGrid; 