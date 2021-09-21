const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const { asyncHandler } = require("../middlewares/error-handler");
const { Role, Student } = require("../models/User");
const { UPLOAD_PATH } = require("../config");
const { ErrorResponse } = require("../common/errors");
const { DocumentStatus } = require("../constants");

const saveFilePath = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, applicationId, docName },
  } = req;

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student = user.role == Role.Student ? user : await Student.findById(studentId);
  if (!student) throw new ErrorResponse(400, "Invalid student id");

  const application = student.applications.id(applicationId);
  if (!application) throw new ErrorResponse(400, "Invalid application id");

  const document = application.documents.find(({ name }) => name === docName);
  if (!document) throw new ErrorResponse(400, "Invalid document name");

  document.status = DocumentStatus.Uploaded;
  document.path = req.file.path.replace(UPLOAD_PATH, "");
  document.updatedAt = new Date();

  await student.save();
  return res.status(201).send({ success: true, data: document });
});

const downloadFile = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId, applicationId, docName },
  } = req;

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student = user.role == Role.Student ? user : await Student.findById(studentId);
  if (!student) throw new ErrorResponse(400, "Invalid student id");

  const application = student.applications.id(applicationId);
  if (!application) throw new ErrorResponse(400, "Invalid application id");

  const document = application.documents.find(({ name }) => name === docName);
  if (!document) throw new ErrorResponse(400, "Invalid document name");
  if (!document.path) throw new ErrorResponse(400, "File not uploaded yet");

  const filePath = path.join(UPLOAD_PATH, document.path);
  // FIXME: clear the filePath for consistency?
  if (!fs.existsSync(filePath))
    throw new ErrorResponse(400, "File does not exist");

  res.status(200).download(filePath, (err) => {
    if (err) throw new ErrorResponse(500, "Error occurs while downloading");
  });
});

const updateDocumentStatus = asyncHandler(async (req, res, next) => {
  const { studentId, applicationId, docName } = req.params;
  const { status } = req.body;

  if (!Object.values(DocumentStatus).includes(status))
    throw new ErrorResponse(400, "Invalid document status");

  const student = await Student.findOne({
    _id: studentId,
    "applications._id": applicationId,
  });
  if (!student)
    throw new ErrorResponse(400, "Invalid student Id or application Id");

  const document = student.applications
    .id(applicationId)
    .documents.find(({ name }) => name === docName);
  if (!document) throw new ErrorResponse(400, "Invalid document name");

  // TODO: validate status, ex: can't be accepted if document.path is empty
  document.status = status;
  document.updatedAt = new Date();

  await student.save();
  res.status(200).send({ success: true, data: document });
});

const deleteFile = asyncHandler(async (req, res, next) => {
  const { studentId, applicationId, docName } = req.params;

  const student = await Student.findOne({
    _id: studentId,
    "applications._id": applicationId,
  });
  if (!student)
    throw new ErrorResponse(400, "Invalid student Id or application Id");

  const document = student.applications
    .id(applicationId)
    .documents.find(({ name }) => name === docName);
  if (!document) throw new ErrorResponse(400, "Invalid document name");
  if (!document.path) throw new ErrorResponse(400, "File not exist");

  const filePath = path.join(UPLOAD_PATH, document.path)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  document.status = DocumentStatus.Missing
  document.path = ""
  document.updatedAt = new Date()

  await student.save();
  res.status(200).send({ success: true, data: document });
});

const processTranscript = asyncHandler(async (req, res, next) => {
  const {
    params: { group },
    file: { filename, path: filePath },
  } = req;

  // FIXME: better pass output filepath as argument to python script instead of hard code value
  const output = `analyzed_${filename}`;
  const python = spawn("python", [
    path.join(__dirname, "..", "TaiGer_Transcript-Program_Comparer", "main.py"),
    filePath,
    group,
  ]);

  python.on("close", (code) => {
    if (code === 0) return res.status(200).send({ generatedfile: output });

    next(
      new ErrorResponse(
        500,
        "Error occurs while trying to produce analyzed report"
      )
    );
  });
});

// FIXME: refactor this
const downloadXLSX = asyncHandler(async (req, res, next) => {
  const {
    user: student,
    params: { category, filename },
  } = req;
  const { firstname_, lastname_, _id } = student;

  const filePath = path.join(
    UPLOAD_PATH,
    `${firstname_}_${lastname_}_${_id}`,
    category,
    "output",
    filename
  );

  //TODO: what if student.uploadedDocs_.bachelorCertificate_ undefined?

  if (!fs.existsSync(filePath))
    throw new ErrorResponse(400, "File does not exist");

  res.download(filePath, (err) => {
    if (err) throw new ErrorResponse(500, "Error occurs while downloading");

    res.status(200).end();
  });
});

module.exports = {
  saveFilePath,
  downloadFile,
  updateDocumentStatus,
  deleteFile,
  processTranscript,
  downloadXLSX,
};
