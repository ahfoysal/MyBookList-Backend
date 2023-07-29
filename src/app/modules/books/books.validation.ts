import { z } from 'zod'

const createFacultyZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'faculty title is required',
    }),
  }),
})
const updateFacultyZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'faculty title is required',
    }),
  }),
})

export const AcademicFacultyValidation = {
  createFacultyZodSchema,
  updateFacultyZodSchema,
}
