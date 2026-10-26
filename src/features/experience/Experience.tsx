import { SectionHeading } from '../../components/ui/SectionHeading'
import { experience } from '../../data/experience'

export function Experience() {
  return (
    <section className="section experience-section" id="experience">
      <div className="container">
        <SectionHeading label="PROFESSIONAL EXPERIENCE" title="Proven Engineering Experience & Technical Leadership" />
        <div className="experience-list">
          {experience.map((item) => (
            <article key={item.period}>
              <div className="experience-meta">
                <span>{item.period}</span>
                <h3>{item.role}</h3>
                <p>{item.company}</p>
                <div className="experience-pills">
                  {item.skills.map((skill) => <span key={skill}>{skill}</span>)}
                </div>
              </div>
              <div className="experience-detail">
                <p>{item.summary}</p>
                <ul>{item.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
