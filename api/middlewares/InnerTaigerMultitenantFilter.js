const { ErrorResponse } = require('../common/errors');
const Permission = require('../models/Permission');
const { Role, Student } = require('../models/User');

const InnerTaigerMultitenantFilter = async (req, res, next) => {
  const {
    user,
    params: { studentId }
  } = req;
  if (user.role === Role.Editor || user.role === Role.Agent) {
    const student = await Student.findById(studentId).select('agents editors');
    const permissions = await Permission.findOne({ user_id: user._id });

    if (
      student.agents.findIndex(
        (agent_id) => agent_id.toString() === user._id.toString()
      ) === -1 &&
      student.editors.findIndex(
        (editor_id) => editor_id.toString() === user._id.toString()
      ) === -1 &&
      !permissions?.canModifyAllBaseDocuments
    ) {
      return next(
        new ErrorResponse(403, 'Permission denied: Not allowed to access other students documents. Please contact administrator.')
      );
    }
  }
  next();
};

module.exports = {
  InnerTaigerMultitenantFilter
};
