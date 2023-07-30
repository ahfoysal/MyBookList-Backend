import { z } from 'zod'

const loginZOdSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'email  is required',
      })
      .email(),
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
