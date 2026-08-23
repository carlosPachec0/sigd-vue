import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useStudentStore } from '@/students/stores/student.store'

vi.mock('@/students/services/student.service', () => ({
  studentService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import { studentService } from '@/students/services/student.service'

describe('StudentStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('starts with empty students', () => {
    const store = useStudentStore()

    expect(store.students).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('load fetches students for academy', async () => {
    const mockStudents = [
      {
        id: 1,
        academy_id: 1,
        name: 'John Doe',
        gender: 'Male' as const,
        birth_date: '2010-05-10',
        height: 1.65,
        weight: 55,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      },
    ]
    vi.mocked(studentService.getAll).mockResolvedValue(mockStudents)

    const store = useStudentStore()
    await store.load(1)

    expect(studentService.getAll).toHaveBeenCalledWith(1)
    expect(store.students).toEqual(mockStudents)
  })

  it('load sets empty array on 404', async () => {
    const { HttpError } = await import('@/shared/api/http-error')
    vi.mocked(studentService.getAll).mockRejectedValue(
      new HttpError('Not found', 404, null, null),
    )

    const store = useStudentStore()
    await store.load(1)

    expect(store.students).toEqual([])
    expect(store.error).toBeNull()
  })

  it('getById returns student', async () => {
    const mockStudent = {
      id: 1,
      academy_id: 1,
      name: 'John Doe',
      gender: 'Male' as const,
      birth_date: '2010-05-10',
      height: 1.65,
      weight: 55,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    }
    vi.mocked(studentService.getById).mockResolvedValue(mockStudent)

    const store = useStudentStore()
    const result = await store.getById(1, 1)

    expect(studentService.getById).toHaveBeenCalledWith(1, 1)
    expect(result).toEqual(mockStudent)
  })

  it('create adds student to list', async () => {
    const mockStudent = {
      id: 1,
      academy_id: 1,
      name: 'New Student',
      gender: 'Female' as const,
      birth_date: '2012-08-20',
      height: 1.55,
      weight: 48,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    }
    vi.mocked(studentService.create).mockResolvedValue(mockStudent)

    const store = useStudentStore()
    await store.create(1, {
      name: 'New Student',
      gender: 'Female',
      birth_date: '2012-08-20',
      height: 1.55,
      weight: 48,
    })

    expect(studentService.create).toHaveBeenCalledWith(1, {
      name: 'New Student',
      gender: 'Female',
      birth_date: '2012-08-20',
      height: 1.55,
      weight: 48,
    })
    expect(store.students).toHaveLength(1)
    expect(store.students[0].name).toBe('New Student')
  })

  it('update modifies student in list', async () => {
    const existing = {
      id: 1,
      academy_id: 1,
      name: 'Old Name',
      gender: 'Male' as const,
      birth_date: '2010-05-10',
      height: 1.65,
      weight: 55,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    }
    const updated = { ...existing, name: 'New Name' }
    vi.mocked(studentService.getAll).mockResolvedValue([existing])
    vi.mocked(studentService.update).mockResolvedValue(updated)

    const store = useStudentStore()
    await store.load(1)
    await store.update(1, 1, { name: 'New Name' })

    expect(studentService.update).toHaveBeenCalledWith(1, 1, { name: 'New Name' })
    expect(store.students[0].name).toBe('New Name')
  })

  it('remove deletes student from list', async () => {
    const existing = {
      id: 1,
      academy_id: 1,
      name: 'To Delete',
      gender: 'Male' as const,
      birth_date: '2010-05-10',
      height: 1.65,
      weight: 55,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    }
    vi.mocked(studentService.getAll).mockResolvedValue([existing])
    vi.mocked(studentService.remove).mockResolvedValue(undefined as never)

    const store = useStudentStore()
    await store.load(1)
    await store.remove(1, 1)

    expect(studentService.remove).toHaveBeenCalledWith(1, 1)
    expect(store.students).toHaveLength(0)
  })
})
