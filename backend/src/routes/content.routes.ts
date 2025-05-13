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
 * @desc    Get recommended content based on user preferences
 * @access  Public
 */
router.get('/recommended', getRecommendedContent);

/**
 * @route   GET /api/content/mood
 * @desc    Get content based on mood
 * @access  Public
 */
router.get('/mood', getMoodBasedContent);

/**
 * @route   GET /api/content/time
 * @desc    Get content based on time period
 * @access  Public
 */
router.get('/time', getTimeBasedContent);

/**
 * @route   GET /api/content/director/:id
 * @desc    Get content from a specific director
 * @access  Public
 */
router.get('/director/:id', getDirectorContent);

/**
 * @route   GET /api/content/random
 * @desc    Get a random recommendation
 * @access  Public
 */
router.get('/random', getRandomRecommendation);

export default router; 