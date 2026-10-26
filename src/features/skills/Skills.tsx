import { SectionHeading } from '../../components/ui/SectionHeading'
import { skillGroups } from '../../data/skills'

export function Skills() {
  return (
    <section className="section skills-section" id="skills">
      <div className="container">
        <SectionHeading
          label="TECHNICAL TOOLKIT"
          title="Production-Tested Stack & Architecture Ownership"
          intro="A fine-tuned balance of modern client runtimes, deterministic state libraries, and performant backend interfaces."
        />
        <div className="skills-grid">
          {skillGroups.map((group) => (
            <article className="skill-card" key={group.title}>
              <div className="skill-card-head">
                <span>◈ {group.title}</span>
                <small>{group.label}</small>
              </div>
              <div className="skill-chips">
                {group.items.map((item, index) => (
                  <span className={index === 0 ? 'featured' : ''} key={item}>{item}</span>
                ))}
              </div>
              <div className="skill-card-foot">
                <span>ENGINEERING FOCUS</span>
                <b>● SYSTEMS &amp; QUALITY</b>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
