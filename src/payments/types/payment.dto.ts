export interface PaymentDto {
  id: string
  student_id: string
  subject: string
  amount: string
  created_at: string | null
  updated_at: string | null
}

export interface CreatePaymentDto {
  subject: string
  amount: number
}

export interface UpdatePaymentDto {
  subject?: string
  amount?: number
}
