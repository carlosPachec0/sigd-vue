import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAssistanceStore } from '@/assistance/stores/assistance.store'

vi.mock('@/assistance/services/assistance.service', () => ({
  assistanceService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import { assistanceService } from '@/assistance/services/assistance.service'

describe('AssistanceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('starts with empty records', () => {
    const store = useAssistanceStore()

    expect(store.records).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('load fetches records for student', async () => {
    const mockRecords = [
      {
        id: '1',
        student_id: '1',
        date: '2026-08-20',
        created_at: '2026-08-20T00:00:00.000000Z',
        updated_at: '2026-08-20T00:00:00.000000Z',
      },
    ]
    vi.mocked(assistanceService.getAll).mockResolvedValue(mockRecords)

    const store = useAssistanceStore()
    await store.load(1, 1)

    expect(assistanceService.getAll).toHaveBeenCalledWith(1, 1)
    expect(store.records).toEqual(mockRecords)
  })

  it('load sets empty array on 404', async () => {
    const { HttpError } = await import('@/shared/api/http-error')
    vi.mocked(assistanceService.getAll).mockRejectedValue(
      new HttpError('Not found', 404, null, null),
    )

    const store = useAssistanceStore()
    await store.load(1, 1)

    expect(store.records).toEqual([])
    expect(store.error).toBeNull()
  })

  it('load sets error on failure', async () => {
    const { HttpError } = await import('@/shared/api/http-error')
    vi.mocked(assistanceService.getAll).mockRejectedValue(
      new HttpError('Server error', 500, null, null),
    )

    const store = useAssistanceStore()
    await expect(store.load(1, 1)).rejects.toThrow()

    expect(store.error).not.toBeNull()
    expect(store.error?.status).toBe(500)
  })

  it('getById returns record', async () => {
    const mockRecord = {
      id: '1',
      student_id: '1',
      date: '2026-08-20',
      created_at: '2026-08-20T00:00:00.000000Z',
      updated_at: '2026-08-20T00:00:00.000000Z',
    }
    vi.mocked(assistanceService.getById).mockResolvedValue(mockRecord)

    const store = useAssistanceStore()
    const result = await store.getById(1, 1, '1')

    expect(assistanceService.getById).toHaveBeenCalledWith(1, 1, '1')
    expect(result).toEqual(mockRecord)
  })

  it('create adds record to list', async () => {
    const mockRecord = {
      id: '1',
      student_id: '1',
      date: '2026-08-20',
      created_at: '2026-08-20T00:00:00.000000Z',
      updated_at: '2026-08-20T00:00:00.000000Z',
    }
    vi.mocked(assistanceService.create).mockResolvedValue(mockRecord)

    const store = useAssistanceStore()
    await store.create(1, 1, { date: '2026-08-20' })

    expect(assistanceService.create).toHaveBeenCalledWith(1, 1, { date: '2026-08-20' })
    expect(store.records).toHaveLength(1)
    expect(store.records[0].date).toBe('2026-08-20')
  })

  it('create sets error on duplicate (409)', async () => {
    const { HttpError } = await import('@/shared/api/http-error')
    vi.mocked(assistanceService.create).mockRejectedValue(
      new HttpError('Already exists', 409, null, null),
    )

    const store = useAssistanceStore()
    await expect(store.create(1, 1, { date: '2026-08-20' })).rejects.toThrow()

    expect(store.error).not.toBeNull()
    expect(store.error?.status).toBe(409)
    expect(store.records).toHaveLength(0)
  })

  it('update modifies record in list', async () => {
    const existing = {
      id: '1',
      student_id: '1',
      date: '2026-08-20',
      created_at: '2026-08-20T00:00:00.000000Z',
      updated_at: '2026-08-20T00:00:00.000000Z',
    }
    const updated = { ...existing, date: '2026-08-21' }
    vi.mocked(assistanceService.getAll).mockResolvedValue([existing])
    vi.mocked(assistanceService.update).mockResolvedValue(updated)

    const store = useAssistanceStore()
    await store.load(1, 1)
    await store.update(1, 1, '1', { date: '2026-08-21' })

    expect(assistanceService.update).toHaveBeenCalledWith(1, 1, '1', { date: '2026-08-21' })
    expect(store.records[0].date).toBe('2026-08-21')
  })

  it('remove deletes record from list', async () => {
    const existing = {
      id: '1',
      student_id: '1',
      date: '2026-08-20',
      created_at: '2026-08-20T00:00:00.000000Z',
      updated_at: '2026-08-20T00:00:00.000000Z',
    }
    vi.mocked(assistanceService.getAll).mockResolvedValue([existing])
    vi.mocked(assistanceService.remove).mockResolvedValue(undefined as never)

    const store = useAssistanceStore()
    await store.load(1, 1)
    await store.remove(1, 1, '1')

    expect(assistanceService.remove).toHaveBeenCalledWith(1, 1, '1')
    expect(store.records).toHaveLength(0)
  })
})