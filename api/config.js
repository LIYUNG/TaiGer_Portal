const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`)
});

const isProd = () => process.env.NODE_ENV === 'production';
const isDev = () =>
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

const env = (name, default_) => {
  // FIXME: throw error if both env variable and default not set
  return process.env[name] || default_;
};

module.exports = {
  isProd,
  isDev,
  PORT: env('PORT', 3000),
  HTTPS_PORT: env('HTTPS_PORT', 3000),
  HTTPS_KEY: env('HTTPS_KEY', './cert/cert.key'),
  HTTPS_CERT: env('HTTPS_CERT', './cert/cert.pem'),
  HTTPS_CA: env('HTTPS_CA', './cert/cert.pem'),
  ORIGIN: env('ORIGIN', 'http://localhost:3006'),
  API_ORIGIN: env('API_ORIGIN', 'http://localhost:3000/api'),
  // TODO: remove some of the default values
  MONGODB_URI: env('MONGODB_URI', 'mongodb://localhost:27017/TaiGer'),
  JWT_SECRET: env('JWT_SECRET', 'topsecret'),
  JWT_EXPIRE: env('JWT_EXPIRE', '1hr'),
  SMTP_HOST: env('SMTP_HOST', 'smtp.ethereal.email'),
  SMTP_PORT: env('SMTP_PORT', 587),
  SMTP_USERNAME: env('SMTP_USERNAME', 'glen.simonis12@ethereal.email'),
  SMTP_PASSWORD: env('SMTP_PASSWORD', 'KHJ5yg3xpSCgRDHCjd'),
  BASE_URL: env('BASE_URL', 'http://localhost:3000'),
  UPLOAD_PATH: env('UPLOAD_PATH'),
  CLEAN_UP_SCHEDULE: env('CLEAN_UP_SCHEDULE', '* * * 1 * *'),
  AWS_S3_PUBLIC_BUCKET: env('AWS_S3_PUBLIC_BUCKET'),
  AWS_S3_ACCESS_KEY_ID: env('AWS_S3_ACCESS_KEY_ID', ''),
  AWS_S3_ACCESS_KEY: env('AWS_S3_ACCESS_KEY', ''),
  AWS_S3_PUBLIC_BUCKET_NAME: env('AWS_S3_PUBLIC_BUCKET_NAME', ''),
  AWS_S3_BUCKET_NAME: env('AWS_S3_BUCKET_NAME', '')
};
