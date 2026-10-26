import type { Project } from '../types/project'

export const projects: Project[] = [
  { name: 'Tapza Care', type: 'Healthcare · React Native', tone: 'care', description: 'A thoughtful care experience that brings patients and clinicians closer, with clear health records and simple appointment management.', tags: ['React Native', 'TypeScript', 'Node.js'], metric: '99.2%', metricLabel: 'Crash-free sessions' },
  { name: 'FieldFlow CRM', type: 'SaaS · Web platform', tone: 'field', description: 'A field service platform built to keep teams, customer relationships, and day-to-day operations moving in sync.', tags: ['React', 'PostgreSQL', 'AWS'], metric: '0.08%', metricLabel: 'Zero-loss sync' },
  { name: 'Quant Engine', type: 'Fintech · Analytics', tone: 'quant', description: 'A real-time market analytics dashboard for systematic strategies, portfolio signals, and confident decision-making.', tags: ['TypeScript', 'Python', 'WebSockets'], metric: '< 14ms', metricLabel: 'Signal latency' },
]
