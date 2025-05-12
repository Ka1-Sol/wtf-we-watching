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
 * @desc    Ottiene le preferenze dell'utente
 * @access  Public
 */
router.get('/preferences', getUserPreferences);

/**
 * @route   PUT /api/users/preferences
 * @desc    Aggiorna le preferenze dell'utente
 * @access  Public
 */
router.put('/preferences', updateUserPreferences);

/**
 * @route   POST /api/users/watched
 * @desc    Aggiunge un contenuto alla lista dei guardati
 * @access  Public
 */
router.post('/watched', addWatchedContent);

/**
 * @route   POST /api/users/saved
 * @desc    Aggiunge un contenuto alla lista dei salvati
 * @access  Public
 */
router.post('/saved', addSavedContent);

/**
 * @route   DELETE /api/users/saved/:id
 * @desc    Rimuove un contenuto dalla lista dei salvati
 * @access  Public
 */
router.delete('/saved/:id', removeSavedContent);

/**
 * @route   POST /api/users/rate
 * @desc    Valuta un contenuto
 * @access  Public
 */
router.post('/rate', rateContent);

export default router; 