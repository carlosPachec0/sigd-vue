import type { ChangePasswordDto } from '../types/profile.dto'
import type { HttpError } from '@/shared/api/http-error'

export interface ChangePasswordFormProps {
  isLoading?: boolean
  error?: HttpError | null
}

export interface ChangePasswordFormEmits {
  submit: [payload: ChangePasswordDto]
}
