const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const { asyncHandler } = require("../middlewares/error-handler");
const { Role, Student } = require("../models/User");
const { UPLOAD_PATH } = require("../config");
const { ErrorResponse } = require("../common/errors");
const { DocumentStatus } = require("../constants");
const {
  sendUploadedFilesEmail,
  sendUploadedFilesRemindForAgentEmail,
  sendChangedFileStatusEmail,
  sendChangedFileStatusForAgentEmail,
  sendSomeReminderEmail,
} = require("../services/email");
const getMyfiles = asyncHandler(async (req, res) => {
  const {
    params: { studentId },
  } = req;
  console.log("getMyfiles API");
  const student = await Student.findById(studentId);
  // if (!student) throw new ErrorResponse(400, "Invalid student id");

  // document.status = DocumentStatus.Uploaded;
  // document.path = req.file.path.replace(UPLOAD_PATH, "");
  // document.updatedAt = new Date();

  await student.save();
  return res.status(201).send({ success: true, data: student });
});

const createFilePlaceholderForProgram = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, applicationId, docName },
  } = req;

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student = await Student.findById(studentId).populate(
    "applications.programId"
  );
  if (!student) throw new ErrorResponse(400, "Invalid student id");
  console.log(student.applications);
  console.log(applicationId);
  const application = student.applications.find(
    ({ programId }) => programId._id == applicationId
  );
  const idx = student.applications.findIndex(
    ({ programId }) => programId._id == applicationId
  );
  console.log(application);
  console.log(idx);
  if (!application) throw new ErrorResponse(400, "Invalid application id");

  let document = application.documents.find(({ name }) => name === docName);
  if (document) throw new ErrorResponse(400, "Document already existed!");

  document = application.documents.create({ name: docName });
  document.status = DocumentStatus.Missing;
  document.path = "";
  document.required = true;
  document.updatedAt = new Date();
  student.applications[idx].documents.push(document);
  await student.save();
  return res
    .status(201)
    .send({ success: true, data: student.applications[idx] });
});

const deleteFilePlaceholderForProgram = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, applicationId, docName },
  } = req;

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  let student = await Student.findById(studentId).populate(
    "applications.programId"
  );
  if (!student) throw new ErrorResponse(400, "Invalid student id");

  console.log(student.applications);
  // console.log(applicationId);
  const idx = student.applications.findIndex(
    ({ programId }) => programId._id == applicationId
  );
  console.log(idx);

  const application = student.applications.find(
    ({ programId }) => programId._id == applicationId
  );
  if (!application) throw new ErrorResponse(400, "Invalid application id");

  const document = application.documents.find(({ name }) => name === docName);
  console.log(document);
  if (!document) throw new ErrorResponse(400, "docName not existed");
  if (document.path !== "") {
    // const filePath = path.join(UPLOAD_PATH, document.path);
    const filePath = document.path; //tmp\files_development\studentId\\<bachelorTranscript_>
    console.log(filePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  await Student.findOneAndUpdate(
    { _id: studentId, "applications._id": application._id },
    {
      $pull: {
        "applications.$.documents": { name: docName },
      },
    }
  );
  student = await Student.findById(studentId).populate(
    "applications.programId"
  );
  // document.status = DocumentStatus.Missing;
  // document.path = "";
  // document.updatedAt = new Date();
  // var array = [...this.state.data];
  // let idx = this.state.data.findIndex((user) => user._id === user_id);
  // if (idx !== -1) {
  //   array.splice(idx, 1);
  // }
  await student.save();
  ////////////////////////

  // if (!application) throw new ErrorResponse(400, "Invalid application id");

  // let document = application.documents.find(({ name }) => name === docName);
  // if (document) throw new ErrorResponse(400, "Document already existed!");

  // document = application.documents.create({ name: docName });
  // document.status = DocumentStatus.Missing;
  // document.path = "";
  // document.required = true;
  // document.updatedAt = new Date();
  // student.applications[idx].documents.push(document);
  // await student.save();
  return res
    .status(201)
    .send({ success: true, data: student.applications[idx] });
});

const saveFilePath = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, applicationId, docName },
  } = req;

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student =
    user.role == Role.Student ? user : await Student.findById(studentId);
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

const saveProfileFilePath = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, category },
  } = req;
  // console.log(studentId);
  // console.log(category);
  // // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student =
    user.role == Role.Student ? user : await Student.findById(studentId);
  if (!student) throw new ErrorResponse(400, "Invalid student id");
  // console.log(student);
  let document = student.profile.find(({ name }) => name === category);
  if (!document) {
    document = student.profile.create({ name: category });
    document.status = DocumentStatus.Uploaded;
    document.required = true;
    document.updatedAt = new Date();
    // console.log(UPLOAD_PATH);
    // console.log(req.file);
    // document.path = UPLOAD_PATH;
    document.path = req.file.path.replace(UPLOAD_PATH, "");
    student.profile.push(document);
    await student.save();

    await sendUploadedFilesEmail({
      firstname: student.firstname,
      lastname: student.lastname,
      address: student.email,
    });
    console.log(student.agents);
    if (user.role == Role.Student) {
      for (let i = 0; i < student.agents.length; i++) {
        console.log(i);
        await sendUploadedFilesRemindForAgentEmail({
          firstname: student.agents[i].firstname,
          lastname: student.agents[i].lastname,
          address: student.agents[i].email,
        });
      }
    }
    return res.status(201).send({ success: true, data: student });
  }
  document.status = DocumentStatus.Uploaded;
  document.required = true;
  document.updatedAt = new Date();
  console.log(UPLOAD_PATH);
  console.log(req.file);
  document.path = req.file.path.replace(UPLOAD_PATH, "");
  // document.path = req.file.path.replace(UPLOAD_PATH, "");
  // const document = student.profile.find(({ name }) => name === docName);
  await student.save();
  await sendUploadedFilesEmail({
    firstname: student.firstname,
    lastname: student.lastname,
    address: student.email,
  });

  //Reminder for Agent:
  console.log(student.agents);
  if (user.role == Role.Student) {
    for (let i = 0; i < student.agents.length; i++) {
      console.log(i);
      await sendUploadedFilesRemindForAgentEmail({
        firstname: student.agents[i].firstname,
        lastname: student.agents[i].lastname,
        address: student.agents[i].email,
      });
    }
  }

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file

  return res.status(201).send({ success: true, data: student });
});

const downloadProfileFile = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId, category },
  } = req;

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student =
    user.role == Role.Student ? user : await Student.findById(studentId);
  if (!student) throw new ErrorResponse(400, "Invalid student id");

  const document = student.profile.find(({ name }) => name === category);
  if (!document) throw new ErrorResponse(400, "Invalid document name");
  if (!document.path) throw new ErrorResponse(400, "File not uploaded yet");

  // const filePath = path.join(UPLOAD_PATH, document.path);
  const filePath = document.path;
  console.log(filePath);
  // FIXME: clear the filePath for consistency?
  if (!fs.existsSync(filePath))
    throw new ErrorResponse(400, "File does not exist");

  res.status(200).download(filePath, (err) => {
    if (err) throw new ErrorResponse(500, "Error occurs while downloading");
  });
});

const downloadTemplateFile = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { category },
  } = req;
  console.log("downloadTemplateFile");
  const filePath = path.join(UPLOAD_PATH, "TaiGer_Template", category);
  console.log(filePath);
  // FIXME: clear the filePath for consistency?
  if (!fs.existsSync(filePath))
    throw new ErrorResponse(400, "File does not exist");

  res.status(200).download(filePath, (err) => {
    if (err) throw new ErrorResponse(500, "Error occurs while downloading");
  });
});

const downloadFile = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId, applicationId, docName },
  } = req;

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student =
    user.role == Role.Student ? user : await Student.findById(studentId);
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

const updateProfileDocumentStatus = asyncHandler(async (req, res, next) => {
  const { studentId, category } = req.params;
  const { status } = req.body;

  if (!Object.values(DocumentStatus).includes(status))
    throw new ErrorResponse(400, "Invalid document status");

  const student = await Student.findOne({
    _id: studentId,
  });
  if (!student)
    throw new ErrorResponse(400, "Invalid student Id or application Id");

  const document = student.profile.find(({ name }) => name === category);
  if (!document) throw new ErrorResponse(400, "Invalid document name");

  // TODO: validate status, ex: can't be accepted if document.path is empty
  document.status = status;
  document.updatedAt = new Date();

  await student.save();
  //Reminder for Student:
  await sendChangedFileStatusEmail({
    firstname: student.firstname,
    lastname: student.lastname,
    address: student.email,
  });
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

  const filePath = path.join(UPLOAD_PATH, document.path);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  document.status = DocumentStatus.Missing;
  document.path = "";
  document.updatedAt = new Date();

  await student.save();
  res.status(200).send({ success: true, data: document });
});

const deleteProfileFile = asyncHandler(async (req, res, next) => {
  const { studentId, category } = req.params;

  const student = await Student.findOne({
    _id: studentId,
  });
  if (!student)
    throw new ErrorResponse(400, "Invalid student Id or application Id");

  const document = student.profile.find(({ name }) => name === category);
  console.log(document);
  if (!document) throw new ErrorResponse(400, "Invalid document name");
  if (!document.path) throw new ErrorResponse(400, "File not exist");

  // const filePath = path.join(UPLOAD_PATH, document.path);
  const filePath = document.path; //tmp\files_development\studentId\\<bachelorTranscript_>
  console.log(filePath);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  // await Student.findByIdAndUpdate(studentId, {
  //   $pull: { profile: document._id },
  // });
  document.status = DocumentStatus.Missing;
  document.path = "";
  document.updatedAt = new Date();

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
  const { firstname, lastname, _id } = student;

  const filePath = path.join(
    UPLOAD_PATH,
    `${firstname}_${lastname}_${_id}`,
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
  getMyfiles,
  createFilePlaceholderForProgram,
  deleteFilePlaceholderForProgram,
  saveFilePath,
  saveProfileFilePath,
  downloadProfileFile,
  downloadTemplateFile,
  downloadFile,
  updateDocumentStatus,
  updateProfileDocumentStatus,
  deleteFile,
  deleteProfileFile,
  processTranscript,
  downloadXLSX,
};
