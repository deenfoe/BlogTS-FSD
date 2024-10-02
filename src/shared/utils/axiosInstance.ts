import axios, { InternalAxiosRequestConfig } from 'axios'

interface IUser {
  token: string
}

const axiosInstance = axios.create({
  baseURL: 'https://blog.kata.academy/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userJson = localStorage.getItem('user')

    if (userJson) {
      const user: IUser = JSON.parse(userJson)
      if (user.token) {
        config.headers!.Authorization = `Bearer ${user.token}`
      }
    }
    // const user = JSON.parse(localStorage.getItem('user'))
    // if (user && user.token) {
    //   config.headers.Authorization = `Bearer ${user.token}`
    // }
    return config
  },
  (error) => Promise.reject(error)
)

export default axiosInstance
