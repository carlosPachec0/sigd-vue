import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAcademyStore } from '@/academies/stores/academy.store'

vi.mock('@/academies/services/academy.service', () => ({
  academyService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import { academyService } from '@/academies/services/academy.service'

describe('AcademyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('starts with empty academies', () => {
    const store = useAcademyStore()

    expect(store.academies).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('load fetches academies on success', async () => {
    const mockAcademies = [
      {
        id: 1,
        user_id: '1',
        name: 'Judo Club',
        discipline: 'Judo',
        registration_fee: 50,
        monthly_fee: 25,
        class_fee: 10,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      },
    ]
    vi.mocked(academyService.getAll).mockResolvedValue(mockAcademies)

    const store = useAcademyStore()
    await store.load()

    expect(store.academies).toEqual(mockAcademies)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('load sets empty array on 404', async () => {
    const { HttpError } = await import('@/shared/api/http-error')
    vi.mocked(academyService.getAll).mockRejectedValue(
      new HttpError('Not found', 404, null, null),
    )

    const store = useAcademyStore()
    await store.load()

    expect(store.academies).toEqual([])
    expect(store.error).toBeNull()
  })

  it('load sets error on failure', async () => {
    const { HttpError } = await import('@/shared/api/http-error')
    vi.mocked(academyService.getAll).mockRejectedValue(
      new HttpError('Server error', 500, null, null),
    )

    const store = useAcademyStore()
    await expect(store.load()).rejects.toThrow()

    expect(store.error).not.toBeNull()
    expect(store.error?.status).toBe(500)
  })

  it('getById returns academy', async () => {
    const mockAcademy = {
      id: 1,
      user_id: '1',
      name: 'Judo Club',
      discipline: 'Judo',
      registration_fee: 50,
      monthly_fee: 25,
      class_fee: 10,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    }
    vi.mocked(academyService.getById).mockResolvedValue(mockAcademy)

    const store = useAcademyStore()
    const result = await store.getById(1)

    expect(result).toEqual(mockAcademy)
  })

  it('create adds academy to list', async () => {
    const mockAcademy = {
      id: 1,
      user_id: '1',
      name: 'New Club',
      discipline: 'Karate',
      registration_fee: 60,
      monthly_fee: 30,
      class_fee: 15,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    }
    vi.mocked(academyService.create).mockResolvedValue(mockAcademy)

    const store = useAcademyStore()
    await store.create({
      name: 'New Club',
      discipline: 'Karate',
      registration_fee: 60,
      monthly_fee: 30,
      class_fee: 15,
    })

    expect(store.academies).toHaveLength(1)
    expect(store.academies[0].name).toBe('New Club')
  })

  it('update modifies academy in list', async () => {
    const existing = {
      id: 1,
      user_id: '1',
      name: 'Old Name',
      discipline: 'Judo',
      registration_fee: 50,
      monthly_fee: 25,
      class_fee: 10,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    }
    const updated = { ...existing, name: 'New Name' }
    vi.mocked(academyService.getAll).mockResolvedValue([existing])
    vi.mocked(academyService.update).mockResolvedValue(updated)

    const store = useAcademyStore()
    await store.load()
    await store.update(1, { name: 'New Name' })

    expect(store.academies[0].name).toBe('New Name')
  })

  it('remove deletes academy from list', async () => {
    const existing = {
      id: 1,
      user_id: '1',
      name: 'To Delete',
      discipline: 'Judo',
      registration_fee: 50,
      monthly_fee: 25,
      class_fee: 10,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    }
    vi.mocked(academyService.getAll).mockResolvedValue([existing])
    vi.mocked(academyService.remove).mockResolvedValue(undefined as never)

    const store = useAcademyStore()
    await store.load()
    await store.remove(1)

    expect(store.academies).toHaveLength(0)
  })
})
