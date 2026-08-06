import { BaseHttpService } from '@/shared/api/base-http-service'
import type { OfferDto, CreateOfferDto, UpdateOfferDto } from '../types/offer.dto'

class OfferService extends BaseHttpService {
  private readonly resource = '/api/v1/offers'

  getAll(academyId?: number): Promise<OfferDto[]> {
    const params = academyId ? { academy_id: academyId } : undefined
    return this.get<OfferDto[]>(this.resource, { params })
  }

  getById(id: number): Promise<OfferDto> {
    return this.get<OfferDto>(`${this.resource}/${id}`)
  }

  create(payload: CreateOfferDto): Promise<OfferDto> {
    return this.post<OfferDto, CreateOfferDto>(this.resource, payload)
  }

  update(id: number, payload: UpdateOfferDto): Promise<OfferDto> {
    return this.patch<OfferDto, UpdateOfferDto>(`${this.resource}/${id}`, payload)
  }

  remove(id: number): Promise<void> {
    return this.delete<void>(`${this.resource}/${id}`)
  }
}

export const offerService = new OfferService()
