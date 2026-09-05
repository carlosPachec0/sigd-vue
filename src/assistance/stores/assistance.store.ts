import { defineStore } from 'pinia'
import { ref } from 'vue'
import { assistanceService } from '../services/assistance.service'
import { HttpError, normalizeError } from '@/shared/api/http-error'
import type { AssistanceDto, CreateAssistanceDto, UpdateAssistanceDto } from '../types/assistance.dto'

export const useAssistanceStore = defineStore('assistance', () => {
  const records = ref<AssistanceDto[]>([])
  const isLoading = ref(false)
  const error = ref<HttpError | null>(null)

  async function load(academyId: number, studentId: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      records.value = await assistanceService.getAll(academyId, studentId)
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

  async function getById(
    academyId: number,
    studentId: number,
    assistanceId: string,
  ): Promise<AssistanceDto> {
    isLoading.value = true
    error.value = null
    try {
      return await assistanceService.getById(academyId, studentId, assistanceId)
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function create(
    academyId: number,
    studentId: number,
    payload: CreateAssistanceDto,
  ): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const created = await assistanceService.create(academyId, studentId, payload)
      records.value.push(created)
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function update(
    academyId: number,
    studentId: number,
    assistanceId: string,
    payload: UpdateAssistanceDto,
  ): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const updated = await assistanceService.update(academyId, studentId, assistanceId, payload)
      const index = records.value.findIndex((r) => r.id === assistanceId)
      if (index !== -1) {
        records.value[index] = updated
      }
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function remove(
    academyId: number,
    studentId: number,
    assistanceId: string,
  ): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      await assistanceService.remove(academyId, studentId, assistanceId)
      records.value = records.value.filter((r) => r.id !== assistanceId)
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return { records, isLoading, error, load, getById, create, update, remove }
})