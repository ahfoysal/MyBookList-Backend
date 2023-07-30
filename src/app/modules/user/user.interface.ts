/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose'
import { IAdmin } from '../admin/admin.interface'

export type IUser = {
  // id: string
  // role: string
  // password: string
  // email: string
  // needsPasswordChange: boolean
  // member?: Types.ObjectId | IMember
  // admin?: Types.ObjectId | IAdmin
  passwordChangedAt?: Date
  id: string
  userName: string
  email: string
  profileImage?: string
  role: string
  password: string
  myBooks?: Types.ObjectId[]
  admin?: Types.ObjectId | IAdmin
  bookmark?: Types.ObjectId[]
  currentlyReading?: Types.ObjectId[]
  finishedReading?: Types.ObjectId[]
  planToRead?: Types.ObjectId[]
}

export type UserModel = {
  isUserExist(
    email: string,
  ): Promise<Pick<IUser, 'id' | 'password' | 'role' | 'email'>>
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>
} & Model<IUser>
