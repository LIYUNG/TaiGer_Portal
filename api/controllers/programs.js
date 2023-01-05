const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Program } = require('../models/Program');
const { User, Role } = require('../models/User');
const logger = require('../services/logger');
const { myCache } = require('../cache/node-cache');

const getPrograms = asyncHandler(async (req, res) => {
  const value = myCache.get(req.originalUrl);
  if (value === undefined) {
    // cache miss
    const programs = await Program.find().select(
      '-study_group_flag -tuition_fees -website -special_notes -comments -optionalDocuments -requiredDocuments -uni_assist -daad_link -ml_required -ml_requirements -rl_required -essay_required -essay_requirements -application_portal_a -application_portal_b -fpso -program_duration -deprecated -country'
    );
    const success = myCache.set(req.originalUrl, programs);
    if (success) {
      console.log('programs cache set successfully');
    }
    return res.send({ success: true, data: programs });
  }
  console.log('programs cache hit');
  res.send({ success: true, data: value });

  // const programs = await Program.find().select(
  //   '-study_group_flag -tuition_fees -website -special_notes -comments -optionalDocuments -requiredDocuments -uni_assist -daad_link -ml_required -ml_requirements -rl_required -essay_required -essay_requirements -application_portal_a -application_portal_b -fpso -program_duration -deprecated -country'
  // );
  // res.send({ success: true, data: programs });
});

const getProgram = asyncHandler(async (req, res) => {
  const { user } = req;
  // prevent student multitenancy
  if (user.role === Role.Student) {
    if (
      user.applications.findIndex(
        (app) => app.programId.toString() === req.params.programId
      ) === -1
    ) {
      logger.error('getProgram: Invalid program id in your applications');
      throw new ErrorResponse(400, 'Invalid program id in your applications');
    }
  }

  const value = myCache.get(req.originalUrl);
  if (value === undefined) {
    // cache miss
    const program = await Program.findById(req.params.programId);
    if (!program) {
      logger.error('getProgram: Invalid program id');
      throw new ErrorResponse(400, 'Invalid program id');
    }
    const success = myCache.set(req.originalUrl, program);
    if (success) {
      console.log('programs cache set successfully');
    }
    return res.send({ success: true, data: program });
  }
  console.log('programs cache hit');
  res.send({ success: true, data: value });
});

const createProgram = asyncHandler(async (req, res) => {
  const { user } = req;
  const new_program = req.body;

  new_program.updatedAt = new Date();
  new_program.whoupdated = `${user.firstname} ${user.lastname}`;
  const program = await Program.create(new_program);
  return res.status(201).send({ success: true, data: program });
});

const updateProgram = asyncHandler(async (req, res) => {
  const { user } = req;
  const fields = req.body;

  fields.updatedAt = new Date();
  fields.whoupdated = `${user.firstname} ${user.lastname}`;
  const program = await Program.findByIdAndUpdate(
    req.params.programId,
    fields,
    {
      upsert: true,
      new: true
    }
  );
  // TODO: to delete cache key for image, pdf, docs, file here.
  const value = myCache.del(req.originalUrl);
  if (value === 1) {
    console.log('cache key deleted successfully due to update');
  }

  return res.status(200).send({ success: true, data: program });
});

const deleteProgram = asyncHandler(async (req, res) => {
  await Program.findByIdAndDelete(req.params.programId);
  res.status(200).send({ success: true });
});

module.exports = {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram
};
