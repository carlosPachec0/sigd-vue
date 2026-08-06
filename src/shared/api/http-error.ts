import axios from 'axios'

export interface ApiErrorResponse {
  message: string
  data: unknown | null
  status: number
  errors: string[]
}

export class HttpError extends Error {
  readonly status: number | null
  readonly code: string | null
  readonly response: ApiErrorResponse | null

  constructor(message: string, status: number | null, code: string | null, data: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
    this.response = isApiErrorResponse(data) ? data : null
  }

  get hasResponse(): boolean {
    return this.status !== null
  }

  get displayMessage(): string {
    if (this.response) {
      return this.response.message
    }
    return this.message
  }

  get errors(): string[] {
    return this.response?.errors ?? []
  }
}

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return typeof data === 'object' && data !== null && !Array.isArray(data) && 'message' in data
}

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
