import { IUser } from '../user/user.interface'

export type ILoginUser = {
  email?: string
  id?: string | undefined
  password: string
}
export type ILoginUserResponse = {
  accessToken: string
  refreshToken?: string
  user?: IUser
}
