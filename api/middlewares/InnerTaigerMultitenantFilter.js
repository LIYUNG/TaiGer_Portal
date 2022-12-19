const { ErrorResponse } = require('../common/errors');
const { Role } = require('../models/User');

const InnerTaigerMultitenantFilter = (req, res, next) => {
  const {
    user,
    params: { studentId }
  } = req;
  if (user.role === Role.Editor || user.role === Role.Agent) {
    if (
      // TODO: if students<< only active student!
      // Another way to check:
      // student  = await Student.findById(studentId).select("agents editors")
      // check student.agents or editors include user._id?
      //
      user.students.findIndex(
        (student) => student._id.toString() === studentId
      ) === -1
    ) {
      return next(
        new ErrorResponse(403, 'Not allowed to access other students.')
      );
    }
  }
  next();
};

module.exports = {
  InnerTaigerMultitenantFilter
};
