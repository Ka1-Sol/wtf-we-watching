import axios from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import fs from 'fs';
import { USER_DATA_PATH } from '../utils/paths.js';

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

// Carica le preferenze dell'utente
const loadUserPreferences = () => {
  try {
    if (fs.existsSync(USER_DATA_PATH)) {
      const userData = JSON.parse(fs.readFileSync(USER_DATA_PATH, 'utf8'));
      return userData.preferences;
    }
    // Restituisci preferenze di default se il file non esiste
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
    console.error('Errore nel caricamento delle preferenze utente:', error);
    // Restituisci preferenze di default in caso di errore
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
 * @desc    Ottiene contenuti raccomandati in base alle preferenze dell'utente
 * @route   GET /api/content/recommended
 * @access  Public
 */
export const getRecommendedContent = async (req: Request, res: Response) => {
  try {
    const preferences = loadUserPreferences();
    const { page = 1 } = req.query;
    
    // Ottiene gli ID genere dalle preferenze
    const genreIds = preferences.genres.map((genre: { id: number }) => genre.id);
    const excludedGenreIds = preferences.excludedGenres.map((genre: { id: number }) => genre.id);
    
    // Parametri per la richiesta
    const params: Record<string, any> = {
      sort_by: 'popularity.desc',
      page,
    };
    
    // Aggiungi i generi come filtro solo se ci sono
    if (genreIds.length > 0) {
      params.with_genres = genreIds.join(',');
    }
    
    // Aggiungi i generi da escludere solo se ci sono
    if (excludedGenreIds.length > 0) {
      params.without_genres = excludedGenreIds.join(',');
    }
    
    // Fai la richiesta all'API TMDb
    const response = await tmdbApi.get('/discover/movie', { params });
    
    res.json(response.data);
  } catch (error) {
    console.error('Errore nel recupero dei contenuti raccomandati:', error);
    res.status(500).json({ message: 'Errore nel recupero dei contenuti raccomandati' });
  }
};

/**
 * @desc    Ottiene contenuti in base all'umore
 * @route   GET /api/content/mood
 * @access  Public
 */
export const getMoodBasedContent = async (req: Request, res: Response) => {
  try {
    const { serious = 50, reflective = 50, page = 1 } = req.query;
    
    // Converti i parametri in numeri
    const seriousValue = Number(serious);
    const reflectiveValue = Number(reflective);
    
    // Determina i generi in base all'umore
    let genres: number[] = [];
    
    // Umore più serio favorisce film drammatici e thriller
    if (seriousValue > 70) {
      genres = genres.concat([18, 53, 9648]); // Drama, Thriller, Mystery
    } 
    // Umore meno serio favorisce commedie e avventure
    else if (seriousValue < 30) {
      genres = genres.concat([35, 12, 10751]); // Comedy, Adventure, Family
    }
    
    // Umore più riflessivo favorisce film documentari e drammi
    if (reflectiveValue > 70) {
      genres = genres.concat([99, 18, 36]); // Documentary, Drama, History
    } 
    // Umore meno riflessivo favorisce azione e fantascienza
    else if (reflectiveValue < 30) {
      genres = genres.concat([28, 878, 27]); // Action, Science Fiction, Horror
    }
    
    // Rimuovi duplicati
    const uniqueGenres = Array.from(new Set(genres));
    
    // Parametri per la richiesta
    const params: Record<string, any> = {
      sort_by: seriousValue > 50 ? 'vote_average.desc' : 'popularity.desc',
      page,
    };
    
    // Aggiungi i generi come filtro solo se ci sono
    if (uniqueGenres.length > 0) {
      params.with_genres = uniqueGenres.join(',');
    }
    
    // Fai la richiesta all'API TMDb
    const response = await tmdbApi.get('/discover/movie', { params });
    
    // Aggiungi valori di umore a ciascun risultato
    const resultsWithMood = response.data.results.map((item: any) => ({
      ...item,
      mood: {
        serious: Math.floor(Math.random() * 100), // In una app reale, questo verrebbe calcolato
        reflective: Math.floor(Math.random() * 100), // In una app reale, questo verrebbe calcolato
      },
    }));
    
    res.json({
      ...response.data,
      results: resultsWithMood,
    });
  } catch (error) {
    console.error('Errore nel recupero dei contenuti in base all\'umore:', error);
    res.status(500).json({ message: 'Errore nel recupero dei contenuti in base all\'umore' });
  }
};

/**
 * @desc    Ottiene contenuti in base all'epoca
 * @route   GET /api/content/time
 * @access  Public
 */
export const getTimeBasedContent = async (req: Request, res: Response) => {
  try {
    const { decade = '2020', page = 1 } = req.query;
    
    // Converti decade in intervallo di date
    const startYear = Number(decade);
    const endYear = startYear + 9;
    
    // Parametri per la richiesta
    const params: Record<string, any> = {
      sort_by: 'popularity.desc',
      page,
      'primary_release_date.gte': `${startYear}-01-01`,
      'primary_release_date.lte': `${endYear}-12-31`,
    };
    
    // Fai la richiesta all'API TMDb
    const response = await tmdbApi.get('/discover/movie', { params });
    
    res.json(response.data);
  } catch (error) {
    console.error('Errore nel recupero dei contenuti in base all\'epoca:', error);
    res.status(500).json({ message: 'Errore nel recupero dei contenuti in base all\'epoca' });
  }
};

/**
 * @desc    Ottiene contenuti di un regista specifico
 * @route   GET /api/content/director/:id
 * @access  Public
 */
export const getDirectorContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1 } = req.query;
    
    // Ottieni informazioni sul regista
    const personResponse = await tmdbApi.get(`/person/${id}`);
    
    // Ottieni i film diretti dalla persona
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
    console.error(`Errore nel recupero dei film del regista ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Errore nel recupero dei film del regista' });
  }
};

/**
 * @desc    Ottiene una raccomandazione casuale
 * @route   GET /api/content/random
 * @access  Public
 */
export const getRandomRecommendation = async (req: Request, res: Response) => {
  try {
    // Ottieni un film casuale tramite la ricerca per popolarità
    const randomPage = Math.floor(Math.random() * 100) + 1; // Pagina casuale tra 1 e 100
    
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        sort_by: 'popularity.desc',
        page: randomPage,
      },
    });
    
    // Scegli un risultato casuale dalla pagina
    const results = response.data.results;
    const randomIndex = Math.floor(Math.random() * results.length);
    const randomMovie = results[randomIndex];
    
    // Ottieni maggiori dettagli sul film casuale
    const movieDetails = await tmdbApi.get(`/movie/${randomMovie.id}`, {
      params: {
        append_to_response: 'credits,recommendations',
      },
    });
    
    res.json(movieDetails.data);
  } catch (error) {
    console.error('Errore nel recupero della raccomandazione casuale:', error);
    res.status(500).json({ message: 'Errore nel recupero della raccomandazione casuale' });
  }
}; 