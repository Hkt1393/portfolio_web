import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ContactForm } from '../../src/features/contact/components/ContactForm'
import { sendContactEmail } from '../../src/features/contact/services/contactSubmission'

vi.mock('../../src/features/contact/services/contactSubmission', async importOriginal => {
  const actual = await importOriginal<typeof import('../../src/features/contact/services/contactSubmission')>()
  return { ...actual, sendContactEmail: vi.fn() }
})

const sendMock = vi.mocked(sendContactEmail)

afterEach(() => cleanup())
beforeEach(() => sendMock.mockReset())

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('FULL NAME'), 'Ada Lovelace')
  await user.type(screen.getByLabelText('YOUR EMAIL'), 'ada@example.com')

  await user.click(screen.getByRole('combobox', { name: 'ESTIMATED BUDGET' }))
  await user.click(screen.getByRole('option', { name: '$10k – $25k' }))

  await user.click(screen.getByRole('combobox', { name: 'PROJECT TYPE' }))
  await user.click(screen.getByRole('option', { name: 'Full-Stack Application' }))

  await user.type(screen.getByLabelText('PROJECT DETAILS'), 'I need a web platform for a distributed team.')
}

describe('ContactForm', () => {
  it('shows required field errors and does not call EmailJS for invalid values', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    await user.click(screen.getByRole('button', { name: /send inquiry/i }))

    expect(await screen.findByText('Enter your full name (at least 2 characters).')).toBeTruthy()
    expect(screen.getByText('Enter a valid email address.')).toBeTruthy()
    expect(screen.getByText('Select your estimated budget.')).toBeTruthy()
    expect(screen.getByText('Select a project type.')).toBeTruthy()
    expect(screen.getByText('Please provide at least 20 characters about your project.')).toBeTruthy()
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('submits successfully, confirms the request, and resets only after success', async () => {
    const user = userEvent.setup()
    sendMock.mockResolvedValue({ ok: true })
    render(<ContactForm />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send inquiry/i }))

    expect((await screen.findByRole('status')).textContent).toContain('Your inquiry was submitted.')
    expect((screen.getByLabelText('FULL NAME') as HTMLInputElement).value).toBe('')
    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      budget: '$10k – $25k',
      projectType: 'Full-Stack Application',
    }))
    expect((screen.getByLabelText('Leave this field blank') as HTMLInputElement).readOnly).toBe(true)
  })

  it('keeps the honeypot guard for programmatically filled spam submissions', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    const honeypot = screen.getByLabelText('Leave this field blank') as HTMLInputElement
    Object.defineProperty(honeypot, 'value', { configurable: true, value: 'spam.example' })
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send inquiry/i }))

    expect(await screen.findByText(/could not process this inquiry/i)).toBeTruthy()
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('preserves form values and reports failure when delivery fails', async () => {
    const user = userEvent.setup()
    sendMock.mockResolvedValue({
      ok: false,
      kind: 'delivery',
      message: 'We could not send your inquiry right now. Please try again in a moment or use the direct email link.',
    })
    render(<ContactForm />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /send inquiry/i }))

    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('We could not send your inquiry'))
    expect((screen.getByLabelText('FULL NAME') as HTMLInputElement).value).toBe('Ada Lovelace')
    expect((screen.getByLabelText('YOUR EMAIL') as HTMLInputElement).value).toBe('ada@example.com')
  })

})
