import { useRef } from 'react'
import { useFormik } from 'formik'
import { Select } from '../../../components/ui/Select'
import { budgetOptions, contactSchema, projectTypeOptions, type ContactFormValues } from '../schemas/contact.schema'
import { EMAILJS_CONFIG_ERROR_MESSAGE, getEmailJsConfiguration, sendContactEmail } from '../services/contactSubmission'
import { validateWithZod } from '../utils/formikZodAdapter'

const initialValues: ContactFormValues = {
  name: '',
  email: '',
  budget: '',
  projectType: '',
  details: '',
}

export function ContactForm() {
  const honeypotRef = useRef<HTMLInputElement>(null)
  const showDevelopmentConfigurationError = import.meta.env.DEV && !getEmailJsConfiguration()

  const formik = useFormik<ContactFormValues>({
    initialValues,
    validate: values => validateWithZod(contactSchema, values),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined)

      if (honeypotRef.current?.value) {
        helpers.setStatus({
          kind: 'error',
          message: 'We could not process this inquiry. Please try again or contact us using the email link beside the form.',
        })
        return
      }

      try {
        // Formik validates first; parsing here supplies the trimmed Zod output.
        const validatedValues = contactSchema.parse(values)
        const result = await sendContactEmail(validatedValues)
        if (!result.ok) {
          helpers.setStatus({ kind: 'error', message: result.message })
          return
        }
        helpers.resetForm()
        helpers.setStatus({ kind: 'success', message: 'Your inquiry was submitted. Thanks for getting in touch.' })
      } catch {
        helpers.setStatus({
          kind: 'error',
          message: 'We could not send your inquiry right now. Your entries are still here; please retry in a moment or use the direct email link.',
        })
      }
    },
  })

  const errorFor = (field: keyof ContactFormValues) =>
    formik.touched[field] ? formik.errors[field] : undefined
  const feedbackMessage = formik.isSubmitting
    ? 'Sending your inquiry…'
    : formik.status?.message
  const feedbackKind = formik.isSubmitting ? 'pending' : formik.status?.kind

  return (
    <form className="contact-form" onSubmit={formik.handleSubmit} noValidate>
      <div className="form-heading">
        <span><b aria-hidden="true">＋</b> Start a Conversation</span>
        <small>PRIVATE DETAILS · SENT VIA EMAILJS</small>
      </div>
      {showDevelopmentConfigurationError && (
        <p className="form-feedback error" role="alert">{EMAILJS_CONFIG_ERROR_MESSAGE}</p>
      )}

      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor="contact-company-website">Leave this field blank</label>
        <input
          ref={honeypotRef}
          id="contact-company-website"
          name="contact_check"
          type="text"
          tabIndex={-1}
          autoComplete="new-password"
          readOnly
        />
      </div>

      <div className="form-field">
        <label className="form-field__label" htmlFor="contact-name">FULL NAME</label>
        <input
          className="form-field__control"
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          disabled={formik.isSubmitting}
          aria-invalid={Boolean(errorFor('name'))}
          aria-describedby={errorFor('name') ? 'contact-name-error' : undefined}
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Alex Mercer"
        />
        <span className="form-field__message" id="contact-name-error" aria-hidden={!errorFor('name')}>
          {errorFor('name') || '\u00a0'}
        </span>
      </div>

      <div className="form-row form-row--fields">
        <div className="form-field">
          <label className="form-field__label" htmlFor="contact-email">YOUR EMAIL</label>
          <input
            className="form-field__control"
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={formik.isSubmitting}
            aria-invalid={Boolean(errorFor('email'))}
            aria-describedby={errorFor('email') ? 'contact-email-error' : undefined}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="alex@company.com"
          />
          <span className="form-field__message" id="contact-email-error" aria-hidden={!errorFor('email')}>
            {errorFor('email') || '\u00a0'}
          </span>
        </div>

        <div className="form-field">
          <label className="form-field__label" id="contact-budget-label" htmlFor="contact-budget">ESTIMATED BUDGET</label>
          <Select
            id="contact-budget"
            value={formik.values.budget}
            options={budgetOptions}
            placeholder="Select a range"
            labelledBy="contact-budget-label"
            describedBy={errorFor('budget') ? 'contact-budget-error' : undefined}
            invalid={Boolean(errorFor('budget'))}
            required
            disabled={formik.isSubmitting}
            onValueChange={value => {
              void formik.setFieldValue('budget', value)
              void formik.setFieldTouched('budget', true, false)
            }}
            onBlur={() => { void formik.setFieldTouched('budget', true) }}
          />
          <span className="form-field__message" id="contact-budget-error" aria-hidden={!errorFor('budget')}>
            {errorFor('budget') || '\u00a0'}
          </span>
        </div>
      </div>

      <div className="form-field">
        <label className="form-field__label" id="contact-project-type-label" htmlFor="contact-project-type">PROJECT TYPE</label>
        <Select
          id="contact-project-type"
          value={formik.values.projectType}
          options={projectTypeOptions.map(option => ({ value: option, label: option }))}
          placeholder="Choose a project type"
          labelledBy="contact-project-type-label"
          describedBy={errorFor('projectType') ? 'contact-project-type-error' : undefined}
          invalid={Boolean(errorFor('projectType'))}
          required
          disabled={formik.isSubmitting}
          onValueChange={value => {
            void formik.setFieldValue('projectType', value)
            void formik.setFieldTouched('projectType', true, false)
          }}
          onBlur={() => { void formik.setFieldTouched('projectType', true) }}
        />
        <span className="form-field__message" id="contact-project-type-error" aria-hidden={!errorFor('projectType')}>
          {errorFor('projectType') || '\u00a0'}
        </span>
      </div>

      <div className="form-field">
        <label className="form-field__label" htmlFor="contact-details">PROJECT DETAILS</label>
        <textarea
          className="form-field__control"
          id="contact-details"
          name="details"
          required
          disabled={formik.isSubmitting}
          aria-invalid={Boolean(errorFor('details'))}
          aria-describedby={errorFor('details') ? 'contact-details-error' : undefined}
          value={formik.values.details}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Tell me about your product vision, timeline, target platforms, and requirements…"
          rows={3}
        />
        <span className="form-field__message" id="contact-details-error" aria-hidden={!errorFor('details')}>
          {errorFor('details') || '\u00a0'}
        </span>
      </div>

      <button className="button form-submit" type="submit" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? 'Sending Inquiry…' : 'Send Inquiry'} <span aria-hidden="true">→</span>
      </button>
      {feedbackMessage && (
        <p className={`form-feedback ${feedbackKind === 'error' ? 'error' : feedbackKind === 'success' ? 'success' : ''}`} role="status" aria-live="polite">
          {feedbackMessage}
        </p>
      )}
    </form>
  )
}
