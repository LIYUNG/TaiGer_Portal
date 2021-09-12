const { asyncHandler } = require("../middlewares/error-handler");

const { Program } = require("../models/Program");

const getPrograms = asyncHandler(async (req, res) => {
  const programs = await Program.find()
  res.send({ success: true, data: programs });
});

const createProgram = asyncHandler(async (req, res) => {
  const program = await Program.create(req.body);
  return res.status(201).send({ success: true, data: program });
});

const updateProgram = asyncHandler(async (req, res) => {
  const fields = req.body;

  const program = await Program.findByIdAndUpdate(req.params.id, fields, {
    new: true,
  });

  return res.status(200).send({ success: true, data: program });
});

const deleteProgram = asyncHandler(async (req, res) => {
  await Program.findByIdAndDelete(req.params.id);
  res.status(200).send({ success: true });
});

module.exports = {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
};
