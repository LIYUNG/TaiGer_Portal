const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');

const getProgramChangeRequests = asyncHandler(async (req, res) => {
  const { programId } = req.params;
  const changeRequests = await req.db
    .model('ProgramChangeRequest')
    .find({ programId, reviewedBy: { $exists: false } })
    .populate('requestedBy', 'firstname lastname');
  if (!changeRequests) {
    logger.error('getProgramChangeRequests: Invalid program id');
    throw new ErrorResponse(404, 'ChangeRequests not found');
  }
  res.send({ success: true, data: changeRequests });
});

const submitProgramChangeRequests = asyncHandler(async (req, res) => {
  const { programId } = req.params;
  const changes = req.body;
  const { user } = req;
  const program = await req.db.model('Program').findById(programId);

  if (!program) {
    logger.error('postProgramChangeRequests: Invalid program id');
    throw new ErrorResponse(404, 'Program not found');
  }

  const changeRequest = await req.db.model('ProgramChangeRequest').create({
    programId,
    programChanges: changes,
    requestedBy: user._id
  });
  res.send({ success: true, data: changeRequest });
});

const reviewProgramChangeRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { user } = req;
  const changeRequest = await req.db
    .model('ProgramChangeRequest')
    .findById(requestId);
  if (!changeRequest) {
    logger.error('updateProgramChangeRequest: Invalid request id');
    throw new ErrorResponse(404, 'ChangeRequest not found');
  }
  if (changeRequest.reviewedBy) {
    logger.error('updateProgramChangeRequest: Request already reviewed');
    throw new ErrorResponse(400, 'Request already reviewed');
  }
  changeRequest.reviewedBy = user._id;
  changeRequest.reviewedAt = new Date();
  await changeRequest.save();
  res.send({ success: true, data: changeRequest });
});

module.exports = {
  getProgramChangeRequests,
  submitProgramChangeRequests,
  reviewProgramChangeRequest
};
