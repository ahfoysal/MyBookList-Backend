import { z } from 'zod'

const loginZOdSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'Id  is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
})
const refreshTokenZOdSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Valid token  is required',
    }),
  }),
})

export const AuthValidation = {
  loginZOdSchema,
  refreshTokenZOdSchema,
}
