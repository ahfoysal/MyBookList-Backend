import { Request, Response } from 'express'
import httpstatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { paginationFields } from '../../constants/pagination'
import { studentFilterableFields } from './student.constant'
import { IStudent } from './student.interface'
import { StudentService } from './student.service'

const getStudents = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields)
  const filters = pick(req.query, studentFilterableFields)
  const result = await StudentService.getStudents(filters, paginationOptions)

  sendResponse<IStudent[]>(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'Academic faculty fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})
const getSingleStudents = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await StudentService.getSingleStudent(id)

  sendResponse<IStudent>(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'Academic faculty fetched successfully',
    data: result,
  })
})
const updateStudents = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { ...data } = req.body
  const result = await StudentService.updateStudents(id, data)

  sendResponse<IStudent>(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'Academic faculty updated  successfully',
    data: result,
  })
})
const deleteStudents = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  await StudentService.deleteStudent(id)

  sendResponse<IStudent>(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'Academic faculty deleted  successfully',
    data: null,
  })
})

export const StudentController = {
  getStudents,
  getSingleStudents,
  updateStudents,
  deleteStudents,
}
