import type { StudentDto } from '../types/student.dto'

export interface StudentFormProps {
  academyId?: number
  initialValues?: StudentDto
  isLoading?: boolean
  submitLabel?: string
  errors?: Record<string, string[]>
}

export interface StudentFormData {
  name: string
  gender: 'Male' | 'Female'
  birth_date: string
  height?: number
  weight?: number
}

export interface StudentFormEmits {
  submit: [payload: StudentFormData]
  cancel: []
}
