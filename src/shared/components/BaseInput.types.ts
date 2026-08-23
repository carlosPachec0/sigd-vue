export interface BaseInputProps {
  modelValue?: string
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date'
  required?: boolean
  disabled?: boolean
  error?: string | null
  id?: string
  autocomplete?: string
}

export interface BaseInputEmits {
  'update:modelValue': [value: string]
}
