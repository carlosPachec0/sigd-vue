import { defineStore } from 'pinia'
import { ref } from 'vue'
import { studentService } from '../services/student.service'
import { HttpError, normalizeError } from '@/shared/api/http-error'
import type { StudentDto, CreateStudentDto, UpdateStudentDto } from '../types/student.dto'

export const useStudentStore = defineStore('student', () => {
  const students = ref<StudentDto[]>([])
  const isLoading = ref(false)
  const error = ref<HttpError | null>(null)

  async function load(academyId: number): Promise<void> {
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

  async function getById(academyId: number, studentId: number): Promise<StudentDto> {
    isLoading.value = true
    error.value = null
    try {
      return await studentService.getById(academyId, studentId)
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function create(academyId: number, payload: CreateStudentDto): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const created = await studentService.create(academyId, payload)
      students.value.push(created)
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function update(academyId: number, studentId: number, payload: UpdateStudentDto): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const updated = await studentService.update(academyId, studentId, payload)
      const index = students.value.findIndex((s) => s.id === studentId)
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

  async function remove(academyId: number, studentId: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      await studentService.remove(academyId, studentId)
      students.value = students.value.filter((s) => s.id !== studentId)
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return { students, isLoading, error, load, getById, create, update, remove }
})
