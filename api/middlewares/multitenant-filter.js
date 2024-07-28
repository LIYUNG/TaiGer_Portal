const { ErrorResponse } = require('../common/errors');
const { Role } = require('../constants');


const multitenant_filter = (req, res, next) => {
  const {
    user,
    params: { studentId, user_id }
  } = req;
  if (user.role === Role.Student || user.role === Role.Guest) {
    if (
      (studentId && user._id.toString() !== studentId) ||
      (user_id && user._id.toString() !== user_id)
    ) {
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
