import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  default_student_password: process.env.DEFAULT_STUDENT_PASSWORD,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  search_url: process.env.SEARCH_URL,

  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    refresh: process.env.JWT_REFRESH_KEY,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expire_in: process.env.JWT_REFRESH_IN,
  },
}
