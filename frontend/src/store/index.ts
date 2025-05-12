import { configureStore } from '@reduxjs/toolkit'
import { contentReducer, userReducer } from './slices'

export const store = configureStore({
  reducer: {
    user: userReducer,
    content: contentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export * from './slices'
