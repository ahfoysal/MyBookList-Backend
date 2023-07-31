import httpStatus from 'http-status'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import { jwtHelpers } from '../../../helpers/jwtHelper'
import { User } from '../user/user.model'
import { ILoginUser, ILoginUserResponse } from './auth.interface'

const login = async ({
  email,
  password,
}: ILoginUser): Promise<ILoginUserResponse> => {
  const isUserExist = await User.findOne({ email }, { '+password': 1 })
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this email')
  }
  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect')
  }

  const { id, role } = isUserExist
  const accessToken = jwtHelpers.generateToken(
    { id, role, email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  )
  const refreshToken = jwtHelpers.generateToken(
    { id, role, email },
    config.jwt.refresh as Secret,
    config.jwt.refresh_expire_in as string,
  )
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { password: userPass, ...userWithoutPassword } = isUserExist.toObject()

  return { accessToken, refreshToken, user: userWithoutPassword }
}

const refreshToken = async (token: string) => {
  // verify the token
  let decodedToken = null
  try {
    decodedToken = jwt.verify(token, config.jwt.refresh as Secret)
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh request')
  }
  const { id, role } = decodedToken
  console.log(decodedToken)
  const isUserExist = await User.isUserExist(id)
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }
  // generate new access token
  const accessToken = jwtHelpers.generateToken(
    { id: id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  )
  return accessToken
}

const me = async (user: JwtPayload) => {
  console.log(user.id)
  const userData = await User.findOne({ id: user.id})
  
  return { user: userData }
}

export const AuthService = {
  login,
  refreshToken,
  me,
}
