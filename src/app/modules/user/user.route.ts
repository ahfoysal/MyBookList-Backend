import express from 'express'
// import { ENUM_USER_ROLE } from '../../../enums/user'
// import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { UserController } from './user.controller'
import { UserValidation } from './user.validation'
const router = express.Router()

router.post(
  '/create-member',

  validateRequest(UserValidation.createMemberZodSchema),
  UserController.createMember,
)

// router.post(
//   '/create-admin',
//   validateRequest(UserValidation.createAdminZodSchema),
//   UserController.createAdmin,
// )

export const UserRoutes = router
