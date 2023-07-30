export type ILoginUser = {
  email?: string
  id?: string | undefined
  password: string
}
export type ILoginUserResponse = {
  accessToken: string
  refreshToken?: string
  needsPasswordChange?: boolean | undefined
}
