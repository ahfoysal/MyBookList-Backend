import { Model } from 'mongoose'

export type IBooks = {
  title: string
}
export type IBooksFilters = {
  searchTerm?: string
}

export type AcademicFacultyModel = Model<IBooks>
