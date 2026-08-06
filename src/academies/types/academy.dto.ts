export interface AcademyDto {
  id: number
  user_id: string
  name: string
  discipline: string
  registration_fee: number
  monthly_fee: number
  class_fee: number
  created_at: string
  updated_at: string
}

export interface CreateAcademyDto {
  name: string
  discipline: string
  registration_fee?: number
  monthly_fee?: number
  class_fee?: number
}

export interface UpdateAcademyDto {
  name?: string
  discipline?: string
  registration_fee?: number
  monthly_fee?: number
  class_fee?: number
}
