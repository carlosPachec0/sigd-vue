import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { normalizeError } from './http-error'

const TIMEOUT_MS = 10_000
const TOKEN_KEY = 'sigd_token'

export const httpClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL /*?? 'http://localhost:8000'*/,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => Promise.reject(normalizeError(error)),
)

httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    const httpError = normalizeError(error)
    const requestUrl = (error as { config?: { url?: string } })?.config?.url ?? ''
    if (httpError.status === 401 && !requestUrl.includes('/auth/login')) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/login'
    }
    return Promise.reject(httpError)
  },
)
