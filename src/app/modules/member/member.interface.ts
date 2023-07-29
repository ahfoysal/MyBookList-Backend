import { Model, Types } from 'mongoose'

export type IMember = {
  id: string
  userName: string
  email: string
  profileImage?: string
  wishlist: Types.ObjectId[]
  currentlyReading: Types.ObjectId[]
  finishedReading: Types.ObjectId[]
  planToRead: Types.ObjectId[]
}

export type MemberModel = Model<IMember, Record<string, unknown>>

export type IMemberFilters = {
  searchTerm?: string
  id?: string
  email?: string
}
