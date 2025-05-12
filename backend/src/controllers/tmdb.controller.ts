import axios from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

// Configurazione delle variabili d'ambiente
dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

// Configurazione di Axios per le chiamate all'API TMDb
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'it-IT',
  },
});

/**
 * @desc    Ottiene i contenuti di tendenza
 * @route   GET /api/tmdb/trending
 * @access  Public
 */
export const getTrending = async (req: Request, res: Response) => {
  try {
    const { timeWindow = 'week', page = 1, mediaType = 'all' } = req.query;
    
    const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`, {
      params: { page },
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Errore nel recupero dei contenuti di tendenza:', error);
    res.status(500).json({ message: 'Errore nel recupero dei contenuti di tendenza' });
  }
};

/**
 * @desc    Ottiene i dettagli di un film
 * @route   GET /api/tmdb/movie/:id
 * @access  Public
 */
export const getMovieDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const response = await tmdbApi.get(`/movie/${id}`, {
      params: {
        append_to_response: 'credits,recommendations,similar',
      },
    });
    
    res.json(response.data);
  } catch (error) {
    console.error(`Errore nel recupero dei dettagli del film ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Errore nel recupero dei dettagli del film' });
  }
};

/**
 * @desc    Ottiene i dettagli di una serie TV
 * @route   GET /api/tmdb/tv/:id
 * @access  Public
 */
export const getTvDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const response = await tmdbApi.get(`/tv/${id}`, {
      params: {
        append_to_response: 'credits,recommendations,similar',
      },
    });
    
    res.json(response.data);
  } catch (error) {
    console.error(`Errore nel recupero dei dettagli della serie TV ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Errore nel recupero dei dettagli della serie TV' });
  }
};

/**
 * @desc    Cerca film e serie TV
 * @route   GET /api/tmdb/search
 * @access  Public
 */
export const searchContent = async (req: Request, res: Response) => {
  try {
    const { query, page = 1, includeAdult = false } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Il parametro query è obbligatorio' });
    }
    
    const response = await tmdbApi.get('/search/multi', {
      params: {
        query,
        page,
        include_adult: includeAdult,
      },
    });
    
    // Filtra i risultati per includere solo film e serie TV (esclude persone)
    const filteredResults = response.data.results.filter(
      (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
    );
    
    res.json({
      ...response.data,
      results: filteredResults,
    });
  } catch (error) {
    console.error('Errore nella ricerca dei contenuti:', error);
    res.status(500).json({ message: 'Errore nella ricerca dei contenuti' });
  }
};

/**
 * @desc    Scopre contenuti in base a vari parametri
 * @route   GET /api/tmdb/discover
 * @access  Public
 */
export const discoverContent = async (req: Request, res: Response) => {
  try {
    const {
      mediaType = 'movie',
      sortBy = 'popularity.desc',
      withGenres,
      page = 1,
      releaseYear,
      voteAverage,
    } = req.query;
    
    // Costruisci i parametri per la richiesta
    const params: Record<string, any> = {
      sort_by: sortBy,
      page,
    };
    
    // Aggiungi parametri opzionali solo se definiti
    if (withGenres) params.with_genres = withGenres;
    if (voteAverage) params.vote_average_gte = voteAverage;
    
    // Parametri specifici per film o serie TV
    if (mediaType === 'movie' && releaseYear) {
      params.primary_release_year = releaseYear;
    } else if (mediaType === 'tv' && releaseYear) {
      params.first_air_date_year = releaseYear;
    }
    
    const endpoint = mediaType === 'tv' ? '/discover/tv' : '/discover/movie';
    const response = await tmdbApi.get(endpoint, { params });
    
    res.json(response.data);
  } catch (error) {
    console.error('Errore nella scoperta dei contenuti:', error);
    res.status(500).json({ message: 'Errore nella scoperta dei contenuti' });
  }
}; 