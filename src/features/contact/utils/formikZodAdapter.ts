import { getIn, setIn, type FormikErrors } from 'formik'
import { z } from 'zod'

/** Converts Zod issues to Formik's nested error shape, including paths such as `address.city`. */
export function validateWithZod<T extends object>(schema: z.ZodType<T>, values: T): FormikErrors<T> {
  const result = schema.safeParse(values)
  if (result.success) return {}

  return result.error.issues.reduce<FormikErrors<T>>((errors, issue) => {
    if (issue.path.length === 0) return errors
    const path = issue.path.map(String).join('.')
    if (getIn(errors, path) !== undefined) return errors
    return setIn(errors, path, issue.message) as FormikErrors<T>
  }, {})
}
