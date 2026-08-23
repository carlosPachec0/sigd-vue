import { BaseHttpService } from '@/shared/api/base-http-service'
import type { StudentDto, CreateStudentDto, UpdateStudentDto } from '../types/student.dto'

class StudentService extends BaseHttpService {
  async getAll(academyId: number): Promise<StudentDto[]> {
    const envelope = await this.get<StudentDto[]>(`/api/v1/academies/${academyId}/students`)
    return envelope.data ?? []
  }

  async getById(academyId: number, studentId: number): Promise<StudentDto> {
    const envelope = await this.get<StudentDto>(
      `/api/v1/academies/${academyId}/students/${studentId}`,
    )
    return envelope.data
  }

  async create(academyId: number, payload: CreateStudentDto): Promise<StudentDto> {
    const envelope = await this.post<StudentDto, CreateStudentDto>(
      `/api/v1/academies/${academyId}/students`,
      payload,
    )
    return envelope.data
  }

  async update(
    academyId: number,
    studentId: number,
    payload: UpdateStudentDto,
  ): Promise<StudentDto> {
    const envelope = await this.put<StudentDto, UpdateStudentDto>(
      `/api/v1/academies/${academyId}/students/${studentId}`,
      payload,
    )
    return envelope.data
  }

  async remove(academyId: number, studentId: number): Promise<void> {
    await this.delete<void>(`/api/v1/academies/${academyId}/students/${studentId}`)
  }
}

export const studentService = new StudentService()
