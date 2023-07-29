import { Request, Response } from 'express'
import { RequestHandler } from 'express-serve-static-core'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IUser } from './user.interface'
import { UserService } from './user.service'

const createMember: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body
    const result = await UserService.createMember(userData)

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created successfully!',
      data: result,
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
