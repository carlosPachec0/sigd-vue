import { defineStore } from 'pinia'
import { ref } from 'vue'
import { paymentService } from '../services/payment.service'
import { HttpError, normalizeError } from '@/shared/api/http-error'
import type { PaymentDto, CreatePaymentDto, UpdatePaymentDto } from '../types/payment.dto'

export const usePaymentStore = defineStore('payment', () => {
  const payments = ref<PaymentDto[]>([])
  const isLoading = ref(false)
  const error = ref<HttpError | null>(null)

  async function load(studentId?: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      payments.value = await paymentService.getAll(studentId)
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      if (httpError.status === 404) {
        payments.value = []
        return
      }
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function create(payload: CreatePaymentDto): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const created = await paymentService.create(payload)
      payments.value.push(created)
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function update(id: string, payload: UpdatePaymentDto): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const updated = await paymentService.update(id, payload)
      const index = payments.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        payments.value[index] = updated
      }
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function remove(id: string): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      await paymentService.remove(id)
      payments.value = payments.value.filter((p) => p.id !== id)
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return { payments, isLoading, error, load, create, update, remove }
})
