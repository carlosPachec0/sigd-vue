import { defineStore } from 'pinia'
import { ref } from 'vue'
import { profileService } from '../services/profile.service'
import { HttpError, normalizeError } from '@/shared/api/http-error'
import type { ProfileDto, UpdateProfileDto, ChangePasswordDto } from '../types/profile.dto'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<ProfileDto | null>(null)
  const isLoading = ref(false)
  const error = ref<HttpError | null>(null)

  async function fetchProfile(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await profileService.getProfile()
      profile.value = response.data
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(payload: UpdateProfileDto): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await profileService.updateProfile(payload)
      profile.value = response.data
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function changePassword(payload: ChangePasswordDto): Promise<string> {
    isLoading.value = true
    error.value = null
    try {
      const response = await profileService.changePassword(payload)
      return response.message
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  return { profile, isLoading, error, fetchProfile, updateProfile, changePassword }
})
