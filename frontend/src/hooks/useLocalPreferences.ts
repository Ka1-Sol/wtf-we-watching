import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface LocalPreferences {
  theme: Theme;
  cardSize: 'small' | 'medium' | 'large';
  viewMode: 'grid' | 'list';
  enableAnimations: boolean;
}

const defaultPreferences: LocalPreferences = {
  theme: 'system',
  cardSize: 'medium',
  viewMode: 'grid',
  enableAnimations: true,
};

const STORAGE_KEY = 'wtf_watching_preferences';

const useLocalPreferences = () => {
  const [preferences, setPreferences] = useState<LocalPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const storedPrefs = localStorage.getItem(STORAGE_KEY);
      if (storedPrefs) {
        setPreferences(JSON.parse(storedPrefs));
      }
    } catch (error) {
      console.error('Error loading preferences from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      } catch (error) {
        console.error('Error saving preferences to localStorage:', error);
      }
    }
  }, [preferences, isLoaded]);

  // Update theme in the DOM
  useEffect(() => {
    if (!isLoaded) return;

    const { theme } = preferences;
    const root = document.documentElement;

    if (theme === 'system') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [preferences.theme, isLoaded]);

  // Update a single preference
  const updatePreference = useCallback(<K extends keyof LocalPreferences>(
    key: K,
    value: LocalPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Reset all preferences to defaults
  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, []);

  return {
    preferences,
    updatePreference,
    resetPreferences,
    isLoaded,
  };
};

export default useLocalPreferences; 