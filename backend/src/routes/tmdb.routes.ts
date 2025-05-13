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
 * @desc    Get trending content
 * @access  Public
 */
router.get('/trending', getTrending);

/**
 * @route   GET /api/tmdb/movie/:id
 * @desc    Get movie details
 * @access  Public
 */
router.get('/movie/:id', getMovieDetails);

/**
 * @route   GET /api/tmdb/tv/:id
 * @desc    Get TV series details
 * @access  Public
 */
router.get('/tv/:id', getTvDetails);

/**
 * @route   GET /api/tmdb/search
 * @desc    Search for movies and TV series
 * @access  Public
 */
router.get('/search', searchContent);

/**
 * @route   GET /api/tmdb/discover
 * @desc    Discover content based on various parameters
 * @access  Public
 */
router.get('/discover', discoverContent);

export default router; 