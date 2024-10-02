import { configureStore } from '@reduxjs/toolkit'

import authFormReducer from '../features/auth/model/authFormSlice'
import articlesReducer from '../entities/article/model/articlesSlice'

const store = configureStore({
  reducer: {
    articles: articlesReducer,
    authForm: authFormReducer,
  },
})

// Определяем тип AppDispatch, чтобы его можно было использовать для типизации dispatch
export type AppDispatch = typeof store.dispatch

export default store
