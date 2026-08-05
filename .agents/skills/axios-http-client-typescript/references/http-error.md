# http-error.ts

Target path: `src/shared/api/http-error.ts`

`HttpError` class + `normalizeError()`. Uses `axios.isAxiosError()` for type
narrowing (axios's recommended approach over `instanceof AxiosError`, which
can misbehave across bundles).

```ts
import axios from 'axios'

/**
 * HTTP domain error. Every exception that reaches a store, service, or
 * component must be an instance of HttpError, never a raw AxiosError.
 */
export class HttpError extends Error {
  readonly status: number | null
  readonly code: string | null
  readonly data: unknown

  constructor(message: string, status: number | null, code: string | null, data: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
    this.data = data
  }

  /** true if the server actually responded (4xx/5xx), false on network/timeout failures */
  get hasResponse(): boolean {
    return this.status !== null
  }
}

/**
 * Normalizes any error caught in the network layer into HttpError.
 * Uses axios.isAxiosError() for type narrowing instead of
 * `instanceof AxiosError` (avoids identity issues across bundles).
 */
export function normalizeError(error: unknown): HttpError {
  if (axios.isAxiosError(error)) {
    return new HttpError(
      error.message,
      error.response?.status ?? null,
      error.code ?? null,
      error.response?.data ?? null,
    )
  }

  if (error instanceof Error) {
    return new HttpError(error.message, null, null, null)
  }

  return new HttpError('Unknown error while performing the HTTP request', null, null, error)
}
```