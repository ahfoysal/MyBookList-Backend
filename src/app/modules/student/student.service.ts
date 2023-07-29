import httpStatus from 'http-status'
import mongoose, { SortOrder } from 'mongoose'
import ApiError from '../../../errors/ApiError'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { User } from '../user/user.model'
import { studentSearchableFields } from './student.constant'
import { IStudent, IStudentFilters } from './student.interface'
import { Student } from './student.model'

const getStudents = async (
  filters: IStudentFilters,
  pagination: IPaginationOptions,
): Promise<IGenericResponse<IStudent[]>> => {
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
  const result = await Student.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
  const total = await Student.count()
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}
const getSingleStudent = async (id: string): Promise<IStudent | null> => {
  const result = await Student.findOne({ id })
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty')
  return result
}
const updateStudents = async (
  id: string,
  payload: Partial<IStudent>,
): Promise<IStudent | null> => {
  const isExist = await Student.findOne({ id })
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty')
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found')
  }
  const { name, guardian, localGuardian, ...studentData } = payload

  const updatedStudentData: Partial<IStudent> = { ...studentData }
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IStudent>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(updatedStudentData as any)[nameKey] = name[key as keyof typeof name]
    })
  }
  if (guardian && Object.keys(guardian).length > 0) {
    Object.keys(guardian).forEach(key => {
      const nameKey = `guardian.${key}` as keyof Partial<IStudent>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(updatedStudentData as any)[nameKey] = guardian[key as keyof typeof name]
    })
  }
  if (localGuardian && Object.keys(localGuardian).length > 0) {
    Object.keys(localGuardian).forEach(key => {
      const nameKey = `localGuardian.${key}` as keyof Partial<IStudent>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(updatedStudentData as any)[nameKey] =
        localGuardian[key as keyof typeof name]
    })
  }

  const result = await Student.findOneAndUpdate({ id }, updatedStudentData, {
    new: true,
  })
  return result
}
const deleteStudent = async (id: string): Promise<IStudent | null> => {
  const isExist = await Student.findOne({ id })
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found')
  }
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const student = await Student.findOneAndDelete({ id }, { session })
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
