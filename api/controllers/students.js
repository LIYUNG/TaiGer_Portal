const { ErrorResponse } = require("../common/errors");
const { asyncHandler } = require("../middlewares/error-handler");
const { Agent, Student, Editor } = require("../models/User");
const { Program } = require("../models/Program");

const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find();
  res.status(200).send({ success: true, data: students });
});

const assignAgentToStudent = asyncHandler(async (req, res, next) => {
  const {
    params: { id: studentId },
    body: agentId,
  } = req;
  // TODO: check studentId and agentId are valid

  // TODO: transaction?
  await Student.findByIdAndUpdate(studentId, {
    agents: { $push: agentId },
  });

  await Agent.findByIdAndUpdate(agentId, {
    students: { $push: studentId },
  });

  res.status(200).send({ success: true });
});

const removeAgentFromStudent = asyncHandler(async (req, res, next) => {
  const { studentId, agentId } = req.params;

  // TODO: transaction?
  await Student.findByIdAndUpdate(studentId, {
    agents: { $pull: agentId },
  });

  await Agent.findByIdAndUpdate(agentId, {
    students: { $pull: studentId },
  });

  res.status(200).send({ success: true });
});

const assignEditorToStudent = asyncHandler(async (req, res, next) => {
  const {
    params: { id: studentId },
    body: editorId,
  } = req;
  // TODO: check studentId and editorId are valid

  // TODO: transaction?
  await Student.findByIdAndUpdate(studentId, {
    editors: { $push: editorId },
  });

  await Editor.findByIdAndUpdate(editorId, {
    students: { $push: studentId },
  });

  res.status(200).send({ success: true });
});

const removeEditorFromStudent = asyncHandler(async (req, res, next) => {
  const { studentId, editorId } = req.params;

  // TODO: transaction?
  await Student.findByIdAndUpdate(studentId, {
    editors: { $pull: editorId },
  });

  await Editor.findByIdAndUpdate(editorId, {
    students: { $pull: studentId },
  });

  res.status(200).send({ success: true });
});

const createApplication = asyncHandler(async (req, res) => {
  const {
    params: { studentId },
    body: { programId },
  } = req;

  const student = await Student.findById(studentId);
  const programIds = student.applications.map(({ programId }) => programId);
  if (programIds.includes(programId))
    throw new ErrorResponse(400, "Duplicate program");

  const program = await Program.findById(programId);
  // TODO: figure out required documents from program and create application
  // const application =
  // student.applications.push(application);
  await student.save();
  res.status(201).send({ data: "success" });
});

const deleteApplication = asyncHandler(async (req, res, next) => {
  const { studentId, applicationId } = req.params;
  await Student.findByIdAndUpdate(studentId, {
    $pull: { applications: { _id: applicationId } },
  });

  res.status(200).send({ success: true });
});

module.exports = {
  getStudents,
  assignAgentToStudent,
  removeAgentFromStudent,
  assignEditorToStudent,
  removeEditorFromStudent,
  createApplication,
  deleteApplication,
};
