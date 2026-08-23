import type { CreateAcademyDto } from '../types/academy.dto'

export interface AcademyFormProps {
  initialValues?: CreateAcademyDto
  isLoading?: boolean
  submitLabel?: string
  errors?: Record<string, string[]>
}

export interface AcademyFormEmits {
  submit: [payload: CreateAcademyDto]
  cancel: []
}
