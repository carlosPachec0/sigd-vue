import { defineStore } from 'pinia'
import { ref } from 'vue'
import { assistanceService } from '../services/assistance.service'
import { HttpError, normalizeError } from '@/shared/api/http-error'
import type { AssistanceDto, CreateAssistanceDto } from '../types/assistance.dto'

export const useAssistanceStore = defineStore('assistance', () => {
  const records = ref<AssistanceDto[]>([])
  const isLoading = ref(false)
  const error = ref<HttpError | null>(null)

  async function load(studentId?: number, date?: string): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      records.value = await assistanceService.getAll(studentId, date)
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      if (httpError.status === 404) {
        records.value = []
        return
      }
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function create(payload: CreateAssistanceDto): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const created = await assistanceService.create(payload)
      records.value.push(created)
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
      await assistanceService.remove(id)
      records.value = records.value.filter((r) => r.id !== id)
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return { records, isLoading, error, load, create, remove }
})
