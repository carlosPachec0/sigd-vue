import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/authentication/stores/auth.store'

vi.mock('@/authentication/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
    verifyEmail: vi.fn(),
    resendVerification: vi.fn(),
  },
}))

import { authService } from '@/authentication/services/auth.service'

describe('AuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('starts with no user or token', () => {
    const store = useAuthStore()

    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('restores session from localStorage', () => {
    const user = { id: '123', email: 'test@example.com', name: 'Test', email_verified_at: null }
    localStorage.setItem('sigd_token', 'test-token')
    localStorage.setItem('sigd_user', JSON.stringify(user))

    const store = useAuthStore()
    store.restoreSession()

    expect(store.token).toBe('test-token')
    expect(store.user).toEqual(user)
    expect(store.isAuthenticated).toBe(true)
  })

  it('login stores user and token on success', async () => {
    const mockResponse = {
      message: 'Login successful.',
      data: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        token: '1|abc123',
        email_verified_at: null,
      },
      status: 200,
      errors: [],
    }
    vi.mocked(authService.login).mockResolvedValue(mockResponse)

    const store = useAuthStore()
    await store.login({ email: 'test@example.com', password: 'password123' })

    expect(store.isAuthenticated).toBe(true)
    expect(store.user?.email).toBe('test@example.com')
    expect(store.token).toBe('1|abc123')
    expect(localStorage.getItem('sigd_token')).toBe('1|abc123')
  })

  it('logout clears user and token', async () => {
    vi.mocked(authService.logout).mockResolvedValue({
      message: 'Logged out successfully.',
      data: null,
      status: 200,
      errors: [],
    })

    const store = useAuthStore()
    store.restoreSession = vi.fn()
    localStorage.setItem('sigd_token', 'test-token')

    await store.logout()

    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(localStorage.getItem('sigd_token')).toBeNull()
  })

  it('forgotPassword returns message on success', async () => {
    vi.mocked(authService.forgotPassword).mockResolvedValue({
      message: 'If an account with that email exists, a password reset link has been sent.',
      data: null,
      status: 200,
      errors: [],
    })

    const store = useAuthStore()
    const message = await store.forgotPassword('test@example.com')

    expect(message).toContain('password reset link has been sent')
  })
})
