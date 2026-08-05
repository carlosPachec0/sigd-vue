# http-client.ts

Target path: `src/shared/api/httpClient.ts`

Single `axios.create()` instance with a mandatory `timeout` (a stalled
request without one blocks the UI indefinitely) and request/response
interceptors that normalize every error to `HttpError` before it
propagates.

```ts
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { normalizeError } from './http-error'

/**
 * Single Axios instance for the whole application. This is the ONLY file
 * allowed to `import axios from 'axios'`. Nothing outside src/shared/api/
 * may import axios directly — services consume this instance through
 * BaseHttpService instead.
 */
const TIMEOUT_MS = 10_000

export const httpClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: TIMEOUT_MS, // Without a timeout, a stalled request blocks the UI indefinitely
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Extension point for dynamic headers (locale, tenant, etc.). Deliberately
// agnostic of the auth scheme (cookie/CSRF/token) — each consuming project
// adds its own auth interceptor separately, outside this shared layer.
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: unknown) => Promise.reject(normalizeError(error)),
)

// Every error response leaves this layer already normalized to HttpError.
// Callers never need to call axios.isAxiosError() themselves.
httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => Promise.reject(normalizeError(error)),
)
```