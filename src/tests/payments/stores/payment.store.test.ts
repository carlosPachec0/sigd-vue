import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePaymentStore } from '@/payments/stores/payment.store'

vi.mock('@/payments/services/payment.service', () => ({
  paymentService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import { paymentService } from '@/payments/services/payment.service'

describe('PaymentStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('starts with empty payments', () => {
    const store = usePaymentStore()

    expect(store.payments).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('load fetches payments for student', async () => {
    const mockPayments = [
      {
        id: '1',
        student_id: '1',
        subject: 'Monthly Fee',
        amount: '25.00',
        created_at: '2026-01-01T00:00:00.000000Z',
        updated_at: '2026-01-01T00:00:00.000000Z',
      },
    ]
    vi.mocked(paymentService.getAll).mockResolvedValue(mockPayments)

    const store = usePaymentStore()
    await store.load(1, 1)

    expect(paymentService.getAll).toHaveBeenCalledWith(1, 1)
    expect(store.payments).toEqual(mockPayments)
  })

  it('load sets empty array on 404', async () => {
    const { HttpError } = await import('@/shared/api/http-error')
    vi.mocked(paymentService.getAll).mockRejectedValue(
      new HttpError('Not found', 404, null, null),
    )

    const store = usePaymentStore()
    await store.load(1, 1)

    expect(store.payments).toEqual([])
    expect(store.error).toBeNull()
  })

  it('load sets error on failure', async () => {
    const { HttpError } = await import('@/shared/api/http-error')
    vi.mocked(paymentService.getAll).mockRejectedValue(
      new HttpError('Server error', 500, null, null),
    )

    const store = usePaymentStore()
    await expect(store.load(1, 1)).rejects.toThrow()

    expect(store.error).not.toBeNull()
    expect(store.error?.status).toBe(500)
  })

  it('getById returns payment', async () => {
    const mockPayment = {
      id: '1',
      student_id: '1',
      subject: 'Monthly Fee',
      amount: '25.00',
      created_at: '2026-01-01T00:00:00.000000Z',
      updated_at: '2026-01-01T00:00:00.000000Z',
    }
    vi.mocked(paymentService.getById).mockResolvedValue(mockPayment)

    const store = usePaymentStore()
    const result = await store.getById(1, 1, '1')

    expect(paymentService.getById).toHaveBeenCalledWith(1, 1, '1')
    expect(result).toEqual(mockPayment)
  })

  it('create adds payment to list', async () => {
    const mockPayment = {
      id: '1',
      student_id: '1',
      subject: 'New Payment',
      amount: '30.00',
      created_at: '2026-01-01T00:00:00.000000Z',
      updated_at: '2026-01-01T00:00:00.000000Z',
    }
    vi.mocked(paymentService.create).mockResolvedValue(mockPayment)

    const store = usePaymentStore()
    await store.create(1, 1, { subject: 'New Payment', amount: 30 })

    expect(paymentService.create).toHaveBeenCalledWith(1, 1, { subject: 'New Payment', amount: 30 })
    expect(store.payments).toHaveLength(1)
    expect(store.payments[0].subject).toBe('New Payment')
  })

  it('create sets error on failure', async () => {
    const { HttpError } = await import('@/shared/api/http-error')
    vi.mocked(paymentService.create).mockRejectedValue(
      new HttpError('Validation error', 422, null, null),
    )

    const store = usePaymentStore()
    await expect(store.create(1, 1, { subject: 'Fail', amount: 0 })).rejects.toThrow()

    expect(store.error).not.toBeNull()
    expect(store.error?.status).toBe(422)
    expect(store.payments).toHaveLength(0)
  })

  it('update modifies payment in list', async () => {
    const existing = {
      id: '1',
      student_id: '1',
      subject: 'Old Subject',
      amount: '25.00',
      created_at: '2026-01-01T00:00:00.000000Z',
      updated_at: '2026-01-01T00:00:00.000000Z',
    }
    const updated = { ...existing, subject: 'New Subject' }
    vi.mocked(paymentService.getAll).mockResolvedValue([existing])
    vi.mocked(paymentService.update).mockResolvedValue(updated)

    const store = usePaymentStore()
    await store.load(1, 1)
    await store.update(1, 1, '1', { subject: 'New Subject' })

    expect(paymentService.update).toHaveBeenCalledWith(1, 1, '1', { subject: 'New Subject' })
    expect(store.payments[0].subject).toBe('New Subject')
  })

  it('remove deletes payment from list', async () => {
    const existing = {
      id: '1',
      student_id: '1',
      subject: 'To Delete',
      amount: '25.00',
      created_at: '2026-01-01T00:00:00.000000Z',
      updated_at: '2026-01-01T00:00:00.000000Z',
    }
    vi.mocked(paymentService.getAll).mockResolvedValue([existing])
    vi.mocked(paymentService.remove).mockResolvedValue(undefined as never)

    const store = usePaymentStore()
    await store.load(1, 1)
    await store.remove(1, 1, '1')

    expect(paymentService.remove).toHaveBeenCalledWith(1, 1, '1')
    expect(store.payments).toHaveLength(0)
  })
})
