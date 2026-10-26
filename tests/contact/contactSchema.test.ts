import { describe, expect, it } from 'vitest'
import { contactSchema } from '../../src/features/contact/schemas/contact.schema'

const validValues = {
  name: '  Ada Lovelace  ',
  email: ' ada@example.com ',
  budget: '$10k – $25k',
  projectType: 'Full-Stack Application',
  details: '  I need a web platform for a distributed team.  ',
}

describe('contact schema', () => {
  it('accepts valid values and trims user-entered text', () => {
    expect(contactSchema.parse(validValues)).toEqual({
      ...validValues,
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      details: 'I need a web platform for a distributed team.',
    })
  })

  it('rejects whitespace-only values, short names, invalid email, placeholders, and short details', () => {
    const result = contactSchema.safeParse({
      name: ' ',
      email: 'not-an-email',
      budget: '',
      projectType: '',
      details: '    ',
    })

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error.issues.map(issue => issue.path[0])).toEqual(
      expect.arrayContaining(['name', 'email', 'budget', 'projectType', 'details']),
    )
  })

  it('rejects a name shorter than two characters and details shorter than twenty', () => {
    const result = contactSchema.safeParse({ ...validValues, name: 'A', details: 'Too short' })

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error.issues.map(issue => issue.path[0])).toEqual(expect.arrayContaining(['name', 'details']))
  })
})
