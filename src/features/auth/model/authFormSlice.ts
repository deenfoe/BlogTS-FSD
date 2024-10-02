import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import axiosInstance from '../../../shared/utils/axiosInstance'

import { IUser, IAuthState, ISignUpData, ISignInData, IApiError } from './types'

const initialState: IAuthState = {
  user: JSON.parse(localStorage.getItem('user') as string) || null,
  errors: null,
}

export const fetchSignUp = createAsyncThunk<IUser, ISignUpData, { rejectValue: IApiError }>(
  'authForm/fetchSignUp',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users', {
        user: {
          username,
          email,
          password,
        },
      })
      return response.data.user
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as IApiError)
      }
      if (error instanceof Error) {
        return rejectWithValue({ errors: { general: error.message } })
      }
      return rejectWithValue({ errors: { general: 'Произошла ошибка сети' } })
    }
  }
)

export const fetchSignIn = createAsyncThunk<IUser, ISignInData, { rejectValue: IApiError }>(
  'authForm/fetchSignIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/login', {
        user: {
          email,
          password,
        },
      })
      return response.data.user
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as IApiError)
      }
      if (error instanceof Error) {
        return rejectWithValue({ errors: { general: error.message } })
      }
      return rejectWithValue({ errors: { general: 'Произошла ошибка сети' } })
    }
  }
)

export const fetchUserUpdate = createAsyncThunk<IUser, Partial<IUser>, { rejectValue: IApiError }>(
  'authForm/fetchUserUpdate',
  async (userData, { rejectWithValue }) => {
    try {
      // Используем axiosInstance, который автоматически добавляет токен через интерсептор
      const response = await axiosInstance.put('/user', {
        user: userData,
      })

      return response.data.user // Возвращаем данные пользователя при успешном запросе
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as IApiError)
      }
      if (error instanceof Error) {
        return rejectWithValue({ errors: { general: error.message } })
      }
      return rejectWithValue({ errors: { general: 'Произошла ошибка сети' } })
    }
  }
)

const authFormSlice = createSlice({
  name: 'authForm',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
    },
    clearErrors: (state) => {
      state.errors = null
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSignUp.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(fetchSignUp.rejected, (state, action) => {
        if (action.payload) {
          // Проверяем, что payload не undefined
          state.errors = action.payload.errors
        } else {
          state.errors = { general: 'Произошла ошибка при регистрации' }
        }
      })
      .addCase(fetchSignIn.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(fetchSignIn.rejected, (state, action) => {
        if (action.payload) {
          // Проверяем, что payload не undefined
          state.errors = action.payload.errors
        } else {
          state.errors = { general: 'Произошла ошибка при входе в систему' }
        }
      })
      .addCase(fetchUserUpdate.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(fetchUserUpdate.rejected, (state, action) => {
        if (action.payload) {
          // Проверяем, что payload не undefined
          state.errors = action.payload.errors
        } else {
          state.errors = { general: 'Произошла ошибка при обновлении данных' }
        }
      })
  },
})

export const { logout, clearErrors } = authFormSlice.actions

export const selectUser = (state: { authForm: IAuthState }) => state.authForm.user
export const selectUsername = (state: { authForm: IAuthState }) => state.authForm?.user?.username
export const selectErrors = (state: { authForm: IAuthState }) => state.authForm.errors
export const selectIsAuthenticated = (state: { authForm: IAuthState }) => !!state.authForm.user

export default authFormSlice.reducer
