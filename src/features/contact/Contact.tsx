import { SectionHeading } from '../../components/ui/SectionHeading'
import { site } from '../../data/site'
import { ContactForm } from './components/ContactForm'

export function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <div className="container contact-grid">
        <div>
          <SectionHeading
            label="LET’S BUILD SOMETHING"
            title="Have a Project in Mind? Let’s Build Together."
          />
          <p className="body-copy">
            I am actively reviewing full-time senior roles and high-impact
            contract opportunities for 2025–2026. Whether you are launching a
            greenfield mobile product or need architectural direction, my inbox
            is open.
          </p>
          <div className="contact-details">
            <a href={`mailto:${site.email}`}>
              <span aria-hidden="true">✉</span>
              <span><small>DIRECT EMAIL</small><b>{site.email}</b></span>
              <i aria-hidden="true">↗</i>
            </a>
          </div>
          <div className="response-note">
            <span aria-hidden="true">◷</span> Typical response time{' '}
            <b>&lt; 12 Hours Guaranteed</b>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  )
}
