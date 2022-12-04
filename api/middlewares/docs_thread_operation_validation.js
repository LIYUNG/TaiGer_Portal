const { ErrorResponse } = require('../common/errors');
const { Role } = require('../models/User');
const { Documentthread } = require('../models/Documentthread');

const doc_thread_ops_validator = async (req, res, next) => {
  const {
    params: { messagesThreadId }
  } = req;
  // if (user.role === Role.Student || user.role === Role.Guest) {
  const document_thread = await Documentthread.findById(messagesThreadId);
  if (document_thread.isFinalVersion) {
    return next(new ErrorResponse(423, 'Is final version'));
  }
  // }
  next();
};

module.exports = {
  doc_thread_ops_validator
};
