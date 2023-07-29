import express from 'express'
import { ENUM_USER_ROLE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicFacultyController } from './books.controller'
import { AcademicFacultyValidation } from './books.validation'

const router = express.Router()

router.post(
  '/create-academic-faculty',
  validateRequest(AcademicFacultyValidation.createFacultyZodSchema),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AcademicFacultyController.createFaculty,
)
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AcademicFacultyController.getFaculty,
)
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AcademicFacultyController.getSingleFaculty,
)

router.patch(
  '/:id',
  validateRequest(AcademicFacultyValidation.updateFacultyZodSchema),
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.STUDENT,
  ),
  AcademicFacultyController.updateFaculty,
)
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AcademicFacultyController.deleteFaculty,
)

export const AcademicFacultyRoutes = router
