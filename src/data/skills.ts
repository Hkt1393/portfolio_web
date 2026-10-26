export interface SkillGroup {
  title: string
  label: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  { title: 'Mobile & Frontend', label: 'PRODUCT EXPERIENCES', items: ['React Native', 'React', 'TypeScript', 'Expo', 'Next.js', 'Accessibility', 'State management'] },
  { title: 'Data & Systems', label: 'RELIABLE BY DESIGN', items: ['Node.js', 'PostgreSQL', 'REST & GraphQL', 'Redis', 'AWS', 'System design', 'CI / CD'] },
  { title: 'Backend & Infra', label: 'BUILT TO SCALE', items: ['NestJS', 'Docker', 'Firebase', 'GitHub Actions', 'Observability', 'API design', 'Security'] },
]
