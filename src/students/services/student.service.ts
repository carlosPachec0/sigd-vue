import { BaseHttpService } from '@/shared/api/base-http-service'
import type { StudentDto, CreateStudentDto, UpdateStudentDto } from '../types/student.dto'

class StudentService extends BaseHttpService {
  private readonly resource = '/api/v1/students'

  getAll(academyId?: number): Promise<StudentDto[]> {
    const params = academyId ? { academy_id: academyId } : undefined
    return this.get<StudentDto[]>(this.resource, { params })
  }

  getById(id: number): Promise<StudentDto> {
    return this.get<StudentDto>(`${this.resource}/${id}`)
  }

  create(payload: CreateStudentDto): Promise<StudentDto> {
    return this.post<StudentDto, CreateStudentDto>(this.resource, payload)
  }

  update(id: number, payload: UpdateStudentDto): Promise<StudentDto> {
    return this.patch<StudentDto, UpdateStudentDto>(`${this.resource}/${id}`, payload)
  }

  remove(id: number): Promise<void> {
    return this.delete<void>(`${this.resource}/${id}`)
  }
}

export const studentService = new StudentService()
