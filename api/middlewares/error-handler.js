const { isDev } = require('../config')

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  // TODO: body-parser error, mongoose error, validation error
  res.status(500).json({
    success: false,
    message: isDev() ? err.message : 'Unexpected condition',
  })
}

module.exports = { errorHandler }
