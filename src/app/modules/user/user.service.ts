import { Secret } from 'jsonwebtoken'
import config from '../../../config'
import { jwtHelpers } from '../../../helpers/jwtHelper'
import { IUser } from './user.interface'
import { User } from './user.model'
import { generatedMemberId } from './user.utils'

const createMember = async (
  // member: IMember,
  user: IUser,
) => {
  // Hashed password

  user.role = 'member'
  const id = await generatedMemberId()
  user.id = id

  const newUser = await User.create(user)

  const accessToken = jwtHelpers.generateToken(
    { id: newUser?.id, role: newUser?.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  )
  const refreshToken = jwtHelpers.generateToken(
    { id: newUser?.id, role: newUser?.role },
    config.jwt.refresh as Secret,
    config.jwt.refresh_expire_in as string,
  )
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = newUser.toObject()
  return { user: userWithoutPassword, refreshToken, accessToken }
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
