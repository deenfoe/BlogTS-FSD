export interface IUser {
  username: string
  email: string
  password?: string | undefined | null
  image?: string
}

export interface IAuthState {
  user: IUser | null
  errors: { [key: string]: string } | null
}

export interface ISignUpData {
  username: string
  email: string
  password: string
}

export interface ISignInData {
  email: string
  password: string
}

export interface IApiError {
  errors: { [key: string]: string }
}
