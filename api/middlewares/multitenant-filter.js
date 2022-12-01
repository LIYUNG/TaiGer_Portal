const { ErrorResponse } = require('../common/errors');
const { Role } = require('../models/User');

const multitenant_filter = (req, res, next) => {
  const {
    user,
    params: { studentId }
  } = req;
  if (user.role === Role.Student || user.role === Role.Guest) {
    if (user._id.toString() !== studentId) {
      return next(
        new ErrorResponse(403, 'Not allowed to access other resource.')
      );
    }
  }
  next();
};

module.exports = {
  multitenant_filter
};
