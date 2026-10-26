import { ProjectPreview } from '../../components/ui/ProjectPreview'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { projects } from '../../data/projects'
import { site } from '../../data/site'

export function Projects() {
  return (
    <section className="section projects-section" id="projects">
      <div className="container">
        <div className="projects-heading">
          <SectionHeading label="SELECTED WORK · SHIPPED" title="Engineered Systems Delivering Measurable Business Impact" />
          <a className="text-link" href="#contact">Discuss a project <span>↗</span></a>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.name}>
              <ProjectPreview tone={project.tone} />
              <div className="project-content">
                <div className="project-title-row">
                  <div><h3>{project.name}</h3><span className="project-type">{project.type}</span></div>
                  <a className="icon-link" href={`mailto:${site.email}?subject=${encodeURIComponent(`Question about ${project.name}`)}`} aria-label={`Ask about ${project.name}`}>↗</a>
                </div>
                <p>{project.description}</p>
                <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="project-result">
                  <b>{project.metric}</b>
                  <span>{project.metricLabel}</span>
                  <a href={`mailto:${site.email}?subject=${encodeURIComponent(`Ask about ${project.name}`)}`}>Ask about project ↗</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
