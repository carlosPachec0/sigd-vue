import type { LoginDto } from '../types/auth.dto'
import type { HttpError } from '@/shared/api/http-error'

export interface LoginFormProps {
  isLoading?: boolean
  error?: HttpError | null
}

export interface LoginFormEmits {
  submit: [payload: LoginDto]
}
