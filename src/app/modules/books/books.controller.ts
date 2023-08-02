import axios from 'axios'
import { Request, Response } from 'express'
import httpstatus from 'http-status'
import { JwtPayload } from 'jsonwebtoken'
import ApiError from '../../../errors/ApiError'
import { bookHelper } from '../../../helpers/bookData'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { paginationFields } from '../../constants/pagination'
import { rokomari } from '../../scrapper/rokomari'
import { bookFilterableFields } from './books.constant'
import { IBook } from './books.interface'
import { BookService } from './books.service'

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
const searchBook = catchAsync(async (req: Request, res: Response) => {
  const { term } = req.query
  const books = await rokomari.SearchBooks(term as string)
  sendResponse(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'Book fetched successfully',
    // meta: result.meta,
    data: books,
  })
})
const getDetails = catchAsync(async (req: Request, res: Response) => {
  const { id, name } = req.params

  try {
    const { data } = await axios.get(
      `https://www.rokomari.com/data/elastic-autocomplete/?search_type=BOOK&term=${name}`,
    )
    const book = await bookHelper.extractData(data, id)
    if (book) {
      // console.log(JSON.stringify(matchedObject))
      sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: 'Book fetched successfully',
        // meta: result.meta,
        data: book,
      })
    } else {
      throw new ApiError(httpstatus.NOT_FOUND, `Book with ID ${id} not found`)
    }
  } catch (error) {
    console.log(error)
    throw new ApiError(httpstatus.BAD_REQUEST, 'Failed to get book details')
  }
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
  getDetails,
  searchBook,
  getSingleBook,
  updateBook,
  deleteBook,
}
