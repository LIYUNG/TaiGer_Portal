const { ErrorResponse } = require('../common/errors');
const { Role } = require('../constants');
const logger = require('../services/logger');

const docThreadMultitenant_filter = async (req, res, next) => {
  const {
    user,
    params: { messagesThreadId }
  } = req;
  if (user.role === Role.Student || user.role === Role.Guest) {
    const document_thread = await req.db
      .model('Documentthread')
      .findById(messagesThreadId)
      .populate('student_id', 'firstname lastname role ')
      .select('student_id')
      .lean();
    if (!document_thread) {
      logger.warn(`${req.originalUrl}: Thread not found!`);
      return next(
        new ErrorResponse(404, `${req.originalUrl}: Thread not found!`)
      );
    }
    if (document_thread.student_id?._id.toString() !== user._id.toString()) {
      logger.warn(`${req.originalUrl}: Not allowed to access other resource.`);
      return next(
        new ErrorResponse(
          403,
          `${req.originalUrl}: Not allowed to access other resource.`
        )
      );
    }
  }
  next();
};

const surveyMultitenantFilter = async (req, res, next) => {
  const {
    user,
    params: { surveyInputId }
  } = req;

  if (user.role === Role.Student || user.role === Role.Guest) {
    // On POST: where surveyInputId not yet exist, check if created document is assign to the user
    const surveyDocument = req?.body?.input;
    if (
      !surveyInputId &&
      surveyDocument?.studentId.toString() !== user._id.toString()
    ) {
      return next(
        new ErrorResponse(403, 'Not allowed to create/edit other resource.')
      );
    }

    // On PUT/DELETE: use surveyInputId to validate the document belongs to the user
    const surveyInputs = await req.db
      .model('surveyInput')
      .findById(surveyInputId)
      .lean();
    if (surveyInputs.studentId.toString() !== user._id.toString()) {
      return next(
        new ErrorResponse(403, 'Not allowed to access other resource.')
      );
    }

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
