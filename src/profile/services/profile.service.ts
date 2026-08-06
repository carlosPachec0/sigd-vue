import { BaseHttpService } from '@/shared/api/base-http-service'
import type {
  UpdateProfileDto,
  ChangePasswordDto,
  ProfileResponseDto,
  MessageResponseDto,
} from '../types/profile.dto'

class ProfileService extends BaseHttpService {
  private readonly resource = '/api/v1/profile'

  getProfile(): Promise<ProfileResponseDto> {
    return this.get<ProfileResponseDto>(this.resource)
  }

  updateProfile(payload: UpdateProfileDto): Promise<ProfileResponseDto> {
    return this.put<ProfileResponseDto, UpdateProfileDto>(this.resource, payload)
  }

  changePassword(payload: ChangePasswordDto): Promise<MessageResponseDto> {
    return this.put<MessageResponseDto, ChangePasswordDto>(`${this.resource}/password`, payload)
  }
}

export const profileService = new ProfileService()
