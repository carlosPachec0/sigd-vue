export interface UserDto {
  id: string
  email: string
  name: string
  email_verified_at: string | null
}

export interface AuthResponseDto {
  message: string
  data: UserDto & { token: string }
  status: number
  errors: string[]
}

export interface LoginDto {
  email: string
  password: string
}

export interface SignupDto {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  email: string
  token: string
  password: string
  password_confirmation: string
}

export interface MessageResponseDto {
  message: string
  data: null
  status: number
  errors: string[]
}
