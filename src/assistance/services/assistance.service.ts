import { BaseHttpService } from '@/shared/api/base-http-service'
import type { AssistanceDto, CreateAssistanceDto, UpdateAssistanceDto } from '../types/assistance.dto'

class AssistanceService extends BaseHttpService {
  private basePath(academyId: number, studentId: number): string {
    return `/api/v1/academies/${academyId}/students/${studentId}/assistance`
  }

  async getAll(academyId: number, studentId: number): Promise<AssistanceDto[]> {
    const envelope = await this.get<AssistanceDto[]>(this.basePath(academyId, studentId))
    return envelope.data ?? []
  }

  async getById(academyId: number, studentId: number, assistanceId: string): Promise<AssistanceDto> {
    const envelope = await this.get<AssistanceDto>(
      `${this.basePath(academyId, studentId)}/${assistanceId}`,
    )
    return envelope.data
  }

  async create(
    academyId: number,
    studentId: number,
    payload: CreateAssistanceDto,
  ): Promise<AssistanceDto> {
    const envelope = await this.post<AssistanceDto, CreateAssistanceDto>(
      this.basePath(academyId, studentId),
      payload,
    )
    return envelope.data
  }

  async update(
    academyId: number,
    studentId: number,
    assistanceId: string,
    payload: UpdateAssistanceDto,
  ): Promise<AssistanceDto> {
    const envelope = await this.put<AssistanceDto, UpdateAssistanceDto>(
      `${this.basePath(academyId, studentId)}/${assistanceId}`,
      payload,
    )
    return envelope.data
  }

  async remove(academyId: number, studentId: number, assistanceId: string): Promise<void> {
    await this.delete<void>(`${this.basePath(academyId, studentId)}/${assistanceId}`)
  }
}

export const assistanceService = new AssistanceService()