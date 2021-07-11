const { isDev } = require("../config");
const { ErrorResponse } = require("../common/errors");

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ErrorResponse) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  // TODO: body-parser error, mongoose error, validation error
  res.status(500).json({
    success: false,
    message: isDev() ? err.message : "Unexpected condition",
  });
};

module.exports = { asyncHandler, errorHandler };
