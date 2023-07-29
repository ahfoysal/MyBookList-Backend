import express from 'express'
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route'
import { AuthRoutes } from '../modules/auth/auth.route'
import { StudentRoutes } from '../modules/student/student.route'
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
    path: '/customers',
    route: StudentRoutes,
  },
  {
    path: '/books',
    route: AcademicSemesterRoutes,
  },
]

routes.forEach(route => {
  router.use(route.path, route.route)
})

export default router
