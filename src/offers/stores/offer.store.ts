import { defineStore } from 'pinia'
import { ref } from 'vue'
import { offerService } from '../services/offer.service'
import { HttpError, normalizeError } from '@/shared/api/http-error'
import type { OfferDto, CreateOfferDto, UpdateOfferDto } from '../types/offer.dto'

export const useOfferStore = defineStore('offer', () => {
  const offers = ref<OfferDto[]>([])
  const isLoading = ref(false)
  const error = ref<HttpError | null>(null)

  async function load(academyId?: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      offers.value = await offerService.getAll(academyId)
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      if (httpError.status === 404) {
        offers.value = []
        return
      }
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function create(payload: CreateOfferDto): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const created = await offerService.create(payload)
      offers.value.push(created)
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function update(id: number, payload: UpdateOfferDto): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const updated = await offerService.update(id, payload)
      const index = offers.value.findIndex((o) => o.id === id)
      if (index !== -1) {
        offers.value[index] = updated
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
      await offerService.remove(id)
      offers.value = offers.value.filter((o) => o.id !== id)
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return { offers, isLoading, error, load, create, update, remove }
})
