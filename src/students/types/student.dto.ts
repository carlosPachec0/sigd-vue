export interface StudentDto {
  id: number
  academy_id: number
  name: string
  gender: 'Male' | 'Female'
  birth_date: string
  height: number | null
  weight: number | null
  created_at: string
  updated_at: string
}

export interface CreateStudentDto {
  name: string
  gender: 'Male' | 'Female'
  birth_date: string
  height?: number
  weight?: number
}

export interface UpdateStudentDto {
  name?: string
  gender?: 'Male' | 'Female'
  birth_date?: string
  height?: number
  weight?: number
}
