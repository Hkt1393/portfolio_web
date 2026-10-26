export interface Service {
  icon: string
  tone?: 'teal' | 'blue'
  title: string
  description: string
  focus: string
}

export const services: Service[] = [
  { icon: '▣', title: 'React Native Development', description: 'Full-cycle native app development, high-performing cross-platform builds, advanced data flows and deep API integrations.', focus: 'MOBILE · EXPO · OFFLINE-FIRST' },
  { icon: '▤', tone: 'teal', title: 'Modern React & Web Platforms', description: 'Performant React and Next.js frontends. Flexible component systems, thoughtful state, and accessible, future-ready solutions.', focus: 'REACT · NEXT.JS · TYPESCRIPT' },
  { icon: '⌘', title: 'API, Sync & Offline Engines', description: 'Battle-tested data synchronization with embedded SQLite, robust offline-first protocols, and optimized real-time systems.', focus: 'NODE.JS · POSTGRES · REDIS' },
  { icon: '◉', tone: 'blue', title: 'Performance & Code Audits', description: 'Deep technical audits and pragmatic refactoring for production-level reliability, faster delivery, and maintainable architecture.', focus: 'PERFORMANCE · REVIEW · QA' },
]
