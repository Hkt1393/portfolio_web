export interface Experience {
  period: string
  role: string
  company: string
  skills: string[]
  summary: string
  outcomes: string[]
}

export const experience: Experience[] = [
  { period: '2022 — PRESENT', role: 'Senior Frontend & Mobile Engineer', company: 'High-Growth Tech Startups', skills: ['React Native', 'React', 'TypeScript'], summary: 'Serving as technical lead and engineer across client-platform React Native and web infrastructures. Architected core offline-first mobile sync engines, decreasing client-side sync conflict by 94% across distributed field operations.', outcomes: ['Supervised frontend team progression from Idea to Production', 'Optimized 14+ consumer apps for deterministic state and realtime data', 'Modernized UI systems, reducing complexity by 30%', 'Engineered resilient multi-tenant design systems'] },
  { period: '2020 — 2022', role: 'Software Engineer', company: 'Digital Product Studio', skills: ['React Native', 'Node.js', 'PostgreSQL'], summary: 'Delivered custom production web and mobile software for enterprise accounts across healthcare, e-commerce, and logistics. Designed responsive single-page applications and integrated secure payment systems with robust database architectures.', outcomes: ['Built custom React Native apps from brief to release', 'Integrated RESTful backend microservices and APIs', 'Established reusable design systems and component libraries', 'Delivered secure, maintainable architecture at scale'] },
]
