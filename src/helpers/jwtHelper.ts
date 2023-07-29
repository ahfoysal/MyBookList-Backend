import jwt, { Secret } from 'jsonwebtoken'

const generateToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string,
): string => {
  return jwt.sign(payload, secret as Secret, {
    expiresIn: expireTime,
  })
}
export const jwtHelpers = { generateToken }
