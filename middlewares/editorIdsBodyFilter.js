const { is_TaiGer_Agent, is_TaiGer_Editor } = require('@taiger-common/core');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('./error-handler');

const editorIdsBodyFilter = asyncHandler(async (req, res, next) => {
  const {
    params: { messagesThreadId },
    user,
    body: editorsId
  } = req;

  if (is_TaiGer_Agent(user) || is_TaiGer_Editor(user)) {
    const thread = await req.db
      .model('Documentthread')
      .findById(messagesThreadId)
      .populate('student_id')
      .populate({
        path: 'student_id',
        populate: {
          path: 'editors',
          model: 'User'
        }
      });
    if (thread.file_type !== 'Essay') {
      const keys = Object.keys(editorsId);
      if (
        thread.student_id.editors?.some(
          (editor) => !keys.includes(editor._id.toString())
        )
      ) {
        return next(new ErrorResponse(403, 'Editor Id wrong.'));
      }
    }
  }

  next();
});

module.exports = {
  editorIdsBodyFilter
};
