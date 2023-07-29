import { Request, Response } from 'express'
import httpstatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { paginationFields } from '../../constants/pagination'
import { academicFacultyFilterableFields } from './books.constant'
import { AcademicFacultyService } from './books.service'

const createFaculty = catchAsync(async (req: Request, res: Response) => {
  const { ...data } = req.body
  const result = await AcademicFacultyService.createFaculty(data)

  sendResponse<IAcademicFaculty>(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'Academic faculty created successfully',
    data: result,
  })
})
const getFaculty = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields)
  const filters = pick(req.query, academicFacultyFilterableFields)
  const result = await AcademicFacultyService.getFaculty(
    filters,
    paginationOptions,
  )
  console.log(req.user)

  sendResponse<IAcademicFaculty[]>(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'Academic faculty fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})
const getSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await AcademicFacultyService.getSingleFaculty(id)

  sendResponse<IAcademicFaculty>(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'Academic faculty fetched successfully',
    data: result,
  })
})
const updateFaculty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { ...data } = req.body
  const result = await AcademicFacultyService.updateFaculty(id, data)

  sendResponse<IAcademicFaculty>(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'Academic faculty updated  successfully',
    data: result,
  })
})
const deleteFaculty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  await AcademicFacultyService.deleteFaculty(id)

  sendResponse<IAcademicFaculty>(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'Academic faculty deleted  successfully',
    data: null,
  })
})

export const AcademicFacultyController = {
  createFaculty,
  getFaculty,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
}
