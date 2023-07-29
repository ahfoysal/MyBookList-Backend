import express from 'express'
// import { ENUM_USER_ROLE } from '../../../enums/user'
// import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { AuthController } from './auth.controller'
import { AuthValidation } from './auth.validation'
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

export const AuthRoutes = router
