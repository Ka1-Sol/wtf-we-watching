import axios from 'axios';
import type { Content } from '../store/slices/contentSlice';

// Note: In a real application, this API key would be stored securely in environment variables
// For this project, we're hardcoding it for simplicity
const API_KEY = '2dca580c2a14b55200e784d157207b4d';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

// Convert TMDb movie object to our Content interface
const convertMovieToContent = (movie: any): Content => ({
  id: movie.id,
  title: movie.title || movie.name,
  type: movie.media_type || (movie.first_air_date ? 'tv' : 'movie'),
  posterPath: movie.poster_path,
  backdropPath: movie.backdrop_path,
  overview: movie.overview,
  releaseDate: movie.release_date || movie.first_air_date,
  voteAverage: movie.vote_average,
  genres: movie.genres,
  runtime: movie.runtime,
  episodeCount: movie.number_of_episodes,
  seasonCount: movie.number_of_seasons,
  creators: movie.credits?.crew?.filter((person: any) => 
    person.job === 'Director' || person.job === 'Creator' || person.job === 'Executive Producer'
  ).slice(0, 3),
  // This would be calculated based on content analysis in a real app
  mood: {
    serious: Math.floor(Math.random() * 100),
    reflective: Math.floor(Math.random() * 100),
  },
});

export const getImageUrl = (path: string | undefined, size: string = 'w500'): string => {
  if (!path) return '';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getTrendingContent = async (timeWindow: 'day' | 'week' = 'week'): Promise<Content[]> => {
  try {
    const response = await api.get(`/trending/all/${timeWindow}`);
    return response.data.results.map(convertMovieToContent);
  } catch (error) {
    console.error('Error fetching trending content:', error);
    return [];
  }
};

export const getContentDetails = async (id: number, type: 'movie' | 'tv'): Promise<Content | null> => {
  try {
    const response = await api.get(`/${type}/${id}`, {
      params: {
        append_to_response: 'credits,recommendations,similar',
      },
    });
    return convertMovieToContent(response.data);
  } catch (error) {
    console.error(`Error fetching ${type} details:`, error);
    return null;
  }
};

export const discoverContent = async (params: Record<string, any> = {}): Promise<Content[]> => {
  try {
    // By default, discover movies
    const endpoint = params.media_type === 'tv' ? '/discover/tv' : '/discover/movie';
    const response = await api.get(endpoint, { params });
    
    // Check for empty results
    if (!response.data.results || response.data.results.length === 0) {
      console.log('No results found for discover query with params:', params);
      return [];
    }
    
    return response.data.results.map(convertMovieToContent);
  } catch (error: any) {
    console.error('Error discovering content:', error);
    // Log more details about the error
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
    
    return [];
  }
};

export const searchContent = async (query: string): Promise<Content[]> => {
  try {
    const response = await api.get('/search/multi', {
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
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
};

export const getRecommendedContent = async (
  genres: number[] = [],
  excludeIds: number[] = []
): Promise<Content[]> => {
  try {
    // In a real app, this would use user preferences to make a more targeted API call
    // For now, we'll just get popular content with optional genre filtering
    const response = await api.get('/discover/movie', {
      params: {
        sort_by: 'popularity.desc',
        with_genres: genres.join(','),
        page: 1,
      },
    });
    
    return response.data.results
      .filter((movie: any) => !excludeIds.includes(movie.id))
      .map(convertMovieToContent);
  } catch (error) {
    console.error('Error fetching recommended content:', error);
    return [];
  }
};

export default api; 