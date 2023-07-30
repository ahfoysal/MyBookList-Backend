import { JwtPayload } from 'jsonwebtoken'
import mongoose, { SortOrder } from 'mongoose'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { User } from '../user/user.model'
import { generateBookId } from '../user/user.utils'
import { bookSearchableFields } from './books.constant'
import { IBook, IBooksFilters } from './books.interface'
import { Book } from './books.model'

const createBook = async (
  data: IBook,
  user: JwtPayload,
): Promise<IBook | null> => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const bookId = await generateBookId()

    const isUserExist = await User.findOne({ id: user.id }).session(session)

    data.authorId = isUserExist?._id || undefined
    data.id = bookId

    const result = await Book.create([data], { session })

    // Update member's myBooks array

    if (isUserExist && result) {
      await User.findByIdAndUpdate(
        isUserExist?._id,
        { $push: { myBooks: result[0]._id } }, // Assuming 'myBooKs' is the correct field name in the User schema
        { new: true, session },
      )
    }

    await session.commitTransaction()
    session.endSession()

    return result[0]
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}
const getBooks = async (
  filters: IBooksFilters,
  pagination: IPaginationOptions,
): Promise<IGenericResponse<IBook[]>> => {
  const { searchTerm, ...filterData } = filters
  const andCondition = []
  if (searchTerm) {
    andCondition.push({
      $or: bookSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(pagination)

  const sortConditions: { [key: string]: SortOrder } = {}
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {}
  const result = await Book.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
  const total = await Book.count()
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}
const getSingleBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findById(id)
  return result
}
const updateBook = async (
  id: string,
  payload: Partial<IBook>,
): Promise<IBook | null> => {
  const result = await Book.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  })
  return result
}
const deleteBook = async (id: string): Promise<void> => {
  await Book.deleteOne({ _id: id })
}
export const BookService = {
  createBook,
  getBooks,
  getSingleBook,
  updateBook,
  deleteBook,
}
