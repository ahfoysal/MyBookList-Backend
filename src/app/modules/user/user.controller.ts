import { Request, Response } from 'express'
import { RequestHandler } from 'express-serve-static-core'
import httpStatus from 'http-status'
import config from '../../../config'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { UserService } from './user.service'

const createMember: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body
    const result = await UserService.createMember(userData)
    console.log(result)
    const { refreshToken, ...others } = result
    const cookieOptions = {
      secure: (config.env === 'production') === true,
      httpOnly: true,
    }
    res.cookie('refreshToken', refreshToken, cookieOptions)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Signup successfully!',
      data: others,
    })
  },
)

// const createAdmin: RequestHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     const { admin, ...userData } = req.body
//     const result = await UserService.createAdmin(admin, userData)

//     sendResponse<IUser>(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Admin created successfully!',
//       data: result,
//     })
//   },
// )

export const UserController = {
  createMember,
  // createAdmin,
}
