import { SectionHeading } from '../../components/ui/SectionHeading'
import { services } from '../../data/services'

export function Services() {
  return (
    <section className="section services-section" id="services">
      <div className="container">
        <SectionHeading
          label="SPECIALIZED OFFERINGS"
          title="Pragmatic Technical Partnership Focused on Velocity and Quality"
          intro="Direct engineering engagement with clear timelines, production rigor, and clean handover documentation."
        />
        <div className="services-grid">
          {services.map((service) => (
            <article key={service.title}>
              <span className={`service-icon ${service.tone ?? ''}`}>{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <a href="#contact">{service.focus}<span>↗</span></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
