import { Router } from 'express';
import {
    getDirectorContent,
    getMoodBasedContent,
    getRandomRecommendation,
    getRecommendedContent,
    getTimeBasedContent
} from '../controllers/content.controller.js';

const router = Router();

/**
 * @route   GET /api/content/recommended
 * @desc    Ottiene contenuti raccomandati in base alle preferenze dell'utente
 * @access  Public
 */
router.get('/recommended', getRecommendedContent);

/**
 * @route   GET /api/content/mood
 * @desc    Ottiene contenuti in base all'umore
 * @access  Public
 */
router.get('/mood', getMoodBasedContent);

/**
 * @route   GET /api/content/time
 * @desc    Ottiene contenuti in base all'epoca
 * @access  Public
 */
router.get('/time', getTimeBasedContent);

/**
 * @route   GET /api/content/director/:id
 * @desc    Ottiene contenuti di un regista specifico
 * @access  Public
 */
router.get('/director/:id', getDirectorContent);

/**
 * @route   GET /api/content/random
 * @desc    Ottiene una raccomandazione casuale
 * @access  Public
 */
router.get('/random', getRandomRecommendation);

export default router; 