import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/auth.service'
import { HttpError, normalizeError } from '@/shared/api/http-error'
import type { UserDto, LoginDto, SignupDto } from '../types/auth.dto'

const TOKEN_KEY = 'sigd_token'
const USER_KEY = 'sigd_user'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserDto | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<HttpError | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isEmailVerified = computed(() => !!user.value?.email_verified_at)

  function restoreSession(): void {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)
    if (storedToken) {
      token.value = storedToken
    }
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser) as UserDto
      } catch {
        localStorage.removeItem(USER_KEY)
      }
    }
  }

  function persistSession(userData: UserDto, userToken: string): void {
    token.value = userToken
    user.value = userData
    localStorage.setItem(TOKEN_KEY, userToken)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  function clearSession(): void {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  async function login(payload: LoginDto): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.login(payload)
      persistSession(
        {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          email_verified_at: response.data.email_verified_at,
        },
        response.data.token,
      )
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function signup(payload: SignupDto): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.signup(payload)
      persistSession(
        {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          email_verified_at: response.data.email_verified_at,
        },
        response.data.token,
      )
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      await authService.logout()
    } catch {
      // Logout endpoint may fail if token is already invalid — clear locally regardless
    } finally {
      clearSession()
      isLoading.value = false
    }
  }

  async function forgotPassword(email: string): Promise<string> {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.forgotPassword({ email })
      return response.message
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function resetPassword(
    email: string,
    resetToken: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<string> {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.resetPassword({
        email,
        token: resetToken,
        password,
        password_confirmation: passwordConfirmation,
      })
      return response.message
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function verifyEmail(id: string, hash: string): Promise<string> {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.verifyEmail(id, hash)
      return response.message
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function resendVerification(): Promise<string> {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.resendVerification()
      return response.message
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    isEmailVerified,
    restoreSession,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
  }
})
