import { BaseHttpService } from '@/shared/api/base-http-service'
import type { PaymentDto, CreatePaymentDto, UpdatePaymentDto } from '../types/payment.dto'

class PaymentService extends BaseHttpService {
  private basePath(academyId: number, studentId: number): string {
    return `/api/v1/academies/${academyId}/students/${studentId}/payments`
  }

  async getAll(academyId: number, studentId: number): Promise<PaymentDto[]> {
    const envelope = await this.get<PaymentDto[]>(this.basePath(academyId, studentId))
    return envelope.data ?? []
  }

  async getById(academyId: number, studentId: number, paymentId: string): Promise<PaymentDto> {
    const envelope = await this.get<PaymentDto>(
      `${this.basePath(academyId, studentId)}/${paymentId}`,
    )
    return envelope.data
  }

  async create(
    academyId: number,
    studentId: number,
    payload: CreatePaymentDto,
  ): Promise<PaymentDto> {
    const envelope = await this.post<PaymentDto, CreatePaymentDto>(
      this.basePath(academyId, studentId),
      payload,
    )
    return envelope.data
  }

  async update(
    academyId: number,
    studentId: number,
    paymentId: string,
    payload: UpdatePaymentDto,
  ): Promise<PaymentDto> {
    const envelope = await this.put<PaymentDto, UpdatePaymentDto>(
      `${this.basePath(academyId, studentId)}/${paymentId}`,
      payload,
    )
    return envelope.data
  }

  async remove(academyId: number, studentId: number, paymentId: string): Promise<void> {
    await this.delete<void>(`${this.basePath(academyId, studentId)}/${paymentId}`)
  }
}

export const paymentService = new PaymentService()
