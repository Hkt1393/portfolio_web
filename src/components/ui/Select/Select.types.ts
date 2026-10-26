export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  id: string
  value: string
  options: readonly SelectOption[]
  placeholder: string
  labelledBy: string
  describedBy?: string
  invalid?: boolean
  required?: boolean
  disabled?: boolean
  onValueChange: (value: string) => void
  onBlur: () => void
}
