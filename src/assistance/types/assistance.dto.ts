export interface AssistanceDto {
  id: string
  student_id: string
  date: string
  created_at: string | null
  updated_at: string | null
}

export interface CreateAssistanceDto {
  date: string
}

export interface UpdateAssistanceDto {
  date?: string
}