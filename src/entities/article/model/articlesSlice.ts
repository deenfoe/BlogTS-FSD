import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import axiosInstance from '../../../shared/utils/axiosInstance'
import { truncateText, truncateTags } from '../../../shared/utils/textFormatter'

import {
  IArticle,
  IServerError,
  ICreateArticlePayload,
  IUpdateArticlePayload,
  IComment,
  ICreateCommentArgs,
  IDeleteCommentArgs,
  IArticlesState,
} from './types'

const initialState: IArticlesState = {
  articles: [],
  articleBySlug: {},
  articleComments: {},
  articlesCount: 0,
  currentPage: 1,
  pageSize: 5,
  isSuccess: false,
  isLoading: false,
  errors: null,
}

export const fetchArticles = createAsyncThunk<
  | {
      articles: IArticle[]
      articlesCount: number
    }
  | { singleArticle: IArticle },
  {
    slug?: string
    page?: number
    pageSize?: number
  },
  {
    rejectValue: IServerError
  }
>('articles/fetchArticles', async ({ slug, page = 1, pageSize = 5 }, { rejectWithValue }) => {
  try {
    if (slug) {
      const response = await axiosInstance.get(`/articles/${slug}`)
      return { singleArticle: response.data.article }
    }
    const response = await axiosInstance.get(`/articles?limit=${pageSize}&offset=${(page - 1) * pageSize}`)
    const truncatedArticles = response.data.articles.map((article: IArticle) => ({
      ...article,
      title: truncateText(article.title, 50),
      description: truncateText(article.description, 150),
      tagList: truncateTags(article.tagList || []),
    }))
    return { articles: truncatedArticles, articlesCount: response.data.articlesCount }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Если это ошибка Axios и у нее есть response
      return rejectWithValue(error.response.data)
    }
    return rejectWithValue({ message: 'Неожиданная ошибка' })
  }
})

export const fetchCreateArticle = createAsyncThunk<IArticle, ICreateArticlePayload, { rejectValue: IServerError }>(
  'articles/fetchCreateArticle',
  async (articleData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/articles', {
        article: articleData,
      })
      return response.data.article
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Если это ошибка Axios и у нее есть response
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({ message: 'Неожиданная ошибка' })
    }
  }
)

export const fetchUpdateArticle = createAsyncThunk<IArticle, IUpdateArticlePayload, { rejectValue: IServerError }>(
  'articles/fetchUpdateArticle',
  async ({ slug, articleData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/articles/${slug}`, {
        article: articleData,
      })
      return response.data.article
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({ message: 'Неожиданная ошибка' })
    }
  }
)

export const fetchDeleteArticle = createAsyncThunk<string, string, { rejectValue: IServerError }>(
  'articles/fetchDeleteArticle',
  async (slug, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/articles/${slug}`)
      return slug
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({ message: 'Неожиданная ошибка' })
    }
  }
)

export const fetchFavoriteArticle = createAsyncThunk(
  'articles/fetchFavoriteArticle',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/articles/${slug}/favorite`)
      return response.data.article
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({ message: 'Неожиданная ошибка' })
    }
  }
)

export const fetchUnFavoriteArticle = createAsyncThunk(
  'articles/fetchUnFavoriteArticle',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/articles/${slug}/favorite`)
      return response.data.article
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({ message: 'Неожиданная ошибка' })
    }
  }
)

export const fetchArticleComments = createAsyncThunk<
  { slug: string; comments: IComment[] },
  string,
  { rejectValue: IServerError }
>('articles/fetchArticleComments', async (slug, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/articles/${slug}/comments`)
    return { slug, comments: response.data.comments }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data)
    }
    return rejectWithValue({ message: 'Failed to fetch comments' })
  }
})

export const fetchCreateComment = createAsyncThunk<
  { comment: IComment; slug: string },
  ICreateCommentArgs,
  { rejectValue: IServerError }
>('articles/fetchCreateComment', async ({ slug, commentBody }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/articles/${slug}/comments`, {
      comment: { body: commentBody },
    })
    return { comment: response.data.comment, slug }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data)
    }
    return rejectWithValue({ message: 'Failed to create comment' })
  }
})

export const fetchDeleteComment = createAsyncThunk<
  { commentId: number; slug: string },
  IDeleteCommentArgs,
  { rejectValue: IServerError }
>('articles/fetchDeleteComment', async ({ commentId, slug }, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/articles/${slug}/comments/${commentId}`)
    return { commentId, slug }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data)
    }
    return rejectWithValue({ message: 'Failed to delete comment' })
  }
})

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    resetSuccess(state) {
      state.isSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.isLoading = true
        state.errors = null
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.isLoading = false
        if ('singleArticle' in action.payload) {
          // Если есть singleArticle, значит это запрос на одну статью
          state.articleBySlug[action.payload.singleArticle.slug] = action.payload.singleArticle
        } else {
          // Иначе это запрос на список статей
          state.articles = action.payload.articles
          state.articlesCount = action.payload.articlesCount
        }
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.isSuccess = false
        state.isLoading = false
        state.errors = action.payload?.message || action.error.message || 'Failed to load articles'
      })
      .addCase(fetchCreateArticle.fulfilled, (state) => {
        state.isSuccess = true
      })
      .addCase(fetchUpdateArticle.fulfilled, (state, action) => {
        const updatedArticle = action.payload
        state.articleBySlug[updatedArticle.slug] = updatedArticle
        state.isSuccess = true
      })
      .addCase(fetchCreateArticle.rejected, (state) => {
        state.isSuccess = false
      })
      .addCase(fetchUpdateArticle.rejected, (state) => {
        state.isSuccess = false
      })
      .addCase(fetchDeleteArticle.fulfilled, (state, action) => {
        // Удаляем статью из списка articles и articleBySlug по slug
        state.articles = state.articles.filter((article) => article.slug !== action.payload)
        delete state.articleBySlug[action.payload]
        state.isSuccess = true
      })
      .addCase(fetchDeleteArticle.rejected, (state) => {
        state.isSuccess = false
      })

      .addCase(fetchFavoriteArticle.fulfilled, (state, action) => {
        const updatedArticle = action.payload
        state.articleBySlug[updatedArticle.slug] = updatedArticle
        const articleIndex = state.articles.findIndex((article) => article.slug === updatedArticle.slug)
        if (articleIndex !== -1) {
          state.articles[articleIndex] = updatedArticle
        }
      })
      .addCase(fetchUnFavoriteArticle.fulfilled, (state, action) => {
        const updatedArticle = action.payload
        state.articleBySlug[updatedArticle.slug] = updatedArticle
        const articleIndex = state.articles.findIndex((article) => article.slug === updatedArticle.slug)
        if (articleIndex !== -1) {
          state.articles[articleIndex] = updatedArticle
        }
      })
      .addCase(fetchArticleComments.pending, (state) => {
        state.isLoading = true
        state.errors = null
      })
      .addCase(fetchArticleComments.fulfilled, (state, action) => {
        state.isLoading = false
        const { slug, comments } = action.payload
        state.articleComments[slug] = comments
      })
      .addCase(fetchArticleComments.rejected, (state, action) => {
        state.isLoading = false
        state.errors = action.error.message || 'Failed to load comments'
      })
      .addCase(fetchCreateComment.fulfilled, (state, action) => {
        const { comment, slug } = action.payload
        state.articleComments[slug] = [...(state.articleComments[slug] || []), comment]
        state.isSuccess = true
      })
      .addCase(fetchCreateComment.rejected, (state, action) => {
        state.isSuccess = false
        state.errors = action.payload || 'Failed to create comment'
      })
      .addCase(fetchDeleteComment.fulfilled, (state, action) => {
        const { commentId, slug } = action.payload
        // Удаляем комментарий из стейта
        state.articleComments[slug] = state.articleComments[slug].filter((comment) => comment.id !== commentId)
        state.isSuccess = true
      })
      .addCase(fetchDeleteComment.rejected, (state, action) => {
        state.isSuccess = false
        state.errors = action.payload || 'Failed to delete comment'
      })
  },
})

export const { setCurrentPage, resetSuccess } = articlesSlice.actions

export const selectArticles = (state: { articles: IArticlesState }) => state.articles.articles
export const selectArticlesCount = (state: { articles: IArticlesState }) => state.articles.articlesCount
export const selectCurrentPage = (state: { articles: IArticlesState }) => state.articles.currentPage
export const selectPageSize = (state: { articles: IArticlesState }) => state.articles.pageSize
export const selectIsSuccess = (state: { articles: IArticlesState }) => state.articles.isSuccess
export const selectIsLoading = (state: { articles: IArticlesState }) => state.articles.isLoading
export const selectErrors = (state: { articles: IArticlesState }) => state.articles.errors
export const selectArticleBySlug = (slug: string) => (state: { articles: IArticlesState }) =>
  state.articles.articleBySlug[slug]
export const selectCommentsBySlug = (slug: string) => (state: { articles: IArticlesState }) =>
  state.articles.articleComments[slug]

export default articlesSlice.reducer
