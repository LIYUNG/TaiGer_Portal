const { ErrorResponse } = require("../common/errors");
const { asyncHandler } = require("../middlewares/error-handler");
const { Program } = require("../models/Program");

const getPrograms = asyncHandler(async (req, res) => {
  const programs = await Program.find()
  res.send({ success: true, data: programs });
});

const getProgram = asyncHandler(async (req, res) => {
  const program = await Program.findById(req.params.programId);
  if (!program) throw new ErrorResponse(400, "Invalid program id");

  res.send({ success: true, data: program });
});

const createProgram = asyncHandler(async (req, res) => {
  const program = await Program.create(req.body);
  return res.status(201).send({ success: true, data: program });
});

const updateProgram = asyncHandler(async (req, res) => {
  const fields = req.body;

  // TODO: fix consistency when updating `requiredDocuments`/`optionalDocuments`

  const program = await Program.findByIdAndUpdate(
    req.params.programId,
    fields,
    {
      new: true,
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
  deleteProgram,
};
