const { ErrorResponse } = require('../common/errors');
const { Documentthread } = require('../models/Documentthread');
const Permission = require('../models/Permission');
const { Role, Student } = require('../models/User');

const InnerTaigerMultitenantFilter = async (req, res, next) => {
  const {
    user,
    params: { studentId }
  } = req;
  if (user.role === Role.Editor || user.role === Role.Agent) {
    const permissions = await Permission.findOne({ user_id: user._id });

    const student = await Student.findById(studentId).select('agents editors');
    if (!student) {
      next(
        new ErrorResponse(
          403,
          'Permission denied: Not allowed to access other students documents. Please contact administrator.'
        )
      );
    }
    if (
      ![...student.agents, ...student.editors].some(
        (taiger_user) => taiger_user.toString() === user._id.toString()
      ) &&
      !permissions?.canModifyAllBaseDocuments
    ) {
      next(
        new ErrorResponse(
          403,
          'Permission denied: Not allowed to access other students documents. Please contact administrator.'
        )
      );
    }
  }
  next();
};

module.exports = {
  InnerTaigerMultitenantFilter
};
