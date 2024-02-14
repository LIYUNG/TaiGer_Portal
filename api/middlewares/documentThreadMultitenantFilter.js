const { ErrorResponse } = require('../common/errors');
const { Documentthread } = require('../models/Documentthread');
const surveyInput = require('../models/SurveyInput');
const { Role } = require('../models/User');

const docThreadMultitenant_filter = async (req, res, next) => {
  const {
    user,
    params: { messagesThreadId }
  } = req;
  if (user.role === Role.Student || user.role === Role.Guest) {
    const document_thread = await Documentthread.findById(messagesThreadId)
      .populate('student_id', 'firstname lastname role ')
      .select('student_id')
      .lean();
    if (!document_thread) {
      return next(new ErrorResponse(404, 'Thread not found!'));
    }
    if (document_thread.student_id?._id.toString() !== user._id.toString()) {
      return next(
        new ErrorResponse(403, 'Not allowed to access other resource.')
      );
    }
  }
  next();
};

const surveyMultitenantFilter = async (req, res, next) => {
  const {
    user,
    params: { studentId }
  } = req;
  if (user.role === Role.Student || user.role === Role.Guest) {
    if (studentId !== user._id.toString()) {
      return next(
        new ErrorResponse(403, 'Not allowed to access other resource.')
      );
    }
    const surveyInputs = await surveyInput
      .find({ studentId })
      .populate('studentId', 'firstname lastname role ')
      .select('studentId')
      .lean();
    if (!surveyInputs) {
      return next(new ErrorResponse(404, 'Survey input not found!'));
    }
  }
  next();
};

module.exports = {
  docThreadMultitenant_filter,
  surveyMultitenantFilter
};
