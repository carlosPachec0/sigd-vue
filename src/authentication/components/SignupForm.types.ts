import type { SignupDto } from '../types/auth.dto'
import type { HttpError } from '@/shared/api/http-error'

export interface SignupFormProps {
  isLoading?: boolean
  error?: HttpError | null
}

export interface SignupFormEmits {
  submit: [payload: SignupDto]
}
