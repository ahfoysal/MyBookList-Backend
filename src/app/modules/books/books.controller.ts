import { Request, Response } from 'express'
import httpstatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { paginationFields } from '../../constants/pagination'
import { bookFilterableFields } from './books.constant'
import { IBook } from './books.interface'
import { BookService } from './books.service'
import { JwtPayload } from 'jsonwebtoken'

const createBook = catchAsync(async (req: Request, res: Response) => {
  const { ...data } = req.body
  const result = await BookService.createBook(data, req.user as JwtPayload)

  sendResponse<IBook>(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'Book created successfully',
    data: result,
  })
})
const getBooks = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields)
  const filters = pick(req.query, bookFilterableFields)
  const result = await BookService.getBooks(filters, paginationOptions)
  console.log(req.user)

  sendResponse<IBook[]>(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'Book fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})
const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await BookService.getSingleBook(id)

  sendResponse<IBook>(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'Book fetched successfully',
    data: result,
  })
})
const updateBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { ...data } = req.body
  const result = await BookService.updateBook(id, data)

  sendResponse<IBook>(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'Book updated  successfully',
    data: result,
  })
})
const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  await BookService.deleteBook(id)

  sendResponse<IBook>(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'Book deleted  successfully',
    data: null,
  })
})

export const BookController = {
  createBook,
  getBooks,
  getSingleBook,
  updateBook,
  deleteBook,
}
