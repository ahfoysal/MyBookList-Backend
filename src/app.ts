import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application } from 'express'
import globalErrorHandler from './app/middlewares/globalErrorHandlers'
import routes from './app/routes'

const app: Application = express()

///cors

app.use(cors())

///body and cookie parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
////////
app.use('/api/v1', routes)
app.use(globalErrorHandler)

///////

// Testing
app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  //   throw new ApiError(400, 'Invalid Request')
  // Promise.reject(new Error('Unhandled Promise Rejection'))
  return res.send('Server Running')
})

export default app
