import type { HttpError } from '@/shared/api/http-error'

export interface ResetPasswordFormProps {
  isLoading?: boolean
  error?: HttpError | null
  token: string
  email: string
}

export interface ResetPasswordFormEmits {
  submit: [payload: { email: string; token: string; password: string; password_confirmation: string }]
}
