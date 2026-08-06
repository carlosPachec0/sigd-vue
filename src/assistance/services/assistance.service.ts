import { BaseHttpService } from '@/shared/api/base-http-service'
import type { AssistanceDto, CreateAssistanceDto } from '../types/assistance.dto'

class AssistanceService extends BaseHttpService {
  private readonly resource = '/api/v1/assistance'

  getAll(studentId?: number, date?: string): Promise<AssistanceDto[]> {
    const params: Record<string, string | number> = {}
    if (studentId) params.student_id = studentId
    if (date) params.date = date
    return this.get<AssistanceDto[]>(this.resource, { params: Object.keys(params).length ? params : undefined })
  }

  getById(id: number): Promise<AssistanceDto> {
    return this.get<AssistanceDto>(`${this.resource}/${id}`)
  }

  create(payload: CreateAssistanceDto): Promise<AssistanceDto> {
    return this.post<AssistanceDto, CreateAssistanceDto>(this.resource, payload)
  }

  remove(id: number): Promise<void> {
    return this.delete<void>(`${this.resource}/${id}`)
  }
}

export const assistanceService = new AssistanceService()
