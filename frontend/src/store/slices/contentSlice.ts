import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export interface Content {
  id: number
  title: string
  type: 'movie' | 'tv'
  posterPath?: string
  backdropPath?: string
  overview?: string
  releaseDate?: string
  voteAverage?: number
  genres?: { id: number; name: string }[]
  runtime?: number // for movies
  episodeCount?: number // for TV
  seasonCount?: number // for TV
  creators?: { id: number; name: string; job?: string }[]
  mood?: {
    serious: number // 0-100
    reflective: number // 0-100
  }
}

export interface ContentState {
  recommendations: Content[]
  discoveryContent: Content[]
  trendingContent: Content[]
  contentDetails: Record<number, Content>
  loading: boolean
  error: string | null
}

const initialState: ContentState = {
  recommendations: [],
  discoveryContent: [],
  trendingContent: [],
  contentDetails: {},
  loading: false,
  error: null,
}

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setRecommendations: (state, action: PayloadAction<Content[]>) => {
      state.recommendations = action.payload
    },
    setDiscoveryContent: (state, action: PayloadAction<Content[]>) => {
      state.discoveryContent = action.payload
    },
    setTrendingContent: (state, action: PayloadAction<Content[]>) => {
      state.trendingContent = action.payload
    },
    setContentDetails: (state, action: PayloadAction<Content>) => {
      state.contentDetails[action.payload.id] = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setRecommendations,
  setDiscoveryContent,
  setTrendingContent,
  setContentDetails,
  setLoading,
  setError,
} = contentSlice.actions

export default contentSlice.reducer 