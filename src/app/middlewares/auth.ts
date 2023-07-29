import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { Secret } from 'jsonwebtoken'
import config from '../../config'
import ApiError from '../../errors/ApiError'
import { jwtHelpers } from '../../helpers/jwtHelper'
import { User } from '../modules/user/user.model'

const auth =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized Request')
      }
      let verifiedUser = null

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.refresh as Secret)
      // User existence check
      const { id } = verifiedUser

      const isUserExist = await User.isUserExist(id)
      if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
      }

      req.user = verifiedUser
      if (roles.length && !roles.includes(isUserExist.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden ')
      }
      return next()
    } catch (err) {
      next(err)
    }
  }

export default auth
