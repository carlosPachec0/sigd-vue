export interface PaymentDto {
  id: string
  subject: string
  student_id: number
  amount: number
  created_at: string
  updated_at: string
}

export interface CreatePaymentDto {
  subject?: string
  student_id: number
  amount: number
}

export interface UpdatePaymentDto {
  subject?: string
  amount?: number
}
