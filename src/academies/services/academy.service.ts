import { BaseHttpService } from '@/shared/api/base-http-service'
import type { AcademyDto, CreateAcademyDto, UpdateAcademyDto } from '../types/academy.dto'

class AcademyService extends BaseHttpService {
  private readonly resource = '/api/v1/academies'

  async getAll(): Promise<AcademyDto[]> {
    const envelope = await this.get<AcademyDto[]>(this.resource)
    return envelope.data ?? []
  }

  async getById(id: number): Promise<AcademyDto> {
    const envelope = await this.get<AcademyDto>(`${this.resource}/${id}`)
    return envelope.data
  }

  async create(payload: CreateAcademyDto): Promise<AcademyDto> {
    const envelope = await this.post<AcademyDto, CreateAcademyDto>(this.resource, payload)
    return envelope.data
  }

  async update(id: number, payload: UpdateAcademyDto): Promise<AcademyDto> {
    const envelope = await this.put<AcademyDto, UpdateAcademyDto>(`${this.resource}/${id}`, payload)
    return envelope.data
  }

  async remove(id: number): Promise<void> {
    await this.delete<void>(`${this.resource}/${id}`)
  }
}

export const academyService = new AcademyService()
