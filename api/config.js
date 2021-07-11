// FIXME: use dotenv
const isProd = () => process.env.NODE_ENV === 'production'
const isDev = () => process.env.NODE_ENV === 'development'

module.exports = {
  isProd,
  isDev,
  PORT: 3000,
  MONGODB_URI: 'mongodb://localhost:27017/TaiGer',
  JWT_SECRET: 'topsecret',
  JWT_EXPIRE: '1hr',
  SMTP_HOST: 'smtp.ethereal.email',
  SMTP_PORT: 587,
  SMTP_USERNAME: '',
  SMTP_PASSWORD: '',
  BASE_URL: 'http://localhost:3000',
}
