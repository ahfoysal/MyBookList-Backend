import { SortOrder } from 'mongoose'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { academicFacultySearchableFields } from './books.constant'
import { IAcademicFaculty, IAcademicFacultyFilters } from './books.interface'
import { AcademicFaculty } from './books.model'

const createFaculty = async (
  data: IAcademicFaculty,
): Promise<IAcademicFaculty | null> => {
  const result = await AcademicFaculty.create(data)

  return result
}

const getFaculty = async (
  filters: IAcademicFacultyFilters,
  pagination: IPaginationOptions,
): Promise<IGenericResponse<IAcademicFaculty[]>> => {
  const { searchTerm, ...filterData } = filters
  const andCondition = []
  if (searchTerm) {
    andCondition.push({
      $or: academicFacultySearchableFields.map(field => ({
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
  const result = await AcademicFaculty.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
  const total = await AcademicFaculty.count()
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}
const getSingleFaculty = async (
  id: string,
): Promise<IAcademicFaculty | null> => {
  const result = await AcademicFaculty.findById(id)
  return result
}
const updateFaculty = async (
  id: string,
  payload: Partial<IAcademicFaculty>,
): Promise<IAcademicFaculty | null> => {
  const result = await AcademicFaculty.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  })
  return result
}
const deleteFaculty = async (id: string): Promise<void> => {
  await AcademicFaculty.deleteOne({ _id: id })
}
export const AcademicFacultyService = {
  createFaculty,
  getFaculty,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
}
