export interface ProfileDto {
  id: string
  email: string
  name: string
  email_verified_at: string | null
}

export interface UpdateProfileDto {
  name: string
  email: string
}

export interface ChangePasswordDto {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

export interface ProfileResponseDto {
  message: string
  data: ProfileDto
  status: number
  errors: string[]
}

export interface MessageResponseDto {
  message: string
  data: null
  status: number
  errors: string[]
}
