import { Router } from 'express';
import {
    discoverContent,
    getMovieDetails,
    getTrending,
    getTvDetails,
    searchContent
} from '../controllers/tmdb.controller.js';

const router = Router();

/**
 * @route   GET /api/tmdb/trending
 * @desc    Ottiene contenuti di tendenza
 * @access  Public
 */
router.get('/trending', getTrending);

/**
 * @route   GET /api/tmdb/movie/:id
 * @desc    Ottiene dettagli di un film
 * @access  Public
 */
router.get('/movie/:id', getMovieDetails);

/**
 * @route   GET /api/tmdb/tv/:id
 * @desc    Ottiene dettagli di una serie TV
 * @access  Public
 */
router.get('/tv/:id', getTvDetails);

/**
 * @route   GET /api/tmdb/search
 * @desc    Cerca film e serie TV
 * @access  Public
 */
router.get('/search', searchContent);

/**
 * @route   GET /api/tmdb/discover
 * @desc    Scopre contenuti in base a vari parametri
 * @access  Public
 */
router.get('/discover', discoverContent);

export default router; 