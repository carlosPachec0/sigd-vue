import { BaseHttpService } from '@/shared/api/base-http-service'
import type { ApiEnvelope } from '@/shared/api/base-http-service'
import type { ProfileDto, UpdateProfileDto, ChangePasswordDto } from '../types/profile.dto'

class ProfileService extends BaseHttpService {
  private readonly resource = '/api/v1/profile'

  getProfile(): Promise<ApiEnvelope<ProfileDto>> {
    return this.get<ProfileDto>(this.resource)
  }

  updateProfile(payload: UpdateProfileDto): Promise<ApiEnvelope<ProfileDto>> {
    return this.put<ProfileDto, UpdateProfileDto>(this.resource, payload)
  }

  changePassword(payload: ChangePasswordDto): Promise<ApiEnvelope<null>> {
    return this.put<null, ChangePasswordDto>(`${this.resource}/password`, payload)
  }
}

export const profileService = new ProfileService()