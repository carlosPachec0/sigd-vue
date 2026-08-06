import { BaseHttpService } from '@/shared/api/base-http-service'
import type { PaymentDto, CreatePaymentDto, UpdatePaymentDto } from '../types/payment.dto'

class PaymentService extends BaseHttpService {
  private readonly resource = '/api/v1/payments'

  getAll(studentId?: number): Promise<PaymentDto[]> {
    const params = studentId ? { student_id: studentId } : undefined
    return this.get<PaymentDto[]>(this.resource, { params })
  }

  getById(id: string): Promise<PaymentDto> {
    return this.get<PaymentDto>(`${this.resource}/${id}`)
  }

  create(payload: CreatePaymentDto): Promise<PaymentDto> {
    return this.post<PaymentDto, CreatePaymentDto>(this.resource, payload)
  }

  update(id: string, payload: UpdatePaymentDto): Promise<PaymentDto> {
    return this.patch<PaymentDto, UpdatePaymentDto>(`${this.resource}/${id}`, payload)
  }

  remove(id: string): Promise<void> {
    return this.delete<void>(`${this.resource}/${id}`)
  }
}

export const paymentService = new PaymentService()
