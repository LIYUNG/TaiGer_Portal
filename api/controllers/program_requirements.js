const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');

const getProgramRequirements = asyncHandler(async (req, res) => {
  const programRequirements = await req.db
    .model('ProgramRequirement')
    .find({})
    .populate('programId program_categories.keywordSets')
    .sort({ createdAt: -1 });
  res.send({ success: true, data: programRequirements });
});

const getProgramRequirement = asyncHandler(async (req, res) => {
  const { programId } = req.params;

  const requirement = await req.db
    .model('ProgramRequirement')
    .findOne({ programId })
    .populate('programId program_categories.keywordSets');
  if (!requirement) {
    logger.error('getProgramRequirement: Invalid program id');
    throw new ErrorResponse(404, 'ProgramRequirement not found');
  }
  res.send({ success: true, data: requirement });
});

const createProgramRequirement = asyncHandler(async (req, res) => {
  const { user } = req;
  const { ticket } = req.body;
  ticket.requester_id = user._id.toString();
  // TODO: DO not create the same
  const new_ticket = await req.db.model('ProgramRequirement').create(ticket);

  res.status(201).send({ success: true, data: new_ticket });
});

const updateProgramRequirement = asyncHandler(async (req, res) => {
  const { user } = req;
  const { programId } = req.params;
  const fields = req.body;

  fields.updatedAt = new Date();
  // TODO: update resolver_id
  const updatedProgramRequirement = await req.db
    .model('ProgramRequirement')
    .findByIdAndUpdate(programId, fields, {
      new: true
    })
    .populate('requester_id', 'firstname lastname email archiv');

  if (!updatedProgramRequirement) {
    logger.error('updateProgramRequirement: Invalid message thread id');
    throw new ErrorResponse(404, 'Thread not found');
  }

  res.status(200).send({ success: true, data: updatedProgramRequirement });
});

const deleteProgramRequirement = asyncHandler(async (req, res) => {
  const { programId } = req.params;
  await req.db.model('ProgramRequirement').findByIdAndDelete(programId);

  res.status(200).send({ success: true });
});

module.exports = {
  getProgramRequirements,
  getProgramRequirement,
  createProgramRequirement,
  updateProgramRequirement,
  deleteProgramRequirement
};
