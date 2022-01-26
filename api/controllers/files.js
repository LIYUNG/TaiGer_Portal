const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const { asyncHandler } = require("../middlewares/error-handler");
const { Role, Student } = require("../models/User");
const { UPLOAD_PATH } = require("../config");
const { ErrorResponse } = require("../common/errors");
const { DocumentStatus } = require("../constants");
const {
  sendEditorOutputGeneralFilesEmailToStudent,
  sendUploadedProgramSpecificFilesEmail,
  sendEditorOutputProgramSpecificFilesEmailToStudent,
  sendUploadedGeneralFilesEmail,
  sendUploadedProfileFilesEmail,
  sendUploadedFilesRemindForAgentEmail,
  sendUploadedProfileFilesRemindForAgentEmail,
  sendUploadedFilesRemindForEditorEmail,
  sendUploadedGeneralFilesRemindForEditorEmail,
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

const saveFilePath = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, applicationId, fileCategory },
    file: { filename },
  } = req;

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student = await Student.findById(studentId)
    .populate("applications.programId")
    .populate("students agents editors", "firstname lastname email")
    .exec();
  const student2 = await Student.findById({ _id: studentId })
    .populate("applications.programId")
    .lean()
    .exec();
  if (!student) throw new ErrorResponse(400, "Invalid student id");
  // console.log(student);
  const application = student.applications.find(
    ({ programId }) => programId._id == applicationId
  );
  const idx = student.applications.findIndex(
    ({ programId }) => programId._id == applicationId
  );
  if (!application) throw new ErrorResponse(400, "Invalid application id");

  var student_input_doc;
  var editor_output_doc;
  if (user.role == Role.Student) {
    student_input_doc = application.student_inputs.find(
      ({ name }) => name === req.file.filename
    );
    if (student_input_doc)
      throw new ErrorResponse(400, "Document already existed!");
    student_input_doc = application.student_inputs.create({
      name: req.file.filename,
    });
    student_input_doc.status = DocumentStatus.Uploaded;
    student_input_doc.path = req.file.path.replace(UPLOAD_PATH, "");
    student_input_doc.required = true;
    student_input_doc.updatedAt = new Date();
    student.applications[idx].student_inputs.push(student_input_doc);
    await student.save();
    res.status(201).send({ success: true, data: student });

    await sendUploadedProgramSpecificFilesEmail(
      // Upload success confirmation.
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email,
      },
      {
        uploaded_documentname: student_input_doc.name,
        uploaded_updatedAt: student_input_doc.updatedAt,
        university_name: student2.applications[idx].programId.University_,
        program_name: student2.applications[idx].programId.Program_,
      }
    );
    for (let i = 0; i < student.editors.length; i++) {
      console.log(i);
      await sendUploadedFilesRemindForEditorEmail(
        {
          firstname: student.editors[i].firstname,
          lastname: student.editors[i].lastname,
          address: student.editors[i].email,
        },
        {
          student_firstname: student.firstname,
          student_lastname: student.lastname,
          fileCategory: fileCategory,
          uploaded_documentname: student_input_doc.name,
          uploaded_updatedAt: student_input_doc.updatedAt,
          university_name: student2.applications[idx].programId.University_,
          program_name: student2.applications[idx].programId.Program_,
        }
      );
    }
  } else {
    editor_output_doc = application.documents.find(
      ({ name }) => name === req.file.filename
    );
    if (editor_output_doc)
      throw new ErrorResponse(400, "Document already existed!");
    editor_output_doc = application.documents.create({
      name: req.file.filename,
    });
    editor_output_doc.status = DocumentStatus.Uploaded;
    editor_output_doc.path = req.file.path.replace(UPLOAD_PATH, "");
    editor_output_doc.required = true;
    editor_output_doc.updatedAt = new Date();
    student.applications[idx].documents.push(editor_output_doc);
    await student.save();
    res.status(201).send({ success: true, data: student });

    await sendEditorOutputProgramSpecificFilesEmailToStudent(
      // Upload success confirmation.
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email,
      },
      {
        fileCategory: fileCategory,
        uploaded_documentname: editor_output_doc.name,
        uploaded_updatedAt: editor_output_doc.updatedAt,
        university_name: student2.applications[idx].programId.University_,
        program_name: student2.applications[idx].programId.Program_,
      }
    );

    // TODO: Inform editor themselves as well?
  }
});

const saveGeneralFilePath = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, fileCategory },
    file: { filename },
  } = req;

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student = await Student.findById(studentId)
    .populate("applications.programId")
    .populate("students agents editors", "firstname lastname email");
  if (!student) throw new ErrorResponse(400, "Invalid student id");
  var editor_output_doc;
  var student_input_doc;
  if (user.role == Role.Student) {
    student_input_doc = student.generaldocs.studentinputs.find(
      ({ name }) => name === req.file.filename
    );
    if (student_input_doc)
      throw new ErrorResponse(400, "Document already existed!");
    student_input_doc = student.generaldocs.studentinputs.create({
      name: req.file.filename,
    }); //TODO: and rename file name
    student_input_doc.status = DocumentStatus.Uploaded;
    student_input_doc.path = req.file.path.replace(UPLOAD_PATH, "");
    student_input_doc.required = true;
    student_input_doc.updatedAt = new Date();
    student.generaldocs.studentinputs.push(student_input_doc); //TODO: and rename file name
    await student.save();
    res.status(201).send({ success: true, data: student });

    for (let i = 0; i < student.editors.length; i++) {
      console.log(i);
      await sendUploadedGeneralFilesRemindForEditorEmail(
        {
          firstname: student.editors[i].firstname,
          lastname: student.editors[i].lastname,
          address: student.editors[i].email,
        },
        {
          student_firstname: student.firstname,
          student_lastname: student.lastname,
          uploaded_documentname: student_input_doc.name,
          uploaded_updatedAt: student_input_doc.updatedAt,
          fileCategory: fileCategory,
        }
      );
    }
  } else {
    editor_output_doc = student.generaldocs.editoroutputs.find(
      ({ name }) => name === req.file.filename
    );
    if (editor_output_doc)
      throw new ErrorResponse(400, "Document already existed!");
    editor_output_doc = student.generaldocs.editoroutputs.create({
      name: req.file.filename,
    }); //TODO: and rename file name
    editor_output_doc.status = DocumentStatus.Uploaded;
    editor_output_doc.path = req.file.path.replace(UPLOAD_PATH, "");
    editor_output_doc.required = true;
    editor_output_doc.updatedAt = new Date();
    student.generaldocs.editoroutputs.push(editor_output_doc); //TODO: and rename file name

    await student.save();
    res.status(201).send({ success: true, data: student });
    await sendEditorOutputGeneralFilesEmailToStudent(
      // Upload success confirmation.
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email,
      },
      {
        uploaded_documentname: editor_output_doc.name,
        uploaded_updatedAt: editor_output_doc.updatedAt,
        fileCategory: fileCategory,
      }
    );
    //TODO: uploaded file confirmation for editor?
  }

  //Reminder for Editor:
  console.log(student.editors);
  if (user.role == Role.Student) {
  }
});

const saveProfileFilePath = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, category },
  } = req;
  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student =
    user.role == Role.Student
      ? user
      : await Student.findById(studentId).populate("applications.programId");
  if (!student) throw new ErrorResponse(400, "Invalid student id");
  // console.log(student);
  var document = student.profile.find(({ name }) => name === category);
  if (!document) {
    document = student.profile.create({ name: category });
    document.status = DocumentStatus.Uploaded;
    document.required = true;
    document.updatedAt = new Date();
    console.log(req.file.path);
    document.path = req.file.path.replace(UPLOAD_PATH, "");
    console.log(document.path);
    student.profile.push(document);
    await student.save();

    res.status(201).send({ success: true, data: student });

    await sendUploadedProfileFilesEmail(
      {
        firstname: student.firstname,
        lastname: student.lastname,
        address: student.email,
      },
      {
        uploaded_documentname: document.name.replaceAll("_", " "),
        uploaded_updatedAt: document.updatedAt,
      }
    );
    console.log(student.agents);
    if (user.role == Role.Student) {
      for (let i = 0; i < student.agents.length; i++) {
        console.log(i);
        await sendUploadedProfileFilesRemindForAgentEmail(
          {
            firstname: student.agents[i].firstname,
            lastname: student.agents[i].lastname,
            address: student.agents[i].email,
          },
          {
            student_firstname: student.firstname,
            student_lastname: student.lastname,
            uploaded_documentname: document.name.replaceAll("_", " "),
            uploaded_updatedAt: document.updatedAt,
          }
        );
      }
    }
    return;
  }
  document.status = DocumentStatus.Uploaded;
  document.required = true;
  document.updatedAt = new Date();
  console.log(req.file.path);
  document.path = req.file.path.replace(UPLOAD_PATH, "");
  console.log(document.path);
  await student.save();

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  res.status(201).send({ success: true, data: student });
  await sendUploadedProfileFilesEmail(
    {
      firstname: student.firstname,
      lastname: student.lastname,
      address: student.email,
    },
    {
      uploaded_documentname: document.name.replaceAll("_", " "),
      uploaded_updatedAt: document.updatedAt,
    }
  );
  //Reminder for Agent:
  console.log(student.agents);
  if (user.role == Role.Student) {
    for (let i = 0; i < student.agents.length; i++) {
      console.log(i);
      await sendUploadedProfileFilesRemindForAgentEmail(
        {
          firstname: student.agents[i].firstname,
          lastname: student.agents[i].lastname,
          address: student.agents[i].email,
        },
        {
          student_firstname: student.firstname,
          student_lastname: student.lastname,
          uploaded_documentname: document.name.replaceAll("_", " "),
          uploaded_updatedAt: document.updatedAt,
        }
      );
    }
  }
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

  const filePath = path.join(UPLOAD_PATH, document.path);
  // const filePath = document.path;
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
    params: { studentId, applicationId, docName, student_inputs },
  } = req;

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  const student = await Student.findById(studentId).populate(
    "applications.programId"
  );
  if (!student) throw new ErrorResponse(400, "Invalid student id");

  const application = student.applications.find(
    ({ programId }) => programId._id == applicationId
  );
  if (!application) throw new ErrorResponse(400, "Invalid application id");
  //TODO: flag for differenciate students input or edited file
  let document;
  if (student_inputs === "student") {
    document = application.student_inputs.find(({ name }) => name === docName);
  } else {
    document = application.documents.find(({ name }) => name === docName);
  }
  if (!document) throw new ErrorResponse(400, "Invalid document name");
  if (!document.path) throw new ErrorResponse(400, "File not uploaded yet");
  console.log(document);
  const filePath = path.join(UPLOAD_PATH, document.path);
  // const filePath = document.path;
  // FIXME: clear the filePath for consistency?
  if (!fs.existsSync(filePath))
    throw new ErrorResponse(400, "File does not exist");

  res.status(200).download(filePath, (err) => {
    if (err) throw new ErrorResponse(500, "Error occurs while downloading");
  });
});

const downloadGeneralFile = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId, docName, student_inputs },
  } = req;
  try {
    // retrieve studentId differently depend on if student or Admin/Agent uploading the file
    const student = await Student.findById(studentId).populate(
      "applications.programId"
    );
    if (!student) throw new ErrorResponse(400, "Invalid student id");
    //TODO: flag for differenciate students input or edited file
    let document;
    if (student_inputs === "student") {
      document = student.generaldocs.studentinputs.find(
        ({ name }) => name === docName
      );
    } else {
      document = student.generaldocs.editoroutputs.find(
        ({ name }) => name === docName
      );
    }
    if (!document) throw new ErrorResponse(400, "Invalid document name");
    if (!document.path) throw new ErrorResponse(400, "File not uploaded yet");
    console.log(document);
    const filePath = path.join(UPLOAD_PATH, document.path);
    // const filePath = document.path;
    // FIXME: clear the filePath for consistency?
    if (!fs.existsSync(filePath))
      throw new ErrorResponse(400, "File does not exist");
    console.log(filePath);
    res.status(200).download(filePath, (err) => {
      if (err) throw new ErrorResponse(500, "Error occurs while downloading");
    });
  } catch (err) {
    console.log(err);
    return new ErrorResponse(400, "Strange error!");
  }
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
  var document = student.profile.find(({ name }) => name === category);
  try {
    if (!document) {
      document = student.profile.create({ name: category });
      document.status = DocumentStatus.NotNeeded;
      document.required = true;
      document.updatedAt = new Date();
      document.path = "";
      student.profile.push(document);
      await student.save();
      return res.status(201).send({ success: true, data: student });
    }
  } catch (err) {
    console.log(err);
  }

  //  throw new ErrorResponse(400, "Invalid document name");

  // TODO: validate status, ex: can't be accepted if document.path is empty
  document.status = status;
  document.updatedAt = new Date();

  await student.save();
  res.status(200).send({ success: true, data: student });
  //Reminder for Student:
  await sendChangedFileStatusEmail({
    firstname: student.firstname,
    lastname: student.lastname,
    address: student.email,
  });
});

const deleteFile = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId, applicationId, docName, student_inputs },
  } = req;

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  var student = await Student.findById(studentId).populate(
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

  var document;
  var student_input;
  if (student_inputs === "editor") {
    document = application.documents.find(({ name }) => name === docName);
    console.log(document);
    if (!document) throw new ErrorResponse(400, "docName not existed");
    if (document.path !== "") {
      const filePath = path.join(UPLOAD_PATH, document.path);
      // const filePath = document.path; //tmp\files_development\studentId\\<bachelorTranscript_>
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
  } else {
    student_input = application.student_inputs.find(
      ({ name }) => name === docName
    );
    console.log(student_input);
    if (!student_input) throw new ErrorResponse(400, "docName not existed");
    if (student_input.path !== "") {
      const filePath = path.join(UPLOAD_PATH, student_input.path);
      // const filePath = student_input.path; //tmp\files_development\studentId\\<bachelorTranscript_>
      console.log(filePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await Student.findOneAndUpdate(
      { _id: studentId, "applications._id": application._id },
      {
        $pull: {
          "applications.$.student_inputs": { name: docName },
        },
      }
    );
  }
  student = await Student.findById(studentId).populate(
    "applications.programId"
  );
  await student.save();
  return res.status(201).send({ success: true, data: student });
});

const deleteGeneralFile = asyncHandler(async (req, res, next) => {
  const {
    user,
    params: { studentId, docName, student_inputs },
  } = req;

  // retrieve studentId differently depend on if student or Admin/Agent uploading the file
  var student = await Student.findById(studentId).populate(
    "applications.programId"
  );
  if (!student) throw new ErrorResponse(400, "Invalid student id");

  var document;
  var student_input;
  try {
    if (student_inputs === "editor") {
      document = student.generaldocs.editoroutputs.find(
        ({ name }) => name === docName
      );
      console.log(document);
      if (!document) throw new ErrorResponse(400, "docName not existed");
      if (document.path !== "") {
        const filePath = path.join(UPLOAD_PATH, document.path);
        // const filePath = document.path; //tmp\files_development\studentId\\<bachelorTranscript_>
        console.log(filePath);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      await Student.findOneAndUpdate(
        { _id: studentId },
        {
          $pull: {
            "generaldocs.editoroutputs": { name: docName },
          },
        }
      );
    } else {
      student_input = student.generaldocs.studentinputs.find(
        ({ name }) => name === docName
      );
      console.log(student_input);
      if (!student_input) throw new ErrorResponse(400, "docName not existed");
      if (student_input.path !== "") {
        const filePath = path.join(UPLOAD_PATH, student_input.path);
        // const filePath = student_input.path; //tmp\files_development\studentId\\<bachelorTranscript_>
        console.log(filePath);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      await Student.findOneAndUpdate(
        { _id: studentId },
        {
          $pull: {
            "generaldocs.studentinputs": { name: docName },
          },
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
  student = await Student.findById(studentId).populate(
    "applications.programId"
  );
  await student.save();
  return res.status(201).send({ success: true, data: student });
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

  const filePath = path.join(UPLOAD_PATH, document.path);
  // const filePath = document.path; //tmp\files_development\studentId\\<bachelorTranscript_>
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
    params: { category },
    file: { filename, path: filePath },
  } = req;

  console.log(
    path.join(
      __dirname,
      "..",
      "python",
      "TaiGer_Transcript-Program_Comparer",
      "main.py"
    )
  );
  console.log(filePath);
  // FIXME: better pass output filepath as argument to python script instead of hard code value
  const output = `analyzed_${filename}`;
  const python = spawn("python", [
    path.join(
      __dirname,
      "..",
      "python",
      "TaiGer_Transcript-Program_Comparer",
      "main.py"
    ),
    filePath,
    category,
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
    params: { studentId, filename },
  } = req;
  const { firstname, lastname, _id } = student;

  const filePath = path.join(UPLOAD_PATH, `${_id}`, "output", filename);

  if (!fs.existsSync(filePath))
    throw new ErrorResponse(400, "File does not exist");

  res.download(filePath, (err) => {
    if (err) throw new ErrorResponse(500, "Error occurs while downloading");

    res.status(200).end();
  });
});

module.exports = {
  getMyfiles,
  saveFilePath,
  saveGeneralFilePath,
  saveProfileFilePath,
  downloadProfileFile,
  downloadTemplateFile,
  downloadFile,
  downloadGeneralFile,
  updateDocumentStatus,
  updateProfileDocumentStatus,
  deleteFile,
  deleteGeneralFile,
  deleteProfileFile,
  processTranscript,
  downloadXLSX,
};
