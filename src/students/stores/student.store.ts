import { defineStore } from 'pinia'
import { ref } from 'vue'
import { studentService } from '../services/student.service'
import { HttpError, normalizeError } from '@/shared/api/http-error'
import type { StudentDto, CreateStudentDto, UpdateStudentDto } from '../types/student.dto'

export const useStudentStore = defineStore('student', () => {
  const students = ref<StudentDto[]>([])
  const isLoading = ref(false)
  const error = ref<HttpError | null>(null)

  async function load(academyId?: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      students.value = await studentService.getAll(academyId)
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      if (httpError.status === 404) {
        students.value = []
        return
      }
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function create(payload: CreateStudentDto): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const created = await studentService.create(payload)
      students.value.push(created)
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function update(id: number, payload: UpdateStudentDto): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const updated = await studentService.update(id, payload)
      const index = students.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        students.value[index] = updated
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
      await studentService.remove(id)
      students.value = students.value.filter((s) => s.id !== id)
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return { students, isLoading, error, load, create, update, remove }
})
