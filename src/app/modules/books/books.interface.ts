import { Model, Types } from 'mongoose'

export type IBook = {
  id: string
  reference?: string
  title: string
  titleEnglish?: string
  description?: string
  image: string
  reviews?: []
  author?: string
  authorId?: Types.ObjectId | string
  edition?: string
  genre: string[]
  related?: Types.ObjectId[]
  releaseDate?: Date
  ratingsCount?: number
  reviewersCount?: number
}

export type IBooksFilters = {
  searchTerm?: string
}

export type BookModel = Model<IBook>
