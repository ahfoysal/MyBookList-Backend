import httpStatus from 'http-status'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import { jwtHelpers } from '../../../helpers/jwtHelper'
import { User } from '../user/user.model'
import { ILoginUser, ILoginUserResponse } from './auth.interface'

const login = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload

  // check user exists

  const isUserExist = await User.findOne({ email }, { '+password': 1 })
  console.log(isUserExist)
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect')
  }
  // console.log(isUserExist)
  // generate access  token
  const { id: userId, role } = isUserExist
  const accessToken = jwtHelpers.generateToken(
    { id: userId, role, email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  )
  const refreshToken = jwtHelpers.generateToken(
    { id: userId, role, email },
    config.jwt.refresh as Secret,
    config.jwt.refresh_expire_in as string,
  )
  // const { password: userPass, ...userData } = isUserExist
  // console.log(userPass)
  return { accessToken, refreshToken, user: isUserExist }
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
  console.log(user)
  return { user }
}

export const AuthService = {
  login,
  refreshToken,
  me,
}
