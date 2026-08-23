import { defineStore } from 'pinia'
import { ref } from 'vue'
import { academyService } from '../services/academy.service'
import { HttpError, normalizeError } from '@/shared/api/http-error'
import type { AcademyDto, CreateAcademyDto, UpdateAcademyDto } from '../types/academy.dto'

export const useAcademyStore = defineStore('academy', () => {
  const academies = ref<AcademyDto[]>([])
  const isLoading = ref(false)
  const error = ref<HttpError | null>(null)

  async function load(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      academies.value = await academyService.getAll()
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      if (httpError.status === 404) {
        academies.value = []
        return
      }
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function getById(id: number): Promise<AcademyDto> {
    isLoading.value = true
    error.value = null
    try {
      return await academyService.getById(id)
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function create(payload: CreateAcademyDto): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const created = await academyService.create(payload)
      academies.value.push(created)
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function update(id: number, payload: UpdateAcademyDto): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const updated = await academyService.update(id, payload)
      const index = academies.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        academies.value[index] = updated
      }
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function remove(id: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      await academyService.remove(id)
      academies.value = academies.value.filter((a) => a.id !== id)
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return { academies, isLoading, error, load, getById, create, update, remove }
})
