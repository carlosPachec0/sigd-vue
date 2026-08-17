import { describe, it, expect } from 'vitest'
import { HttpError, normalizeError } from '@/shared/api/http-error'

describe('HttpError', () => {
  it('creates an error with all properties', () => {
    const error = new HttpError('Test error', 404, 'ERR_NOT_FOUND', {
      message: 'Not found',
      data: null,
      status: 404,
      errors: [],
    })

    expect(error.message).toBe('Test error')
    expect(error.status).toBe(404)
    expect(error.code).toBe('ERR_NOT_FOUND')
    expect(error.response).toEqual({ message: 'Not found', data: null, status: 404, errors: [] })
    expect(error.name).toBe('HttpError')
  })

  it('hasResponse returns true when status is set', () => {
    const error = new HttpError('Error', 500, null, null)
    expect(error.hasResponse).toBe(true)
  })

  it('hasResponse returns false when status is null', () => {
    const error = new HttpError('Network error', null, 'ERR_NETWORK', null)
    expect(error.hasResponse).toBe(false)
  })

  it('displayMessage returns backend message when response is present', () => {
    const error = new HttpError('Request failed', 401, null, {
      message: 'Authentication failed.',
      data: null,
      status: 401,
      errors: ['The provided credentials are incorrect.'],
    })
    expect(error.displayMessage).toBe('Authentication failed.')
  })

  it('displayMessage falls back to axios message when no response', () => {
    const error = new HttpError('Network Error', null, 'ERR_NETWORK', null)
    expect(error.displayMessage).toBe('Network Error')
  })

  it('errors returns backend errors array when response is present', () => {
    const error = new HttpError('Request failed', 422, null, {
      message: 'Validation failed.',
      data: null,
      status: 422,
      errors: ['The email field is required.', 'The password field is required.'],
    })
    expect(error.errors).toEqual(['The email field is required.', 'The password field is required.'])
  })

  it('errors returns empty array when no response', () => {
    const error = new HttpError('Network Error', null, 'ERR_NETWORK', null)
    expect(error.errors).toEqual([])
  })
})

describe('normalizeError', () => {
  it('normalizes a generic Error', () => {
    const error = new Error('Something failed')
    const normalized = normalizeError(error)

    expect(normalized).toBeInstanceOf(HttpError)
    expect(normalized.message).toBe('Something failed')
    expect(normalized.status).toBeNull()
    expect(normalized.code).toBeNull()
  })

  it('normalizes an unknown value', () => {
    const normalized = normalizeError('string error')

    expect(normalized).toBeInstanceOf(HttpError)
    expect(normalized.message).toBe('Unknown error while performing the HTTP request')
    expect(normalized.response).toBeNull()
  })

  it('normalizes null', () => {
    const normalized = normalizeError(null)

    expect(normalized).toBeInstanceOf(HttpError)
    expect(normalized.message).toBe('Unknown error while performing the HTTP request')
  })
})
