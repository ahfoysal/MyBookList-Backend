import express from 'express'
import { AuthRoutes } from '../modules/auth/auth.route'
import { BooksRoutes } from '../modules/books/books.route'
import { MemberRoutes } from '../modules/member/member.route'
import { UserRoutes } from '../modules/user/user.route'

const router = express.Router()

const routes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/members',
    route: MemberRoutes,
  },
  {
    path: '/books',
    route: BooksRoutes,
  },
]

routes.forEach(route => {
  router.use(route.path, route.route)
})

export default router
