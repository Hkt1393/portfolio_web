import emailjs from '@emailjs/browser'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getEmailJsConfiguration, sanitizeEmailJsResponseText, sendContactEmail } from '../../src/features/contact/services/contactSubmission'
import type { ContactFormValues } from '../../src/features/contact/schemas/contact.schema'

vi.mock('@emailjs/browser', () => ({ default: { send: vi.fn() } }))

const configuration = {
  serviceId: 'service_test',
  templateId: 'template_test',
  publicKey: 'public_test',
}

const values: ContactFormValues = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  budget: '$10k – $25k',
  projectType: 'Full-Stack Application',
  details: 'I need a web platform for a distributed team.',
}

describe('EmailJS contact delivery', () => {
  beforeEach(() => {
    vi.mocked(emailjs.send).mockReset()
  })

  it('redacts customer data and credentials from diagnostic response text', () => {
    const safeText = sanitizeEmailJsResponseText(
      'Rejected ada@example.com for Ada Lovelace using public_test, key=abcdefghijklmnopqrstuvwxyz0123456789',
      [values.name, values.email, configuration.publicKey],
    )

    expect(safeText).not.toContain(values.name)
    expect(safeText).not.toContain(values.email)
    expect(safeText).not.toContain(configuration.publicKey)
    expect(safeText).not.toContain('abcdefghijklmnopqrstuvwxyz0123456789')
  })

  it('maps all contact fields to the configured template and sends with the public key', async () => {
    vi.mocked(emailjs.send).mockResolvedValue({ status: 200, text: 'OK' })

    await expect(sendContactEmail(values, configuration)).resolves.toEqual({ ok: true })

    expect(emailjs.send).toHaveBeenCalledWith(
      'service_test',
      'template_test',
      {
        from_name: values.name,
        reply_to: values.email,
        estimated_budget: values.budget,
        project_type: values.projectType,
        project_details: values.details,
      },
      { publicKey: 'public_test', blockHeadless: true },
    )
    expect(vi.mocked(emailjs.send).mock.calls[0]?.[2]).not.toHaveProperty('to_email')
  })

  it('reports missing configuration without making a request', async () => {
    const config = getEmailJsConfiguration({
      VITE_EMAILJS_SERVICE_ID: '',
      VITE_EMAILJS_TEMPLATE_ID: 'template_test',
      VITE_EMAILJS_PUBLIC_KEY: 'public_test',
    })

    await expect(sendContactEmail(values, config)).resolves.toMatchObject({ ok: false, kind: 'configuration' })
    expect(emailjs.send).not.toHaveBeenCalled()
  })

  it('rejects when EmailJS rejects the delivery request', async () => {
    vi.mocked(emailjs.send).mockRejectedValue(new Error('Provider unavailable'))

    await expect(sendContactEmail(values, configuration)).resolves.toMatchObject({ ok: false, kind: 'delivery' })
  })

  it('does not dispatch a second EmailJS request while one is in flight', async () => {
    let resolveRequest!: (response: { status: number; text: string }) => void
    vi.mocked(emailjs.send).mockImplementation(() => new Promise(resolve => { resolveRequest = resolve }))

    const firstRequest = sendContactEmail(values, configuration)
    expect(emailjs.send).toHaveBeenCalledTimes(1)
    await expect(sendContactEmail(values, configuration)).resolves.toMatchObject({ ok: false, kind: 'delivery' })
    expect(emailjs.send).toHaveBeenCalledTimes(1)

    resolveRequest({ status: 200, text: 'OK' })
    await expect(firstRequest).resolves.toEqual({ ok: true })
  })
})
