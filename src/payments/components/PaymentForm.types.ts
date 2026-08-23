import type { PaymentDto } from '../types/payment.dto'

export interface PaymentFormProps {
  initialValues?: PaymentDto
  isLoading?: boolean
  submitLabel?: string
  errors?: Record<string, string[]>
}

export interface PaymentFormData {
  subject: string
  amount: number
}

export interface PaymentFormEmits {
  submit: [payload: PaymentFormData]
  cancel: []
}
