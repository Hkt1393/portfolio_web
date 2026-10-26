export interface Project {
  name: string
  type: string
  tone: 'care' | 'field' | 'quant'
  description: string
  tags: string[]
  metric: string
  metricLabel: string
}
