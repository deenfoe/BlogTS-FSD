export interface IServerError {
  message: string
}

export interface IAuthor {
  username: string
  image: string
}

export interface IArticle {
  slug: string
  title: string
  description: string
  tagList: string[]
  body: string
  favorited: boolean
  favoritesCount: number
  createdAt: string
  author: IAuthor
}

export interface ICreateArticlePayload {
  title: string
  description: string
  body: string
  tagList: string[]
}

export interface IUpdateArticlePayload {
  slug: string
  articleData: {
    title?: string
    description?: string
    body?: string
    tagList?: string[]
  }
}

export interface IComment {
  id: number
  body: string
  author: IAuthor
  createdAt: string
}

export interface ICreateCommentArgs {
  slug: string
  commentBody: string
}

export interface IDeleteCommentArgs {
  commentId: number
  slug: string
}

export interface IArticlesState {
  articles: IArticle[]
  articleBySlug: Record<string, IArticle>
  articleComments: Record<string, IComment[]>
  articlesCount: number
  currentPage: number
  pageSize: number
  isSuccess: boolean
  isLoading: boolean
  errors: IServerError | string | null
}
