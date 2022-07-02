const { ErrorResponse } = require("../common/errors");
const path = require("path");
const { asyncHandler } = require("../middlewares/error-handler");
const { Role, Agent, Student, Editor } = require("../models/User");
const { Documentthread } = require("../models/Documentthread");
const { Task } = require("../models/Task");
var async = require("async");
const fs = require("fs");
const {
  informAgentNewStudentEmail,
  informStudentTheirAgentEmail,
  informEditorNewStudentEmail,
  informStudentTheirEditorEmail,
} = require("../services/email");

const initGeneralMessagesThread = asyncHandler(async (req, res) => {
  const {
    user,
    params: { studentId, document_catgory },
  } = req;
  const student = await Student.findById(studentId).populate(
    "generaldocs_threads.doc_thread_id"
  );

  if (!student) throw new ErrorResponse(400, "Invalid student id");
  var generaldocs_thread_existed;
  var doc_thread_existed;
  doc_thread_existed = await Documentthread.find({
    student_id: studentId,
    file_type: document_catgory,
  });

  if (doc_thread_existed.length > 0)
    throw new ErrorResponse(400, "Document Thread already existed!");

  const new_doc_thread = new Documentthread({
    student_id: studentId,
    file_type: document_catgory,
    application_id: null,
    updatedAt: new Date(), //TODO
  });
  await new_doc_thread.save();
  var temp;
  temp = student.generaldocs_threads.create({
    doc_thread_id: new_doc_thread._id,
  });
  temp.student_id = studentId;
  student.generaldocs_threads.push(temp);
  await student.save();
  const student2 = await Student.findById(studentId)
    .populate("generaldocs_threads.doc_thread_id")
    .populate("applications.programId");
  res.status(200).send({ success: true, data: student2 });
  //TODO: Email notification
});

const initApplicationMessagesThread = asyncHandler(async (req, res) => {
  const { user } = req;
  res
    .status(200)
    .send({ success: true, data: ["initApplicationMessagesThread success!"] });
});

// const PostMessageInThread = asyncHandler(async (req, res) => {
//   const {
//     user,
//     params: { studentId, applicationId, fileCategory },
//   } = req;

//   // retrieve studentId differently depend on if student or Admin/Agent uploading the file
//   const student = await Student.findById(studentId)
//     .populate("applications.programId")
//     .populate("students agents editors", "firstname lastname email")
//     .exec();
//   const student2 = await Student.findById({ _id: studentId })
//     .populate("applications.programId")
//     .lean()
//     .exec();
//   if (!student) throw new ErrorResponse(400, "Invalid student id");
//   // console.log(student);
//   const application = student.applications.find(
//     ({ programId }) => programId._id == applicationId
//   );
//   const idx = student.applications.findIndex(
//     ({ programId }) => programId._id == applicationId
//   );
//   if (!application) throw new ErrorResponse(400, "Invalid application id");

//   var student_input_doc;
//   var editor_output_doc;
//   if (user.role == Role.Student) {
//     student_input_doc = application.student_inputs.find(
//       ({ name }) => name === req.file.key
//     );
//     if (student_input_doc)
//       throw new ErrorResponse(400, "Document already existed!");
//     student_input_doc = application.student_inputs.create({
//       name: req.file.key,
//     });
//     student_input_doc.status = DocumentStatus.Uploaded;
//     // console.log(req.file);
//     student_input_doc.path = path.join(req.file.metadata.path, req.file.key);
//     student_input_doc.required = true;
//     student_input_doc.updatedAt = new Date();
//     student.applications[idx].student_inputs.push(student_input_doc);

//     // TODO: set flag editors document(filetype) isReceivedFeedback
//     await student.save();
//     res.status(201).send({ success: true, data: student });
//     // TODO: Inform editor themselves as well?
//   } else {
//     editor_output_doc = application.documents.find(
//       ({ name }) => name === req.file.key
//     );
//     if (editor_output_doc)
//       throw new ErrorResponse(400, "Document already existed!");
//     editor_output_doc = application.documents.create({
//       name: req.file.key,
//     });
//     editor_output_doc.status = DocumentStatus.Uploaded;
//     // console.log(req.file);
//     editor_output_doc.path = path.join(req.file.metadata.path, req.file.key);
//     editor_output_doc.required = true;
//     editor_output_doc.updatedAt = new Date();
//     student.applications[idx].documents.push(editor_output_doc);
//     // TODO: set flag student document(filetype, feedback) isReceivedFeedback
//     await student.save();
//     res.status(201).send({ success: true, data: student });

//     // TODO: Inform editor themselves as well?
//   }
// });

const getMessages = asyncHandler(async (req, res) => {
  const {
    user,
    params: { messagesThreadId },
  } = req;
  const document_thread = await Documentthread.findById(
    messagesThreadId
  ).populate("student_id application_id messages.user_id");

  if (!document_thread)
    throw new ErrorResponse(400, "Invalid message thread id");

  res.status(200).send({ success: true, data: document_thread });
});
const postMessages = asyncHandler(async (req, res) => {
  const {
    user,
    params: { messagesThreadId },
  } = req;
  const { userId, message, studentId } = req.body;

  const document_thread = await Documentthread.findById(messagesThreadId);
  console.log(req);
  // console.log(JSON.parse(req.userData));
  // console.log(JSON.parse(req.file));
  console.log(req.file);
  if (!document_thread)
    throw new ErrorResponse(400, "Invalid message thread id");
  //TODO: to save file when file attached
  var new_message = {
    user_id: user._id,
    message: message,
    createdAt: new Date(),
    // file: [
    //   {
    //     name: req.file.key,
    //     path: path.join(req.file.metadata.path, req.file.key),
    //   },
    // ],
  };
  document_thread.messages.push(new_message);
  await document_thread.save();
  const document_thread2 = await Documentthread.findById(
    messagesThreadId
  ).populate("student_id application_id messages.user_id");
  res.status(200).send({ success: true, data: document_thread2 });
});
const SetStatusMessagesThread = asyncHandler(async (req, res) => {
  const {
    user,
    params: { messagesThreadId, studentId },
  } = req;

  const document_thread = await Documentthread.findById(messagesThreadId);
  const student = await Student.findById(studentId);

  if (!document_thread)
    throw new ErrorResponse(400, "Invalid message thread id");
  if (!student) throw new ErrorResponse(400, "Invalid student id id");
  // TODO: before delete the thread, please delete all of the files in the thread!!
  await Documentthread.findByIdAndDelete(messagesThreadId);
  // await Student.findByIdAndUpdate(studentId, {
  //   $pull: {
  //     generaldocs_threads: { doc_thread_id: { _id: messagesThreadId } },
  //   },
  // });

  const student2 = await Student.findById(studentId)
    .populate("generaldocs_threads.doc_thread_id")
    .populate("applications.programId");
  res.status(200).send({ success: true, data: student2 });
});
const deleteMessagesThread = asyncHandler(async (req, res) => {
  const {
    user,
    params: { messagesThreadId, studentId },
  } = req;

  const document_thread = await Documentthread.findById(messagesThreadId);
  const student = await Student.findById(studentId);

  if (!document_thread)
    throw new ErrorResponse(400, "Invalid message thread id");
  if (!student) throw new ErrorResponse(400, "Invalid student id id");
  // TODO: before delete the thread, please delete all of the files in the thread!!
  await Documentthread.findByIdAndDelete(messagesThreadId);
  await Student.findByIdAndUpdate(studentId, {
    $pull: {
      generaldocs_threads: { doc_thread_id: { _id: messagesThreadId } },
    },
  });

  const student2 = await Student.findById(studentId)
    .populate("generaldocs_threads.doc_thread_id")
    .populate("applications.programId");
  res.status(200).send({ success: true, data: student2 });
});

module.exports = {
  initGeneralMessagesThread,
  initApplicationMessagesThread,
  getMessages,
  postMessages,
  SetStatusMessagesThread,
  deleteMessagesThread,
};
