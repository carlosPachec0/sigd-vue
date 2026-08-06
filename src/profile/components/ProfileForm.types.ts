import type { ProfileDto, UpdateProfileDto } from '../types/profile.dto'
import type { HttpError } from '@/shared/api/http-error'

export interface ProfileFormProps {
  profile: ProfileDto | null
  isLoading?: boolean
  error?: HttpError | null
}

export interface ProfileFormEmits {
  submit: [payload: UpdateProfileDto]
}
