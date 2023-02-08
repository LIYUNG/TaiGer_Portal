const { ErrorResponse } = require('../common/errors');
const { Documentthread } = require('../models/Documentthread');

const doc_thread_ops_validator = async (req, res, next) => {
  const {
    params: { messagesThreadId }
  } = req;
  const document_thread = await Documentthread.findById(messagesThreadId);
  if (document_thread.isFinalVersion) {
    return next(
      new ErrorResponse(
        423,
        'The finished thread cannot be deleted. Please undo finish and delete again.'
      )
    );
  }
  next();
};

module.exports = {
  doc_thread_ops_validator
};
