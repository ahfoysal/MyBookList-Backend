import { Request, Response } from 'express'
import { RequestHandler } from 'express-serve-static-core'
import httpStatus from 'http-status'
import config from '../../../config'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { ILoginUserResponse } from './auth.interface'
import { AuthService } from './auth.service'

const login: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const data = req.body
    const result = await AuthService.login(data)
    // Refresh token as cookie
    const { refreshToken, ...others } = result
    const cookieOptions = {
      secure: (config.env === 'production') === true,
      httpOnly: true,
    }
    res.cookie('refreshToken', refreshToken, cookieOptions)
    // Delete
    sendResponse<ILoginUserResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logged in successfully!',
      data: others,
    })
  },
)
const refreshToken: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies
    const result = await AuthService.refreshToken(refreshToken)
    const cookieOptions = {
      secure: (config.env === 'production') === true,
      httpOnly: true,
    }
    res.cookie('refreshToken', refreshToken, cookieOptions)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Access token retrieved successfully!',
      data: result,
    })
  },
)

export const AuthController = {
  login,
  refreshToken,
}
