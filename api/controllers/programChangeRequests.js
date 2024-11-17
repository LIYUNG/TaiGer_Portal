const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { updateProgramData } = require('./programs');
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

  await req.db.model('ProgramChangeRequest').findOneAndUpdate(
    {
      programId,
      requestedBy: user._id,
      reviewedBy: {
        $exists: false
      }
    },
    {
      programChanges: changes
    },
    { upsert: true }
  );
  res.send({ success: true });
});

const reviewProgramChangeRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { acceptedFields } = req.body;
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

  // submit changes to program, and append changeRequestId (for edit history reference)
  try {
    await updateProgramData(req.db, user, changeRequest.programId, {
      ...changeRequest.programChanges,
      changeRequestId: changeRequest._id
    });
  } catch (error) {
    logger.error('updateProgramChangeRequest: Error updating program');
    throw new ErrorResponse(500, 'Error updating program');
  }
  // save change request changes after program is updated
  try {
    await changeRequest.save();
  } catch (error) {
    logger.error('updateProgramChangeRequest: Error saving change request');
    throw new ErrorResponse(500, 'Error saving change request');
  }

  res.send({ success: true, data: changeRequest });
});

module.exports = {
  getProgramChangeRequests,
  submitProgramChangeRequests,
  reviewProgramChangeRequest
};
