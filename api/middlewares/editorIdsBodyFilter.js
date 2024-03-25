const { ErrorResponse } = require('../common/errors');
const { Documentthread } = require('../models/Documentthread');
const Event = require('../models/Event');

const editorIdsBodyFilter = async (req, res, next) => {
  const {
    params: { messagesThreadId },
    user,
    body: editorsId
  } = req;

  if (user.role === 'Agent' || user.role === 'Editor') {
    const thread = await Documentthread.findById(messagesThreadId)
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
};

module.exports = {
  editorIdsBodyFilter
};
