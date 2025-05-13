import axios from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import fs from 'fs';
import { USER_DATA_PATH } from '../utils/paths.js';

// Environment variables configuration
dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

// Axios configuration for TMDb API calls
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US', // Changed from it-IT to en-US for consistency
  },
});

// Load user preferences
const loadUserPreferences = () => {
  try {
    if (fs.existsSync(USER_DATA_PATH)) {
      const userData = JSON.parse(fs.readFileSync(USER_DATA_PATH, 'utf8'));
      return userData.preferences;
    }
    // Return default preferences if file doesn't exist
    return {
      genres: [],
      creators: [],
      excludedGenres: [],
      moodPreference: {
        serious: 50,
        reflective: 50,
      },
      periodPreference: [],
    };
  } catch (error) {
    console.error('Error loading user preferences:', error);
    // Return default preferences in case of error
    return {
      genres: [],
      creators: [],
      excludedGenres: [],
      moodPreference: {
        serious: 50,
        reflective: 50,
      },
      periodPreference: [],
    };
  }
};

/**
 * @desc    Get recommended content based on user preferences
 * @route   GET /api/content/recommended
 * @access  Public
 */
export const getRecommendedContent = async (req: Request, res: Response) => {
  try {
    const preferences = loadUserPreferences();
    const { page = 1 } = req.query;
    
    // Get genre IDs from preferences
    const genreIds = preferences.genres.map((genre: { id: number }) => genre.id);
    const excludedGenreIds = preferences.excludedGenres.map((genre: { id: number }) => genre.id);
    
    // Parameters for the request
    const params: Record<string, any> = {
      sort_by: 'popularity.desc',
      page,
    };
    
    // Add genres as filter only if there are any
    if (genreIds.length > 0) {
      params.with_genres = genreIds.join(',');
    }
    
    // Add excluded genres only if there are any
    if (excludedGenreIds.length > 0) {
      params.without_genres = excludedGenreIds.join(',');
    }
    
    // Make the request to TMDb API
    const response = await tmdbApi.get('/discover/movie', { params });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching recommended content:', error);
    res.status(500).json({ message: 'Error fetching recommended content' });
  }
};

/**
 * @desc    Get content based on mood
 * @route   GET /api/content/mood
 * @access  Public
 */
export const getMoodBasedContent = async (req: Request, res: Response) => {
  try {
    const { serious = 50, reflective = 50, page = 1 } = req.query;
    
    // Convert parameters to numbers
    const seriousValue = Number(serious);
    const reflectiveValue = Number(reflective);
    
    // Determine genres based on mood
    let genres: number[] = [];
    
    // More serious mood favors dramatic films and thrillers
    if (seriousValue > 70) {
      genres = genres.concat([18, 53, 9648]); // Drama, Thriller, Mystery
    } 
    // Less serious mood favors comedies and adventures
    else if (seriousValue < 30) {
      genres = genres.concat([35, 12, 10751]); // Comedy, Adventure, Family
    }
    
    // More reflective mood favors documentaries and dramas
    if (reflectiveValue > 70) {
      genres = genres.concat([99, 18, 36]); // Documentary, Drama, History
    } 
    // Less reflective mood favors action and science fiction
    else if (reflectiveValue < 30) {
      genres = genres.concat([28, 878, 27]); // Action, Science Fiction, Horror
    }
    
    // Remove duplicates
    const uniqueGenres = Array.from(new Set(genres));
    
    // Parameters for the request
    const params: Record<string, any> = {
      sort_by: seriousValue > 50 ? 'vote_average.desc' : 'popularity.desc',
      page,
    };
    
    // Add genres as filter only if there are any
    if (uniqueGenres.length > 0) {
      params.with_genres = uniqueGenres.join(',');
    }
    
    // Make the request to TMDb API
    const response = await tmdbApi.get('/discover/movie', { params });
    
    // Add mood values to each result
    const resultsWithMood = response.data.results.map((item: any) => ({
      ...item,
      mood: {
        serious: Math.floor(Math.random() * 100), // In a real app, this would be calculated
        reflective: Math.floor(Math.random() * 100), // In a real app, this would be calculated
      },
    }));
    
    res.json({
      ...response.data,
      results: resultsWithMood,
    });
  } catch (error) {
    console.error('Error fetching mood-based content:', error);
    res.status(500).json({ message: 'Error fetching mood-based content' });
  }
};

/**
 * @desc    Get content based on time period
 * @route   GET /api/content/time
 * @access  Public
 */
export const getTimeBasedContent = async (req: Request, res: Response) => {
  try {
    const { decade = '2020', page = 1 } = req.query;
    
    // Convert decade to date range
    const startYear = Number(decade);
    const endYear = startYear + 9;
    
    // Parameters for the request
    const params: Record<string, any> = {
      sort_by: 'popularity.desc',
      page,
      'primary_release_date.gte': `${startYear}-01-01`,
      'primary_release_date.lte': `${endYear}-12-31`,
    };
    
    // Make the request to TMDb API
    const response = await tmdbApi.get('/discover/movie', { params });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching time-based content:', error);
    res.status(500).json({ message: 'Error fetching time-based content' });
  }
};

/**
 * @desc    Get content from a specific director
 * @route   GET /api/content/director/:id
 * @access  Public
 */
export const getDirectorContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1 } = req.query;
    
    // Get information about the director
    const personResponse = await tmdbApi.get(`/person/${id}`);
    
    // Get films directed by the person
    const creditsResponse = await tmdbApi.get(`/discover/movie`, {
      params: {
        with_people: id,
        sort_by: 'primary_release_date.desc',
        page,
      },
    });
    
    res.json({
      director: personResponse.data,
      movies: creditsResponse.data,
    });
  } catch (error) {
    console.error(`Error fetching films from director ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching director films' });
  }
};

/**
 * @desc    Get a random recommendation
 * @route   GET /api/content/random
 * @access  Public
 */
export const getRandomRecommendation = async (req: Request, res: Response) => {
  try {
    // Get a random movie through popularity search
    const randomPage = Math.floor(Math.random() * 100) + 1; // Random page between 1 and 100
    
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        sort_by: 'popularity.desc',
        page: randomPage,
      },
    });
    
    // Choose a random result from the page
    const results = response.data.results;
    const randomIndex = Math.floor(Math.random() * results.length);
    const randomMovie = results[randomIndex];
    
    // Get detailed movie information
    const detailedResponse = await tmdbApi.get(`/movie/${randomMovie.id}`, {
      params: {
        append_to_response: 'credits,similar,videos',
      },
    });
    
    res.json(detailedResponse.data);
  } catch (error) {
    console.error('Error fetching random recommendation:', error);
    res.status(500).json({ message: 'Error fetching random recommendation' });
  }
}; 