import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { StudentValidation } from './member.validation'
import { StudentController } from './member.controller'

const router = express.Router()

router.get('/', StudentController.getStudents)
router.get('/:id', StudentController.getSingleStudents)

router.patch(
  '/:id',
  validateRequest(StudentValidation.updateStudentZodSchema),
  StudentController.updateStudents,
)
router.delete('/:id', StudentController.deleteStudents)

export const StudentRoutes = router
