import { BaseHttpService } from '@/shared/api/base-http-service'
import type { OfferDto, CreateOfferDto, UpdateOfferDto } from '../types/offer.dto'

class OfferService extends BaseHttpService {
  private readonly resource = '/api/v1/offers'

  async getAll(academyId?: number): Promise<OfferDto[]> {
    const params = academyId ? { academy_id: academyId } : undefined
    const envelope = await this.get<OfferDto[]>(this.resource, { params })
    return envelope.data ?? []
  }

  async getById(id: number): Promise<OfferDto> {
    const envelope = await this.get<OfferDto>(`${this.resource}/${id}`)
    return envelope.data
  }

  async create(payload: CreateOfferDto): Promise<OfferDto> {
    const envelope = await this.post<OfferDto, CreateOfferDto>(this.resource, payload)
    return envelope.data
  }

  async update(id: number, payload: UpdateOfferDto): Promise<OfferDto> {
    const envelope = await this.patch<OfferDto, UpdateOfferDto>(`${this.resource}/${id}`, payload)
    return envelope.data
  }

  async remove(id: number): Promise<void> {
    await this.delete<void>(`${this.resource}/${id}`)
  }
}

export const offerService = new OfferService()