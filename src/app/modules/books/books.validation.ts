import { z } from 'zod'

const createBookZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'book title is required',
    }),
    description: z.string({
      required_error: 'book description is required',
    }),
    image: z.string({
      required_error: 'image is required',
    }),
    author: z.string().optional(),
    edition: z.string().optional(),
    genre: z.array(z.string()),
    releaseDate: z.string().optional(),
  }),
})
const updateBookZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'faculty title is required',
    }),
  }),
})

export const BookValidation = {
  createBookZodSchema,
  updateBookZodSchema,
}
