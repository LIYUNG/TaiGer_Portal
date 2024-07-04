const { ErrorResponse } = require('../common/errors');
const { Interview } = require('../models/Interview');
const { Role } = require('../models/User');
const { getPermission } = require('../utils/queryFunctions');

const interviewMultitenantFilter = async (req, res, next) => {
  const {
    user,
    params: { interview_id }
  } = req;
  if (user.role === Role.Editor || user.role === Role.Agent) {
    const permissions = await getPermission(user);

    const interview = await Interview.findById(interview_id).populate(
      'student_id'
    );
    if (!interview) {
      next(new ErrorResponse(404, 'Interview not found'));
    }
    if (
      ![
        ...interview.student_id.agents,
        ...interview.student_id.editors,
        ...interview.trainer_id
      ].some((taiger_user) => taiger_user.toString() === user._id.toString()) &&
      !permissions?.canAssignEditors &&
      !permissions?.canAssignAgents
    ) {
      next(
        new ErrorResponse(
          403,
          'Permission denied: Not allowed to access other interview. Please contact administrator.'
        )
      );
    }
  }
  if (user.role === Role.Student || user.role === Role.Guest) {
    const interview = await Interview.findById(interview_id).populate();
    if (
      interview.student_id?.toString() &&
      user._id.toString() !== interview.student_id?.toString()
    ) {
      return next(
        new ErrorResponse(403, 'Not allowed to access other resource.')
      );
    }
  }
  next();
};

const interviewMultitenantReadOnlyFilter = async (req, res, next) => {
  const {
    user,
    params: { interview_id }
  } = req;

  if (user.role === Role.Student || user.role === Role.Guest) {
    const interview = await Interview.findById(interview_id);
    if (
      interview?.student_id?.toString() &&
      user._id.toString() !== interview?.student_id?.toString()
    ) {
      return next(
        new ErrorResponse(403, 'Not allowed to access other resource.')
      );
    }
  }
  next();
};

module.exports = {
  interviewMultitenantFilter,
  interviewMultitenantReadOnlyFilter
};
