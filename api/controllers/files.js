const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const { asyncHandler } = require("../middlewares/error-handler");
const Student = require("../models/Students");
const { UPLOAD_PATH } = require("../config");
const { ErrorResponse } = require("../common/errors");

// TODO: validate category

const getFiles = asyncHandler(async (req, res) => {
  const { user } = req;
  res.send({ data: user, role: user.role_ });
});

const saveFilePath = asyncHandler(async (req, res) => {
  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const studentId = req.params.studentId || req.user._id;
  const { category } = req.params;

  const fields = {
    [`uploadedDocs_.${category}.uploadStatus_`]: "uploaded",
    [`uploadedDocs_.${category}.filePath_`]: req.file.path,
    [`uploadedDocs_.${category}.LastUploadDate_`]: Date(),
  };

  await Student.findByIdAndUpdate(studentId, { $set: fields });
  return res.status(201).end();
});

const downloadFile = asyncHandler(async (req, res, next) => {
  const student = req.user;
  const { category } = req.params;

  // TODO: confirm the use of this path?
  // const directoryPath = path.join(
  //   UPLOAD_PATH,
  //   "TaiGer_Template_2021_02",
  //   category,
  //   "Template.docx"
  // );
  //TODO: what if student.uploadedDocs_.bachelorCertificate_ undefined?

  const filePath = student.uploadedDocs_[category].filePath_;

  // FIXME: clear the filePath for consistency?
  if (!fs.existsSync(filePath))
    throw new ErrorResponse(400, "File does not exist");

  res.download(filePath, (err) => {
    if (err) throw new ErrorResponse(500, "Error occurs while downloading");

    res.status(200).end();
  });
});

const updateFileStatus = asyncHandler(async (req, res, next) => {
  const { studentId, category } = req.params;
  const { status } = req.body;
  // FIXME: validate status

  const fields = {
    [`uploadedDocs_.${category}.uploadStatus_`]: status,
    [`uploadedDocs_.${category}.LastUploadDate_`]: Date(),
  };

  await Student.findByIdAndUpdate(studentId, { $set: fields });
  res.status(200).end();
});

const deleteFile = asyncHandler(async (req, res, next) => {
  const { studentId, category } = req.params;

  const student = await Student.findById(studentId);
  const filePath = student.uploadedDocs_[category].filePath_;

  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  const fields = {
    [`uploadedDocs_.${category}.uploadStatus_`]: "",
    [`uploadedDocs_.${category}.filePath_`]: "",
    [`uploadedDocs_.${category}.LastUploadDate_`]: Date(),
  };

  await Student.findByIdAndUpdate(studentId, { $set: fields });
  return res.status(200).end();
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
  getFiles,
  saveFilePath,
  downloadFile,
  updateFileStatus,
  deleteFile,
  processTranscript,
  downloadXLSX,
};
