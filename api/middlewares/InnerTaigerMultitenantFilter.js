const { ErrorResponse } = require('../common/errors');
const { Documentthread } = require('../models/Documentthread');
const Permission = require('../models/Permission');
const { Role, Student } = require('../models/User');

const InnerTaigerMultitenantFilter = async (req, res, next) => {
  const {
    user,
    params: { studentId, messagesThreadId }
  } = req;
  if (user.role === Role.Editor || user.role === Role.Agent) {
    const student = await Student.findById(studentId).select('agents editors');
    const permissions = await Permission.findOne({ user_id: user._id });
    let outsourcer_allowed_modify = false;
    if (messagesThreadId) {
      const document_thread = await Documentthread.findById(messagesThreadId)
        .populate('student_id')
        .lean();
      console.log(document_thread);
      outsourcer_allowed_modify =
        document_thread.outsourced_user_id.some(
          (outsourcer_id) => outsourcer_id.toString() === user._id.toString()
        ) ||
        (document_thread.file_type !== 'Essay' &&
          document_thread.student_id?.agents?.some(
            (agent) => agent?.toString() === user._id.toString()
          ));
      console.log(outsourcer_allowed_modify);
    }
    if (
      [...student.agents, ...student.editors].some(
        (taiger_user) => taiger_user.toString() === user._id.toString()
      ) ||
      permissions?.canModifyAllBaseDocuments ||
      outsourcer_allowed_modify
    ) {
      return next();
    }
    next(
      new ErrorResponse(
        403,
        'Permission denied: Not allowed to access other students documents. Please contact administrator.'
      )
    );
  }
  next();
};

module.exports = {
  InnerTaigerMultitenantFilter
};
