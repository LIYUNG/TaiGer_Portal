const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Program } = require('../models/Program');

const getPrograms = asyncHandler(async (req, res) => {
  const programs = await Program.find();
  res.send({ success: true, data: programs });
});

const getProgram = asyncHandler(async (req, res) => {
  const program = await Program.findById(req.params.programId);
  if (!program) throw new ErrorResponse(400, 'Invalid program id');

  res.send({ success: true, data: program });
});

const createProgram = asyncHandler(async (req, res) => {
  const { user } = req;
  const new_program = req.body;

  new_program.updatedAt = new Date();
  new_program.whoupdated = user.firstname + ' ' + user.lastname;
  const program = await Program.create(new_program);
  return res.status(201).send({ success: true, data: program });
});

const updateProgram = asyncHandler(async (req, res) => {
  const { user } = req;
  const fields = req.body;

  fields.updatedAt = new Date();
  fields.whoupdated = user.firstname + ' ' + user.lastname;
  const program = await Program.findByIdAndUpdate(
    req.params.programId,
    fields,
    {
      upsert: true,
      new: true
    }
  );

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
