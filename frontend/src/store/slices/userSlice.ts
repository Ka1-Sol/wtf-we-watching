import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export interface Genre {
  id: number
  name: string
}

export interface Creator {
  id: number
  name: string
}

export interface Preference {
  genres: Genre[]
  creators: Creator[]
  excludedGenres: Genre[]
  moodPreference: {
    serious: number // 0-100
    reflective: number // 0-100
  }
  periodPreference: string[] // decades or specific periods
}

export interface UserState {
  isProfileComplete: boolean
  preferences: Preference
  watchedContent: number[] // IDs of watched content
  savedContent: number[] // IDs of saved content
  personalRatings: Record<number, number> // contentId: rating (1-5)
}

const initialState: UserState = {
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
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfileComplete: (state, action: PayloadAction<boolean>) => {
      state.isProfileComplete = action.payload
    },
    addGenrePreference: (state, action: PayloadAction<Genre>) => {
      const exists = state.preferences.genres.some(g => g.id === action.payload.id)
      if (!exists) {
        state.preferences.genres.push(action.payload)
      }
    },
    removeGenrePreference: (state, action: PayloadAction<number>) => {
      state.preferences.genres = state.preferences.genres.filter(g => g.id !== action.payload)
    },
    addCreatorPreference: (state, action: PayloadAction<Creator>) => {
      const exists = state.preferences.creators.some(c => c.id === action.payload.id)
      if (!exists) {
        state.preferences.creators.push(action.payload)
      }
    },
    removeCreatorPreference: (state, action: PayloadAction<number>) => {
      state.preferences.creators = state.preferences.creators.filter(c => c.id !== action.payload)
    },
    setMoodPreference: (state, action: PayloadAction<{ serious?: number; reflective?: number }>) => {
      state.preferences.moodPreference = {
        ...state.preferences.moodPreference,
        ...action.payload,
      }
    },
    addWatchedContent: (state, action: PayloadAction<number>) => {
      if (!state.watchedContent.includes(action.payload)) {
        state.watchedContent.push(action.payload)
      }
    },
    addSavedContent: (state, action: PayloadAction<number>) => {
      if (!state.savedContent.includes(action.payload)) {
        state.savedContent.push(action.payload)
      }
    },
    removeSavedContent: (state, action: PayloadAction<number>) => {
      state.savedContent = state.savedContent.filter(id => id !== action.payload)
    },
    rateContent: (state, action: PayloadAction<{ contentId: number; rating: number }>) => {
      const { contentId, rating } = action.payload
      state.personalRatings[contentId] = rating
    },
  },
})

export const {
  setProfileComplete,
  addGenrePreference,
  removeGenrePreference,
  addCreatorPreference,
  removeCreatorPreference,
  setMoodPreference,
  addWatchedContent,
  addSavedContent,
  removeSavedContent,
  rateContent,
} = userSlice.actions

export default userSlice.reducer 