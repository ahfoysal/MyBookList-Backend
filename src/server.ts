import { Server } from 'http'
import mongoose from 'mongoose'
import app from './app'
import config from './config'
import { errorLogger, logger } from './shared/logger'
//////Database Connection
async function connectDB() {
  let server: Server
  try {
    await mongoose.connect(config.database_url as string)
    logger.info('MongoDB Connected')

    server = app.listen(config.port, () => {
      logger.info(`Server listening on port ${config.port}`)
    })
  } catch (err) {
    logger.error('failed to connect database', err)
  }
  process.on('unhandledRejection', err => {
    errorLogger.error('Unhandled Rejection, Server is closing', err)
    if (server) {
      server.close(() => {
        errorLogger.error('Unhandled Rejection, Server is closing', err)
        process.exit(1)
      })
    } else {
      errorLogger.error('Unhandled Rejection, Server is closing', err)
      process.exit(1)
    }
  })
}
connectDB()
