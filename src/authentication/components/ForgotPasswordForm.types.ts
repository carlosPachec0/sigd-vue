import type { HttpError } from '@/shared/api/http-error'

export interface ForgotPasswordFormProps {
  isLoading?: boolean
  error?: HttpError | null
}

export interface ForgotPasswordFormEmits {
  submit: [email: string]
}
