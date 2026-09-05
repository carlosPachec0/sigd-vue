import type { AssistanceDto } from '../types/assistance.dto'

export interface AssistanceFormProps {
  initialValues?: AssistanceDto
  isLoading?: boolean
  submitLabel?: string
  errors?: Record<string, string[]>
}

export interface AssistanceFormData {
  date: string
}

export interface AssistanceFormEmits {
  submit: [payload: AssistanceFormData]
  cancel: []
}