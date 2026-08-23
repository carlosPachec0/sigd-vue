import { defineStore } from 'pinia'
import { ref } from 'vue'
import { paymentService } from '../services/payment.service'
import { HttpError, normalizeError } from '@/shared/api/http-error'
import type { PaymentDto, CreatePaymentDto, UpdatePaymentDto } from '../types/payment.dto'

export const usePaymentStore = defineStore('payment', () => {
  const payments = ref<PaymentDto[]>([])
  const isLoading = ref(false)
  const error = ref<HttpError | null>(null)

  async function load(academyId: number, studentId: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      payments.value = await paymentService.getAll(academyId, studentId)
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

  async function getById(academyId: number, studentId: number, paymentId: string): Promise<PaymentDto> {
    isLoading.value = true
    error.value = null
    try {
      return await paymentService.getById(academyId, studentId, paymentId)
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function create(academyId: number, studentId: number, payload: CreatePaymentDto): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const created = await paymentService.create(academyId, studentId, payload)
      payments.value.push(created)
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
    paymentId: string,
    payload: UpdatePaymentDto,
  ): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const updated = await paymentService.update(academyId, studentId, paymentId, payload)
      const index = payments.value.findIndex((p) => p.id === paymentId)
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

  async function remove(academyId: number, studentId: number, paymentId: string): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      await paymentService.remove(academyId, studentId, paymentId)
      payments.value = payments.value.filter((p) => p.id !== paymentId)
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return { payments, isLoading, error, load, getById, create, update, remove }
})
