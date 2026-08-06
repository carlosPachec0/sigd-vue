import { BaseHttpService } from '@/shared/api/base-http-service'
import type { AcademyDto, CreateAcademyDto, UpdateAcademyDto } from '../types/academy.dto'

class AcademyService extends BaseHttpService {
  private readonly resource = '/api/v1/academies'

  getAll(): Promise<AcademyDto[]> {
    return this.get<AcademyDto[]>(this.resource)
  }

  getById(id: number): Promise<AcademyDto> {
    return this.get<AcademyDto>(`${this.resource}/${id}`)
  }

  create(payload: CreateAcademyDto): Promise<AcademyDto> {
    return this.post<AcademyDto, CreateAcademyDto>(this.resource, payload)
  }

  update(id: number, payload: UpdateAcademyDto): Promise<AcademyDto> {
    return this.patch<AcademyDto, UpdateAcademyDto>(`${this.resource}/${id}`, payload)
  }

  remove(id: number): Promise<void> {
    return this.delete<void>(`${this.resource}/${id}`)
  }
}

export const academyService = new AcademyService()
