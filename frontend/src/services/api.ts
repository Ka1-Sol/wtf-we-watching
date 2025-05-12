import axios from 'axios';
import type { Content } from '../store/slices/contentSlice';

// Create two separate API configurations
const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: '2dca580c2a14b55200e784d157207b4d',
    language: 'en-US',
  },
  timeout: 10000, // Add timeout to prevent hanging requests
});

const backendApi = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
});

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Convert TMDb movie object to our Content interface
const convertMovieToContent = (movie: any): Content => {
  if (!movie || typeof movie !== 'object') {
    console.error('Invalid movie object:', movie);
    return {
      id: 0,
      title: 'Unknown Title',
      type: 'movie',
    };
  }

  return {
    id: movie.id || 0,
    title: movie.title || movie.name || 'Unknown Title',
    type: movie.media_type || (movie.first_air_date ? 'tv' : 'movie'),
    posterPath: movie.poster_path || '',
    backdropPath: movie.backdrop_path || '',
    overview: movie.overview || '',
    releaseDate: movie.release_date || movie.first_air_date || '',
    voteAverage: movie.vote_average || 0,
    genres: movie.genres || [],
    runtime: movie.runtime || 0,
    episodeCount: movie.number_of_episodes,
    seasonCount: movie.number_of_seasons,
    creators: movie.credits?.crew?.filter((person: any) => 
      person.job === 'Director' || person.job === 'Creator' || person.job === 'Executive Producer'
    ).slice(0, 3) || [],
    // This would be calculated based on content analysis in a real app
    mood: {
      serious: Math.floor(Math.random() * 100),
      reflective: Math.floor(Math.random() * 100),
    },
  };
};

export const getImageUrl = (path: string | undefined, size: string = 'w500'): string => {
  if (!path) return '';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Add error handling wrapper
const safeApiCall = async <T>(apiCall: () => Promise<T>, defaultValue: T): Promise<T> => {
  try {
    return await apiCall();
  } catch (error: any) {
    console.error('API call failed:', error.message);
    return defaultValue;
  }
};

export const getTrendingContent = async (timeWindow: 'day' | 'week' = 'week'): Promise<Content[]> => {
  return safeApiCall(async () => {
    const response = await tmdbApi.get(`/trending/all/${timeWindow}`);
    return response.data.results.map(convertMovieToContent);
  }, []);
};

export const getContentDetails = async (id: number, type: 'movie' | 'tv'): Promise<Content | null> => {
  return safeApiCall(async () => {
    const response = await tmdbApi.get(`/${type}/${id}`, {
      params: {
        append_to_response: 'credits,recommendations,similar',
      },
    });
    return convertMovieToContent(response.data);
  }, null);
};

export const discoverContent = async (params: Record<string, any> = {}): Promise<Content[]> => {
  return safeApiCall(async () => {
    // By default, discover movies
    const endpoint = params.media_type === 'tv' ? '/discover/tv' : '/discover/movie';
    const response = await tmdbApi.get(endpoint, { params });
    
    // Check for empty results
    if (!response.data.results || response.data.results.length === 0) {
      console.log('No results found for discover query with params:', params);
      return [];
    }
    
    return response.data.results.map(convertMovieToContent);
  }, []);
};

export const searchContent = async (query: string): Promise<Content[]> => {
  return safeApiCall(async () => {
    const response = await tmdbApi.get('/search/multi', {
      params: {
        query,
        page: 1,
        include_adult: false,
      },
    });
    // Filter out people and only return movies and TV shows
    return response.data.results
      .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
      .map(convertMovieToContent);
  }, []);
};

export const getRecommendedContent = async (
  genres: number[] = [],
  excludeIds: number[] = []
): Promise<Content[]> => {
  return safeApiCall(async () => {
    // In a real app, this would use user preferences to make a more targeted API call
    // For now, we'll just get popular content with optional genre filtering
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        sort_by: 'popularity.desc',
        with_genres: genres.join(','),
        page: 1,
      },
    });
    
    return response.data.results
      .filter((movie: any) => !excludeIds.includes(movie.id))
      .map(convertMovieToContent);
  }, []);
};

export default tmdbApi; 