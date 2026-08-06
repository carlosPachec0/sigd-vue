import { BaseHttpService } from '@/shared/api/base-http-service'
import type {
  AuthResponseDto,
  LoginDto,
  SignupDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  MessageResponseDto,
} from '../types/auth.dto'

class AuthService extends BaseHttpService {
  private readonly resource = '/api/v1/auth'

  login(payload: LoginDto): Promise<AuthResponseDto> {
    return this.post<AuthResponseDto, LoginDto>(`${this.resource}/login`, payload)
  }

  signup(payload: SignupDto): Promise<AuthResponseDto> {
    return this.post<AuthResponseDto, SignupDto>(`${this.resource}/signup`, payload)
  }

  logout(): Promise<MessageResponseDto> {
    return this.post<MessageResponseDto>(`${this.resource}/logout`)
  }

  forgotPassword(payload: ForgotPasswordDto): Promise<MessageResponseDto> {
    return this.post<MessageResponseDto, ForgotPasswordDto>(
      `${this.resource}/forgot-password`,
      payload,
    )
  }

  resetPassword(payload: ResetPasswordDto): Promise<MessageResponseDto> {
    return this.post<MessageResponseDto, ResetPasswordDto>(
      `${this.resource}/reset-password`,
      payload,
    )
  }

  verifyEmail(id: string, hash: string): Promise<MessageResponseDto> {
    return this.get<MessageResponseDto>(`${this.resource}/email/verify/${id}/${hash}`)
  }

  resendVerification(): Promise<MessageResponseDto> {
    return this.post<MessageResponseDto>(`${this.resource}/email/verification-notification`)
  }
}

export const authService = new AuthService()
