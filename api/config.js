const dotenv = require("dotenv");

// FIXME: read different env file depend on NODE_ENV
dotenv.config();

const isProd = () => process.env.NODE_ENV === "production";
const isDev = () => process.env.NODE_ENV === "development";

const env = (name, default_) => {
  // FIXME: throw error if both env variable and default not set
  return process.env[name] || default_;
}

module.exports = {
  isProd,
  isDev,
  PORT: env("PORT", 3000),
  // TODO: remove some of the default values
  MONGODB_URI: env("MONGODB_URI", "mongodb://localhost:27017/TaiGer"),
  JWT_SECRET: env("JWT_SECRET", "topsecret"),
  JWT_EXPIRE: env("JWT_EXPIRE", "1hr"),
  SMTP_HOST: env("SMTP_HOST", "smtp.ethereal.email"),
  SMTP_PORT: env("SMTP_PORT", 587),
  SMTP_USERNAME: env("SMTP_USERNAME", "glen.simonis12@ethereal.email"),
  SMTP_PASSWORD: env("SMTP_PASSWORD", "KHJ5yg3xpSCgRDHCjd"),
  BASE_URL: env("BASE_URL", "http://localhost:3000"),
  // TODO: verify values below
  BASE_PATH: env("BASE_PATH"),
  PYTHON_BASE_PATH: env("PYTHON_BASE_PATH"),
  PATH_DELIMITER: env("PATH_DELIMITER"),
  JWT_KEY: env("JWT_KEY"),
  JWT_EXPIRY_SECONDS: parseInt(env("JWT_EXPIRY_SECONDS", 3600)),
};
