import { Request, Response } from 'express';
import fs from 'fs';
import { USER_DATA_PATH, getPath } from '../utils/paths.js';

// Tipo per le preferenze dell'utente
interface UserPreferences {
  genres: { id: number; name: string }[];
  creators: { id: number; name: string }[];
  excludedGenres: { id: number; name: string }[];
  moodPreference: {
    serious: number;
    reflective: number;
  };
  periodPreference: string[];
}

// Tipo per l'utente
interface User {
  isProfileComplete: boolean;
  preferences: UserPreferences;
  watchedContent: number[];
  savedContent: number[];
  personalRatings: Record<number, number>;
}

// Carica i dati utente dal file
const loadUserData = (): User => {
  try {
    // Verifica se la directory data esiste, altrimenti creala
    const dataDir = getPath('data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Verifica se il file esiste, altrimenti crea un utente di default
    if (!fs.existsSync(USER_DATA_PATH)) {
      const defaultUser: User = {
        isProfileComplete: false,
        preferences: {
          genres: [],
          creators: [],
          excludedGenres: [],
          moodPreference: {
            serious: 50,
            reflective: 50,
          },
          periodPreference: [],
        },
        watchedContent: [],
        savedContent: [],
        personalRatings: {},
      };
      
      fs.writeFileSync(USER_DATA_PATH, JSON.stringify(defaultUser, null, 2));
      return defaultUser;
    }
    
    const userData = fs.readFileSync(USER_DATA_PATH, 'utf8');
    return JSON.parse(userData);
  } catch (error) {
    console.error('Errore nel caricamento dei dati utente:', error);
    // Restituisci un utente di default in caso di errore
    return {
      isProfileComplete: false,
      preferences: {
        genres: [],
        creators: [],
        excludedGenres: [],
        moodPreference: {
          serious: 50,
          reflective: 50,
        },
        periodPreference: [],
      },
      watchedContent: [],
      savedContent: [],
      personalRatings: {},
    };
  }
};

// Salva i dati utente nel file
const saveUserData = (userData: User): void => {
  try {
    fs.writeFileSync(USER_DATA_PATH, JSON.stringify(userData, null, 2));
  } catch (error) {
    console.error('Errore nel salvataggio dei dati utente:', error);
  }
};

/**
 * @desc    Ottiene le preferenze dell'utente
 * @route   GET /api/users/preferences
 * @access  Public
 */
export const getUserPreferences = (req: Request, res: Response) => {
  try {
    const userData = loadUserData();
    res.json(userData.preferences);
  } catch (error) {
    console.error('Errore nel recupero delle preferenze utente:', error);
    res.status(500).json({ message: 'Errore nel recupero delle preferenze utente' });
  }
};

/**
 * @desc    Aggiorna le preferenze dell'utente
 * @route   PUT /api/users/preferences
 * @access  Public
 */
export const updateUserPreferences = (req: Request, res: Response) => {
  try {
    const userData = loadUserData();
    const updatedPreferences = req.body;
    
    if (!updatedPreferences) {
      return res.status(400).json({ message: 'Nessuna preferenza fornita' });
    }
    
    // Aggiorna solo i campi forniti
    userData.preferences = {
      ...userData.preferences,
      ...updatedPreferences,
    };
    
    // Aggiorna anche lo stato di completamento del profilo
    userData.isProfileComplete = true;
    
    saveUserData(userData);
    res.json(userData.preferences);
  } catch (error) {
    console.error('Errore nell\'aggiornamento delle preferenze utente:', error);
    res.status(500).json({ message: 'Errore nell\'aggiornamento delle preferenze utente' });
  }
};

/**
 * @desc    Aggiunge un contenuto alla lista dei guardati
 * @route   POST /api/users/watched
 * @access  Public
 */
export const addWatchedContent = (req: Request, res: Response) => {
  try {
    const { contentId } = req.body;
    
    if (!contentId) {
      return res.status(400).json({ message: 'ID contenuto mancante' });
    }
    
    const userData = loadUserData();
    
    // Aggiungi l'ID solo se non è già presente
    if (!userData.watchedContent.includes(contentId)) {
      userData.watchedContent.push(contentId);
      saveUserData(userData);
    }
    
    res.json({ watchedContent: userData.watchedContent });
  } catch (error) {
    console.error('Errore nell\'aggiunta del contenuto guardato:', error);
    res.status(500).json({ message: 'Errore nell\'aggiunta del contenuto guardato' });
  }
};

/**
 * @desc    Aggiunge un contenuto alla lista dei salvati
 * @route   POST /api/users/saved
 * @access  Public
 */
export const addSavedContent = (req: Request, res: Response) => {
  try {
    const { contentId } = req.body;
    
    if (!contentId) {
      return res.status(400).json({ message: 'ID contenuto mancante' });
    }
    
    const userData = loadUserData();
    
    // Aggiungi l'ID solo se non è già presente
    if (!userData.savedContent.includes(contentId)) {
      userData.savedContent.push(contentId);
      saveUserData(userData);
    }
    
    res.json({ savedContent: userData.savedContent });
  } catch (error) {
    console.error('Errore nell\'aggiunta del contenuto salvato:', error);
    res.status(500).json({ message: 'Errore nell\'aggiunta del contenuto salvato' });
  }
};

/**
 * @desc    Rimuove un contenuto dalla lista dei salvati
 * @route   DELETE /api/users/saved/:id
 * @access  Public
 */
export const removeSavedContent = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contentId = parseInt(id, 10);
    
    if (isNaN(contentId)) {
      return res.status(400).json({ message: 'ID contenuto non valido' });
    }
    
    const userData = loadUserData();
    
    // Filtra l'ID dal array
    userData.savedContent = userData.savedContent.filter(id => id !== contentId);
    saveUserData(userData);
    
    res.json({ savedContent: userData.savedContent });
  } catch (error) {
    console.error('Errore nella rimozione del contenuto salvato:', error);
    res.status(500).json({ message: 'Errore nella rimozione del contenuto salvato' });
  }
};

/**
 * @desc    Valuta un contenuto
 * @route   POST /api/users/rate
 * @access  Public
 */
export const rateContent = (req: Request, res: Response) => {
  try {
    const { contentId, rating } = req.body;
    
    if (!contentId || rating === undefined) {
      return res.status(400).json({ message: 'ID contenuto o valutazione mancante' });
    }
    
    // Verifica che la valutazione sia valida (1-5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'La valutazione deve essere compresa tra 1 e 5' });
    }
    
    const userData = loadUserData();
    
    // Imposta la valutazione per il contenuto
    userData.personalRatings[contentId] = rating;
    saveUserData(userData);
    
    res.json({ personalRatings: userData.personalRatings });
  } catch (error) {
    console.error('Errore nella valutazione del contenuto:', error);
    res.status(500).json({ message: 'Errore nella valutazione del contenuto' });
  }
}; 