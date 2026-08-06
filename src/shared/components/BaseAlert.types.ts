export interface BaseAlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  dismissible?: boolean
}

export interface BaseAlertEmits {
  dismiss: []
}
