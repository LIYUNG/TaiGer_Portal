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
  const student = await Student.findById(studentId);

  if (!student) throw new ErrorResponse(400, "Invalid student id");
  var generaldocs_thread_existed;
  var student_valid;
  if (student.generaldocs_threads) {
    student_valid = await Student.findById(studentId).populate(
      "generaldocs_threads.doc_thread_id"
    );
    generaldocs_thread_existed = student_valid.generaldocs_threads.find(
      ({ generaldocs_thread }) =>
        generaldocs_thread
          ? null
          : generaldocs_thread.file_type === document_catgory
    );
  }

  if (generaldocs_thread_existed)
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
  // student.generaldocs_threads.push(generaldocs_thread_existed);
  await student.save();
  res
    .status(200)
    .send({ success: true, data: ["initGeneralMessagesThread success!"] });
});

// const saveGeneralFilePath = asyncHandler(async (req, res) => {
//   const {
//     user,
//     params: { studentId, fileCategory },
//     file: { filename },
//   } = req;

//   // retrieve studentId differently depend on if student or Admin/Agent uploading the file
//   const student = await Student.findById(studentId)
//     .populate("applications.programId")
//     .populate("students agents editors", "firstname lastname email");
//   if (!student) throw new ErrorResponse(400, "Invalid student id");
//   var editor_output_doc;
//   var student_input_doc;
//   if (user.role == Role.Student) {
//     student_input_doc = student.generaldocs.studentinputs.find(
//       ({ name }) => name === req.file.key
//     );
//     if (student_input_doc)
//       throw new ErrorResponse(400, "Document already existed!");
//     student_input_doc = student.generaldocs.studentinputs.create({
//       name: req.file.key,
//     });
//     student_input_doc.status = DocumentStatus.Uploaded;
//     student_input_doc.path = path.join(req.file.metadata.path, req.file.key);
//     student_input_doc.required = true;
//     student_input_doc.updatedAt = new Date();
//     student.generaldocs.studentinputs.push(student_input_doc);
//     // TODO: set flag editors document(filetype) isReceivedFeedback
//     await student.save();
//     res.status(201).send({ success: true, data: student });
//     await sendUploadedGeneralFilesRemindForStudentEmail(
//       // Upload success confirmation.
//       {
//         firstname: student.firstname,
//         lastname: student.lastname,
//         address: student.email,
//       },
//       {
//         uploaded_documentname: student_input_doc.name,
//         uploaded_updatedAt: student_input_doc.updatedAt,
//       }
//     );
//     for (let i = 0; i < student.editors.length; i++) {
//       // console.log(i);
//       await sendUploadedGeneralFilesRemindForEditorEmail(
//         {
//           firstname: student.editors[i].firstname,
//           lastname: student.editors[i].lastname,
//           address: student.editors[i].email,
//         },
//         {
//           student_firstname: student.firstname,
//           student_lastname: student.lastname,
//           uploaded_documentname: student_input_doc.name,
//           uploaded_updatedAt: student_input_doc.updatedAt,
//           fileCategory: fileCategory,
//         }
//       );
//     }
//     for (let i = 0; i < student.agents.length; i++) {
//       // console.log(i);
//       await sendUploadedGeneralFilesRemindForAgentEmail(
//         {
//           firstname: student.agents[i].firstname,
//           lastname: student.agents[i].lastname,
//           address: student.agents[i].email,
//         },
//         {
//           student_firstname: student.firstname,
//           student_lastname: student.lastname,
//           uploaded_documentname: student_input_doc.name,
//           uploaded_updatedAt: student_input_doc.updatedAt,
//           fileCategory: fileCategory,
//         }
//       );
//     }
//   } else {
//     editor_output_doc = student.generaldocs.editoroutputs.find(
//       ({ name }) => name === req.file.key
//     );
//     if (editor_output_doc)
//       throw new ErrorResponse(400, "Document already existed!");
//     editor_output_doc = student.generaldocs.editoroutputs.create({
//       name: req.file.key,
//     }); //TODO: and rename file name
//     editor_output_doc.status = DocumentStatus.Uploaded;
//     editor_output_doc.path = path.join(req.file.metadata.path, req.file.key);
//     editor_output_doc.required = true;
//     editor_output_doc.updatedAt = new Date();
//     student.generaldocs.editoroutputs.push(editor_output_doc); //TODO: and rename file name
//     // TODO: set flag student document(filetype) isReceivedFeedback
//     await student.save();
//     res.status(201).send({ success: true, data: student });
//     await sendEditorOutputGeneralFilesEmailToStudent(
//       // Upload success confirmation.
//       {
//         firstname: student.firstname,
//         lastname: student.lastname,
//         address: student.email,
//       },
//       {
//         uploaded_documentname: editor_output_doc.name,
//         uploaded_updatedAt: editor_output_doc.updatedAt,
//         fileCategory: fileCategory,
//       }
//     );
//     //TODO: uploaded file confirmation for Editor?
//     //uploaded file notification for Agent?
//     for (let i = 0; i < student.agents.length; i++) {
//       // console.log(i);
//       await sendEditorOutputGeneralFilesEmailToAgent(
//         // Upload success confirmation.
//         {
//           firstname: student.agents[i].firstname,
//           lastname: student.agents[i].lastname,
//           address: student.agents[i].email,
//         },
//         {
//           student_firstname: student.firstname,
//           student_lastname: student.lastname,
//           editor_firstname: user.firstname,
//           editor_lastname: user.lastname,
//           uploaded_documentname: editor_output_doc.name,
//           uploaded_updatedAt: editor_output_doc.updatedAt,
//           fileCategory: fileCategory,
//         }
//       );
//     }
//   }

//   //Reminder for Editor:
//   // console.log(student.editors);
//   if (user.role == Role.Student) {
//   }
// });

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
  const { user } = req;
  res.status(200).send({ success: true, data: "getMessages success!" });
});
const postMessages = asyncHandler(async (req, res) => {
  const { user } = req;
  res.status(200).send({ success: true, data: "postMessages success!" });
});

module.exports = {
  initGeneralMessagesThread,
  initApplicationMessagesThread,
  getMessages,
  postMessages,
};
