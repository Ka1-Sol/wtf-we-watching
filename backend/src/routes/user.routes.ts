import { Router } from 'express';
import {
    addSavedContent,
    addWatchedContent,
    getUserPreferences,
    rateContent,
    removeSavedContent,
    updateUserPreferences
} from '../controllers/user.controller.js';

const router = Router();

/**
 * @route   GET /api/users/preferences
 * @desc    Get user preferences
 * @access  Public
 */
router.get('/preferences', getUserPreferences);

/**
 * @route   PUT /api/users/preferences
 * @desc    Update user preferences
 * @access  Public
 */
router.put('/preferences', updateUserPreferences);

/**
 * @route   POST /api/users/watched
 * @desc    Add content to watched list
 * @access  Public
 */
router.post('/watched', addWatchedContent);

/**
 * @route   POST /api/users/saved
 * @desc    Add content to saved list
 * @access  Public
 */
router.post('/saved', addSavedContent);

/**
 * @route   DELETE /api/users/saved/:id
 * @desc    Remove content from saved list
 * @access  Public
 */
router.delete('/saved/:id', removeSavedContent);

/**
 * @route   POST /api/users/rate
 * @desc    Rate content
 * @access  Public
 */
router.post('/rate', rateContent);

export default router; 