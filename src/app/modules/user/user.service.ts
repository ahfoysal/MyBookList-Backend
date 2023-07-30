import httpStatus from 'http-status'
import mongoose from 'mongoose'
import ApiError from '../../../errors/ApiError'
import { Member } from '../member/member.model'
import { IUser } from './user.interface'
import { User } from './user.model'
import { generatedMemberId } from './user.utils'

const createMember = async (
  // member: IMember,
  user: IUser,
): Promise<IUser | null> => {
  // Hashed password

  user.role = 'member'

  let newUserAllData = null
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const id = await generatedMemberId()
    user.id = id
    // user.email = id
    // member.id = id

    const newStudent = await Member.create([user], { session })

    if (!newStudent.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student')
    }

    user.member = newStudent[0]._id

    const newUser = await User.create([user], { session })

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }
    newUserAllData = newUser[0]

    await session.commitTransaction()
    await session.endSession()
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: 'member',
      populate: [],
    })
  }

  return newUserAllData
}

// const createAdmin = async (
//   admin: IAdmin,
//   user: IUser,
// ): Promise<IUser | null> => {
//   // If password is not given,set default password
//   if (!user.password) {
//     user.password = config.default_student_password as string
//   }
//   // set role
//   user.role = 'admin'

//   let newUserAllData = null
//   const session = await mongoose.startSession()
//   try {
//     session.startTransaction()
//     // generate student
//     const id = await generatedAdminId()
//     // set custom id into both  student & user
//     user.id = id
//     admin.id = id

//     // Create student using
//     const newAdmin = await Student.create([admin], { session })

//     if (!newAdmin.length) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin')
//     }

//     // set student _id (reference) into user.student
//     user.admin = newAdmin[0]._id

//     const newUser = await User.create([user], { session })

//     if (!newUser.length) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin')
//     }
//     newUserAllData = newUser[0]

//     await session.commitTransaction()
//     await session.endSession()
//   } catch (error) {
//     await session.abortTransaction()
//     await session.endSession()
//     throw error
//   }

//   if (newUserAllData) {
//     newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
//       path: 'admin',
//       populate: [
//         {
//           path: 'managementDepartment',
//         },
//       ],
//     })
//   }

//   return newUserAllData
// }
export const UserService = {
  createMember,
  // createAdmin,
}
