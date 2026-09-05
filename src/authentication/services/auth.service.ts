import { BaseHttpService } from '@/shared/api/base-http-service'
import type { ApiEnvelope } from '@/shared/api/base-http-service'
import type { UserDto, LoginDto, SignupDto, ForgotPasswordDto, ResetPasswordDto } from '../types/auth.dto'

type AuthData = UserDto & { token: string }

class AuthService extends BaseHttpService {
  private readonly resource = '/api/v1/auth'

  login(payload: LoginDto): Promise<ApiEnvelope<AuthData>> {
    return this.post<AuthData, LoginDto>(`${this.resource}/login`, payload)
  }

  signup(payload: SignupDto): Promise<ApiEnvelope<AuthData>> {
    return this.post<AuthData, SignupDto>(`${this.resource}/signup`, payload)
  }

  logout(): Promise<ApiEnvelope<null>> {
    return this.post<null>(`${this.resource}/logout`)
  }

  forgotPassword(payload: ForgotPasswordDto): Promise<ApiEnvelope<null>> {
    return this.post<null, ForgotPasswordDto>(`${this.resource}/forgot-password`, payload)
  }

  resetPassword(payload: ResetPasswordDto): Promise<ApiEnvelope<null>> {
    return this.post<null, ResetPasswordDto>(`${this.resource}/reset-password`, payload)
  }

  verifyEmail(id: string, hash: string): Promise<ApiEnvelope<null>> {
    return this.get<null>(`${this.resource}/email/verify/${id}/${hash}`)
  }

  resendVerification(): Promise<ApiEnvelope<null>> {
    return this.post<null>(`${this.resource}/email/verification-notification`)
  }
}

export const authService = new AuthService()