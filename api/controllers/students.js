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
    body: { id: agentId },
  } = req;
  // TODO: check studentId and agentId are valid

  // TODO: transaction?
  await Student.findByIdAndUpdate(studentId, {
    $push: { agents: agentId },
  });

  await Agent.findByIdAndUpdate(agentId, {
    $push: { students: studentId },
  });

  // TODO: return data?
  res.status(200).send({ success: true });
});

const removeAgentFromStudent = asyncHandler(async (req, res, next) => {
  const { studentId, agentId } = req.params;

  // TODO: transaction?
  await Student.findByIdAndUpdate(studentId, {
    $pull: { agents: agentId },
  });

  await Agent.findByIdAndUpdate(agentId, {
    $pull: { students: studentId },
  });

  res.status(200).send({ success: true });
});

const assignEditorToStudent = asyncHandler(async (req, res, next) => {
  const {
    params: { id: studentId },
    body: { id: editorId },
  } = req;
  // TODO: check studentId and editorId are valid

  // TODO: transaction?
  await Student.findByIdAndUpdate(studentId, {
    $push: { editors: editorId },
  });

  await Editor.findByIdAndUpdate(editorId, {
    $push: { students: studentId },
  });

  res.status(200).send({ success: true });
});

const removeEditorFromStudent = asyncHandler(async (req, res, next) => {
  const { studentId, editorId } = req.params;

  // TODO: transaction?
  await Student.findByIdAndUpdate(studentId, {
    $pull: { editors: editorId },
  });

  await Editor.findByIdAndUpdate(editorId, {
    $pull: { students: studentId },
  });

  res.status(200).send({ success: true });
});

const createApplication = asyncHandler(async (req, res) => {
  const {
    params: { id },
    body: { programId },
  } = req;

  const student = await Student.findById(id);
  const programIds = student.applications.map(({ programId }) => programId);
  if (programIds.includes(programId))
    throw new ErrorResponse(400, "Duplicate program");

  const program = await Program.findById(programId);
  const { requiredDocuments, optionalDocuments } = program;
  const now = new Date();
  const application = student.applications.create({ programId });
  application.documents = [
    ...requiredDocuments.map((name) => ({
      name,
      required: true,
      updatedAt: now,
    })),
    ...optionalDocuments.map((name) => ({
      name,
      required: false,
      updatedAt: now,
    })),
  ];
  student.applications.push(application);
  await student.save();

  res.status(201).send({ success: true, data: application });
});

const deleteApplication = asyncHandler(async (req, res, next) => {
  const { studentId, applicationId } = req.params;
  await Student.findByIdAndUpdate(studentId, {
    $pull: { applications: { _id: applicationId } },
  });
  // TODO: remove uploaded files

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
