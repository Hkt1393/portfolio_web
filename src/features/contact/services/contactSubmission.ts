import emailjs from '@emailjs/browser'
import type { ContactFormValues } from '../schemas/contact.schema'

export interface EmailJsConfiguration {
  serviceId: string
  templateId: string
  publicKey: string
}

export type ContactEmailResult =
  | { ok: true }
  | { ok: false; kind: 'configuration' | 'delivery'; message: string }

export const EMAILJS_CONFIG_ERROR_MESSAGE = 'Email delivery is not configured. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY to .env.local, then restart the dev server.'
const deliveryMessage = 'We could not send your inquiry right now. Please try again in a moment or use the direct email link.'

export function sanitizeEmailJsResponseText(responseText: string, sensitiveValues: readonly string[]): string {
  let safeText = responseText
  const redactions = sensitiveValues
    .filter(value => value.length > 0)
    .flatMap(value => [value, encodeURIComponent(value)])
    .sort((left, right) => right.length - left.length)

  for (const value of redactions) safeText = safeText.replaceAll(value, '[redacted]')

  return safeText
    .replace(/[\w.+-]+@[\w.-]+\.[A-Z]{2,}/gi, '[redacted email]')
    .replace(/\+?\d[\d\s().-]{7,}\d/g, '[redacted number]')
    .replace(/\b(public[_ -]?key|user[_ -]?id|access[_ -]?token)(["']?\s*[:=]\s*["']?)[^,\s"'}]+/gi, '$1$2[redacted]')
    .replace(/\b[A-Za-z0-9_-]{32,}\b/g, '[redacted token]')
    .slice(0, 500)
}

function logEmailJsFailureInDevelopment(
  error: unknown,
  values: ContactFormValues,
  configuration: EmailJsConfiguration,
): void {
  if (!import.meta.env.DEV || import.meta.env.MODE === 'test') return

  const status = typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number'
    ? error.status
    : null
  const responseText = typeof error === 'object' && error !== null && 'text' in error && typeof error.text === 'string'
    ? error.text
    : error instanceof Error ? error.message : 'Unknown EmailJS error'
  const safeResponseText = sanitizeEmailJsResponseText(responseText, [
    configuration.publicKey,
    configuration.serviceId,
    configuration.templateId,
    values.name,
    values.email,
    values.budget,
    values.projectType,
    values.details,
  ])

  console.error('[EmailJS dev diagnostic]', { status, responseText: safeResponseText })
}

export function getEmailJsConfiguration(
  env: Pick<ImportMetaEnv, 'VITE_EMAILJS_SERVICE_ID' | 'VITE_EMAILJS_TEMPLATE_ID' | 'VITE_EMAILJS_PUBLIC_KEY'> = import.meta.env,
): EmailJsConfiguration | null {
  const serviceId = env.VITE_EMAILJS_SERVICE_ID?.trim()
  const templateId = env.VITE_EMAILJS_TEMPLATE_ID?.trim()
  const publicKey = env.VITE_EMAILJS_PUBLIC_KEY?.trim()
  if (!serviceId || !templateId || !publicKey) return null
  return { serviceId, templateId, publicKey }
}

let requestInFlight = false

export async function sendContactEmail(
  values: ContactFormValues,
  configuration = getEmailJsConfiguration(),
): Promise<ContactEmailResult> {
  if (!configuration) return { ok: false, kind: 'configuration', message: EMAILJS_CONFIG_ERROR_MESSAGE }
  if (requestInFlight) return { ok: false, kind: 'delivery', message: deliveryMessage }

  requestInFlight = true
  try {
    await emailjs.send(
      configuration.serviceId,
      configuration.templateId,
      {
        from_name: values.name,
        reply_to: values.email,
        estimated_budget: values.budget,
        project_type: values.projectType,
        project_details: values.details,
      },
      { publicKey: configuration.publicKey, blockHeadless: true },
    )
    return { ok: true }
  } catch (error) {
    logEmailJsFailureInDevelopment(error, values, configuration)
    return { ok: false, kind: 'delivery', message: deliveryMessage }
  } finally {
    requestInFlight = false
  }
}
