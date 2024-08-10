const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role } = require('../constants');
const logger = require('../services/logger');
const { one_month_cache } = require('../cache/node-cache');
const { two_weeks_cache } = require('../cache/node-cache');
const { PROGRAMS_CACHE } = require('../config');

const getProgramChangeRequests = asyncHandler(async (req, res) => {
  const { programId } = req.params;
  const changeRequests = await req.db
    .model('ProgramChangeRequest')
    .find({ programId });
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

module.exports = { getProgramChangeRequests, submitProgramChangeRequests };
