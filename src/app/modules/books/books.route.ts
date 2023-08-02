import express from 'express'
import { ENUM_USER_ROLE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { BookController } from './books.controller'
import { BookValidation } from './books.validation'

const router = express.Router()

router.post(
  '/create-book',
  validateRequest(BookValidation.createBookZodSchema),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.MEMBER),
  BookController.createBook,
)
router.get('/', BookController.getBooks)
router.get('/search', BookController.searchBook)
router.get('/detail/:id/:name', BookController.getDetails)
router.get(
  '/:id',
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BookController.getSingleBook,
)

router.patch(
  '/:id',
  validateRequest(BookValidation.updateBookZodSchema),
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.STUDENT,
  ),
  BookController.deleteBook,
)
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BookController.updateBook,
)

export const BooksRoutes = router
