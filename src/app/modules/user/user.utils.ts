import { User } from './user.model'

export const findLastStudentId = async () => {
  const lastUser = await User.findOne({ role: 'member' }, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean()
  return lastUser?.id ? lastUser.id.substring(4) : undefined
}

export const generatedMemberId = async (): Promise<string> => {
  const createUser =
    (await findLastStudentId()) || (0).toString().padStart(5, '0')
  let incrementedId = (parseInt(createUser) + 1).toString().padStart(5, '0')
  // console.log(incrementedId)
  incrementedId = `${incrementedId}`
  return incrementedId
}

export const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne({ role: 'faculty' }, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean()
  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined
}

export const generatedFacultyId = async (): Promise<string> => {
  const currentId =
    (await findLastFacultyId()) || (0).toString().padStart(5, '0')
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0')
  incrementedId = `F-${incrementedId}`
  return incrementedId
}
export const findLastAdminId = async () => {
  const lastFaculty = await User.findOne({ role: 'admin' }, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean()
  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined
}

export const generatedAdminId = async (): Promise<string> => {
  const currentId = (await findLastAdminId()) || (0).toString().padStart(5, '0')
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0')
  incrementedId = `A-${incrementedId}`
  return incrementedId
}
