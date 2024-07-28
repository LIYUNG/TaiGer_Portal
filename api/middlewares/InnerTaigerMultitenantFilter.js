const { ErrorResponse } = require('../common/errors');
const { Role } = require('../constants');

const {
  getPermission,
  getCachedStudentPermission
} = require('../utils/queryFunctions');

const InnerTaigerMultitenantFilter = async (req, res, next) => {
  const {
    user,
    params: { studentId }
  } = req;
  if (user.role === Role.Editor || user.role === Role.Agent) {
    const permissions = await getPermission(user);

    const student = await getCachedStudentPermission(studentId);
    if (!student) {
      next(new ErrorResponse(404, 'Student not found'));
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
