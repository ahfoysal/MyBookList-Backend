import express from 'express'
// import { ENUM_USER_ROLE } from '../../../enums/user'
// import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { UserController } from '../user/user.controller'
import { UserValidation } from '../user/user.validation'
import { AuthController } from './auth.controller'
import { AuthValidation } from './auth.validation'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
const router = express.Router()

router.post(
  '/login',
  validateRequest(AuthValidation.loginZOdSchema),
  AuthController.login,
)
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZOdSchema),
  AuthController.refreshToken,
)
router.get(
  '/me',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.MEMBER),

  AuthController.me,
)
router.post(
  '/signup',

  validateRequest(UserValidation.createMemberZodSchema),
  UserController.createMember,
)
export const AuthRoutes = router
