interface SectionHeadingProps {
  label: string
  title: string
  intro?: string
  children?: React.ReactNode
}

export function SectionHeading({ label, title, intro, children }: SectionHeadingProps) {
  return <><p className="section-label">{label}</p><h2>{title}</h2>{intro && <p className="section-intro">{intro}</p>}{children}</>
}
