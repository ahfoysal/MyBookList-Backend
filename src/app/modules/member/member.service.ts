import httpStatus from 'http-status'
import mongoose, { SortOrder } from 'mongoose'
import ApiError from '../../../errors/ApiError'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { User } from '../user/user.model'
import { studentSearchableFields } from './member.constant'
import { IMember, IMemberFilters } from './member.interface'
import { Member } from './member.model'

const getStudents = async (
  filters: IMemberFilters,
  pagination: IPaginationOptions,
): Promise<IGenericResponse<IMember[]>> => {
  const { searchTerm, ...filterData } = filters
  const andCondition = []
  if (searchTerm) {
    andCondition.push({
      $or: studentSearchableFields.map(field => ({
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
  const result = await Member.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
  const total = await Member.count()
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}
const getSingleStudent = async (id: string): Promise<IMember | null> => {
  const result = await Member.findOne({ id })
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty')
  return result
}
const updateStudents = async (
  id: string,
  payload: Partial<IMember>,
): Promise<IMember | null> => {
  const isExist = await Member.findOne({ id })
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty')
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found')
  }
  const { name,  ...studentData } = payload

  const updatedStudentData: Partial<IMember> = { ...studentData }
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IMember>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(updatedStudentData as any)[nameKey] = name[key as keyof typeof name]
    })
  }
 

  const result = await Member.findOneAndUpdate({ id }, updatedStudentData, {
    new: true,
  })
  return result
}
const deleteStudent = async (id: string): Promise<IMember | null> => {
  const isExist = await Member.findOne({ id })
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found')
  }
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const student = await Member.findOneAndDelete({ id }, { session })
    if (!student) {
      throw new ApiError(httpStatus.NOT_FOUND, 'failed to delete student')
    }
    await User.deleteOne({ id })
    session.commitTransaction()
    session.endSession()
    return student
  } catch (err) {
    session.abortTransaction()
    throw err
  }
}
export const StudentService = {
  getStudents,
  getSingleStudent,
  updateStudents,
  deleteStudent,
}
