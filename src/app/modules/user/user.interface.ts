/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose'
import { IAdmin } from '../admin/admin.interface'
import { IMember } from '../member/member.interface'

export type IUser = {
  id: string
  role: string
  password: string
  needsPasswordChange: boolean
  member?: Types.ObjectId | IMember
  admin?: Types.ObjectId | IAdmin
  passwordChangedAt?: Date
}

export type UserModel = {
  isUserExist(
    id: string,
  ): Promise<Pick<IUser, 'id' | 'password' | 'role' | 'needsPasswordChange'>>
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>
} & Model<IUser>
