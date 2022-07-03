const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { Program } = require("../models/Program");
const { Documentthread } = require("../models/Documentthread");
const { Student, User } = require("../models/User");
const { asyncHandler } = require("../middlewares/error-handler");

const { ErrorResponse } = require("../common/errors");
const {
  UPLOAD_PATH,
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
} = require("../config");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpg",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

var aws = require("aws-sdk");
var multerS3 = require("multer-s3");

var s3 = new aws.S3({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY,
});

const some_str = () => {
  return "GeneralDocsEdit";
};
// Profile file upload
const storage_s3 = multerS3({
  s3: s3,
  bucket: function (req, file, cb) {
    var { studentId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId and applicationId exist
    var directory = path.join(AWS_S3_BUCKET_NAME, studentId);
    directory = directory.replace(/\\/, "/");
    console.log(directory);
    cb(null, directory);
  },
  metadata: function (req, file, cb) {
    var { studentId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId and applicationId exist
    var directory = studentId;
    cb(null, { fieldName: file.fieldname, path: directory });
  },
  key: function (req, file, cb) {
    // cb(null, file.originalname + "-" + Date.now().toString());
    // cb(null, file.originalname);
    var { studentId, applicationId } = req.params;

    Student.findOne({ _id: studentId })
      .populate("applications.programId")
      .lean()
      .exec()
      .then(function (student) {
        if (student) {
          var temp_name =
            student.lastname +
            "_" +
            student.firstname +
            "_" +
            req.params.category +
            path.extname(file.originalname);
          // const filePath = path.join(UPLOAD_PATH, studentId, temp_name);
          // if (fs.existsSync(filePath))
          //   return cb(new ErrorResponse(400, "Document already existed!22222"));

          return {
            fileName: temp_name,
          };
        }
      })
      .then(function (resp) {
        cb(null, resp.fileName);
      });
  },
});

/**
 * currently used by route
 *   /account/files/:studentId/:docName (student upload)
 */

// upload profile pdf/docx/image
const upload_profile_s3 = multer({
  storage: storage_s3,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype))
      return cb(
        new ErrorResponse(
          400,
          "Only .pdf .png, .jpg and .jpeg .docx format are allowed"
        )
      );
    const fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > MAX_FILE_SIZE) {
      return cb(new ErrorResponse(400, "File size is limited to 5 MB!"));
    }
    cb(null, true);
  },
});

// Message thread file upload (general)
const storage_messagesthread_file_s3 = multerS3({
  s3: s3,
  bucket: function (req, file, cb) {
    var { messagesThreadId, studentId } = req.params;
    // TODO: check studentId and messagesThreadId exist
    var directory = path.join(AWS_S3_BUCKET_NAME, studentId, messagesThreadId);
    directory = directory.replace(/\\/g, "/");
    cb(null, directory);
  },
  metadata: function (req, file, cb) {
    var { messagesThreadId, studentId } = req.params;

    // TODO: check studentId and messagesThreadId exist
    var directory = path.join(studentId, messagesThreadId);
    directory = directory.replace(/\\/g, "/"); // g>> replace all!
    cb(null, { fieldName: file.fieldname, path: directory });
  },
  key: function (req, file, cb) {
    // cb(null, file.originalname + "-" + Date.now().toString());
    // cb(null, file.originalname);
    var { messagesThreadId, studentId } = req.params;
    // console.log(messagesThreadId);
    Documentthread.findById(messagesThreadId)
      .populate("student_id")
      // .lean()
      // .exec()
      .then(function (thread) {
        if (thread) {
          var r2 = /[^\d]/;
          var version_number_max = 1;

          if (!thread)
            throw new ErrorResponse(400, "Invalid message thread id");

          thread.messages.forEach((message) => {
            message.file.forEach((file) => {
              var fileversion = 0;
              fileversion = parseInt(file.name.replace(/[^\d]/g, ""));

              if (fileversion > version_number_max) {
                version_number_max = fileversion; // get the max version number
              }
            });
          });

          var version_number = parseInt(version_number_max) + 1;
          var same_file_name = true;
          var temp_name =
            thread.student_id.lastname +
            "_" +
            thread.student_id.firstname +
            "_" +
            thread.file_type +
            "_v" +
            version_number.toString() +
            `${path.extname(file.originalname)}`;
          temp_name = temp_name.replace(/ /g, "_");
          // const filePath = path.join(
          //   UPLOAD_PATH,
          //   studentId,
          //   "GeneralDocsEdit",
          //   temp_name
          // );
          // if (thread.messages && thread.messages.length > 0) {
          //   let student_input_doc = thread.messages.find(
          //     ({ name }) => name === temp_name
          //   );

          //   if (student_input_doc) {
          //     version_number++;
          //   } else {
          //     same_file_name = false;
          //   }
          // } else {
          //   same_file_name = false;
          // }

          return {
            fileName: temp_name,
          };
        }
      })
      .then(function (resp) {
        cb(null, resp.fileName);
      });
  },
});

const upload_messagesthread_file_s3 = multer({
  storage: storage_messagesthread_file_s3,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype))
      return cb(
        new ErrorResponse(
          400,
          "Only .pdf .png, .jpg and .jpeg .docx format are allowed"
        )
      );
    const fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > MAX_FILE_SIZE) {
      return cb(new ErrorResponse(400, "File size is limited to 5 MB!"));
    }
    cb(null, true);
  },
});

/**
 * program specific files
 * currently used by route
 *   /account/files/:applicationId/:docName (student upload)
 *   /students/:studentId/applications/:applicationId/:docName (admin/agent upload)
 */

const storage_program_specific_s3 = multerS3({
  s3: s3,
  bucket: function (req, file, cb) {
    var { studentId, applicationId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId and applicationId exist
    var directory = path.join(AWS_S3_BUCKET_NAME, studentId, applicationId);
    directory = directory.replace(/\\/g, "/"); // g>> replace all!
    console.log(directory);
    cb(null, directory);
  },
  metadata: function (req, file, cb) {
    var { studentId, applicationId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId and applicationId exist
    var directory = path.join(studentId, applicationId);
    directory = directory.replace(/\\/g, "/"); // g>> replace all!
    cb(null, { fieldName: file.fieldname, path: directory });
  },
  key: function (req, file, cb) {
    var { studentId, applicationId, fileCategory } = req.params;
    var { user } = req;

    Student.findOne({ _id: studentId })
      .populate("applications.programId")
      .lean()
      .exec()
      .then(function (student) {
        if (student) {
          var r = /\d+/; //number pattern
          var version_number_max = 1;
          var application = student.applications.find(
            ({ programId }) => programId._id == applicationId
          );
          if (user.role === "Student") {
            application.student_inputs.forEach((student_input) => {
              if (student_input.name.includes(fileCategory)) {
                if (
                  student_input.name.match(r) !== null &&
                  student_input.name.match(r)[0] > version_number_max
                ) {
                  version_number_max = student_input.name.match(r)[0]; // get the max version number
                }
              }
            });
          } else {
            application.documents.forEach((editoroutput) => {
              if (editoroutput.name.includes(fileCategory)) {
                if (
                  editoroutput.name.match(r) !== null &&
                  editoroutput.name.match(r)[0] > version_number_max
                ) {
                  version_number_max = editoroutput.name.match(r)[0]; // get the max version number
                }
              }
            });
          }

          var version_number = version_number_max;
          var same_file_name = true;
          while (same_file_name) {
            // console.log(application.programId);
            var temp_name =
              student.lastname +
              "_" +
              student.firstname +
              "_" +
              application.programId.school +
              "_" +
              application.programId.program_name +
              "_" +
              fileCategory +
              "_v" +
              version_number +
              `${path.extname(file.originalname)}`;
            temp_name = temp_name.replace(/ /g, "_");
            //TODO: check if existed in S3?, or in Database
            const filePath = path.join(
              UPLOAD_PATH,
              studentId,
              applicationId,
              temp_name
            );

            let student_input_doc = application.student_inputs.find(
              ({ name }) => name === temp_name
            );
            let editor_output_doc = application.documents.find(
              ({ name }) => name === temp_name
            );
            if (editor_output_doc || student_input_doc) {
              version_number++;
            } else {
              same_file_name = false;
            }
          }
          return {
            fileName: temp_name,
          };
        }
      })
      .then(function (resp) {
        // console.log(resp.fileName);
        cb(null, resp.fileName);
      });
  },
});

// upload pdf/docx/image
const upload_program_specific_s3 = multer({
  storage: storage_program_specific_s3,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype))
      return cb(
        new ErrorResponse(
          400,
          "Only .pdf .png, .jpg and .jpeg .docx format are allowed"
        )
      );
    const fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > MAX_FILE_SIZE) {
      return cb(new ErrorResponse(400, "File size is limited to 5 MB!"));
    }
    cb(null, true);
  },
});

// const transcript_excel_storage3 = multer.diskStorage({
//   destination: (req, file, cb) => {
//     var { studentId } = req.params;
//     if (!studentId) studentId = String(req.user._id);

//     // TODO: check studentId exist
//     const directory = path.join(UPLOAD_PATH, studentId);
//     if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

//     return cb(null, directory);
//   },
//   filename: (req, file, cb) => {
//     // TODO: check category exist
//     var { studentId } = req.params;
//     try {
//       User.findOne({ _id: studentId })
//         .then(function (student) {
//           if (student) {
//             var temp_name =
//               student.lastname +
//               "_" +
//               student.firstname +
//               "_" +
//               "TaiGerTranscriptAI" +
//               path.extname(file.originalname);
//             // console.log(temp_name);
//             const filePath = path.join(UPLOAD_PATH, studentId, temp_name);
//             // if (fs.existsSync(filePath))
//             //   return cb(
//             //     new ErrorResponse(400, "Document already existed!33333")
//             //   );
//             return {
//               fileName: temp_name,
//             };
//           }
//         })
//         .then(function (resp) {
//           cb(null, resp.fileName);
//         });
//     } catch (err) {
//       console.log(err);
//     }

//     // cb(null, `${req.params.category}${path.extname(file.originalname)}`);
//   },
// });

//TODO: upload pdf/docx/image
// TranscriptExcelUpload

const transcript_excel_storage3 = multerS3({
  s3: s3,
  bucket: function (req, file, cb) {
    var { studentId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId and applicationId exist
    var directory = path.join(AWS_S3_BUCKET_NAME, studentId);
    directory = directory.replace(/\\/g, "/");
    console.log(directory);
    cb(null, directory);
  },
  metadata: function (req, file, cb) {
    var { studentId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId and applicationId exist
    var directory = studentId;
    cb(null, { fieldName: file.fieldname, path: directory });
  },
  key: function (req, file, cb) {
    var { studentId, applicationId, fileCategory } = req.params;
    var { user } = req;

    User.findOne({ _id: studentId })
      .then(function (student) {
        if (student) {
          var temp_name =
            student.lastname +
            "_" +
            student.firstname +
            "_" +
            "TaiGerTranscriptAI" +
            path.extname(file.originalname);
          // console.log(temp_name);
          const filePath = path.join(UPLOAD_PATH, studentId, temp_name);
          // if (fs.existsSync(filePath))
          //   return cb(
          //     new ErrorResponse(400, "Document already existed!33333")
          //   );
          return {
            fileName: temp_name,
          };
        }
      })
      .then(function (resp) {
        cb(null, resp.fileName);
      });
  },
});

const upload_transcript_s3 = multer({
  storage: transcript_excel_storage3,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype))
      return cb(
        new ErrorResponse(
          400,
          "Only .pdf .png, .jpg and .jpeg .docx format are allowed"
        )
      );
    const fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > MAX_FILE_SIZE) {
      return cb(new ErrorResponse(400, "File size is limited to 5 MB!"));
    }
    cb(null, true);
  },
});

// General docs: CV
const storage_general_s3 = multerS3({
  s3: s3,
  bucket: function (req, file, cb) {
    var { studentId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId and applicationId exist
    var directory = path.join(AWS_S3_BUCKET_NAME, studentId, some_str());
    directory = directory.replace(/\\/g, "/");
    console.log(directory);
    cb(null, directory);
  },
  metadata: function (req, file, cb) {
    var { studentId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId and applicationId exist
    var directory = path.join(studentId, some_str());
    directory = directory.replace(/\\/g, "/"); // g>> replace all!
    cb(null, { fieldName: file.fieldname, path: directory });
  },
  key: function (req, file, cb) {
    var { studentId, applicationId, fileCategory } = req.params;
    var { user } = req;

    Student.findOne({ _id: studentId })
      .then(function (student) {
        if (student) {
          var r = /\d+/; //number pattern
          var version_number_max = 1;
          if (user.role === "Student") {
            student.generaldocs.studentinputs.forEach((studentinput) => {
              if (studentinput.name.includes(fileCategory)) {
                if (
                  studentinput.name.match(r) !== null &&
                  studentinput.name.match(r)[0] > version_number_max
                ) {
                  version_number_max = studentinput.name.match(r)[0]; // get the max version number
                }
              }
            });
          } else {
            student.generaldocs.editoroutputs.forEach((editoroutput) => {
              if (editoroutput.name.includes(fileCategory)) {
                if (
                  editoroutput.name.match(r) !== null &&
                  editoroutput.name.match(r)[0] > version_number_max
                ) {
                  version_number_max = editoroutput.name.match(r)[0]; // get the max version number
                }
              }
            });
          }
          var version_number = version_number_max;
          var same_file_name = true;
          while (same_file_name) {
            var temp_name =
              student.lastname +
              "_" +
              student.firstname +
              "_" +
              fileCategory +
              "_v" +
              version_number +
              `${path.extname(file.originalname)}`;
            temp_name = temp_name.replace(/ /g, "_");
            const filePath = path.join(
              UPLOAD_PATH,
              studentId,
              "GeneralDocsEdit",
              temp_name
            );

            let student_input_doc = student.generaldocs.studentinputs.find(
              ({ name }) => name === temp_name
            );
            let editor_output_doc = student.generaldocs.editoroutputs.find(
              ({ name }) => name === temp_name
            );
            if (editor_output_doc || student_input_doc) {
              version_number++;
            } else {
              same_file_name = false;
            }
          }
          return {
            fileName: temp_name,
          };
        }
      })
      .then(function (resp) {
        cb(null, resp.fileName);
      });
  },
});

//TODO: upload pdf/docx/image
const editor_generaldoc_s3 = multer({
  storage: storage_general_s3,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype))
      return cb(
        new ErrorResponse(
          400,
          "Only .pdf .png, .jpg and .jpeg .docx format are allowed"
        )
      );
    const fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > MAX_FILE_SIZE) {
      return cb(new ErrorResponse(400, "File size is limited to 5 MB!"));
    }
    cb(null, true);
  },
});

const test_file_json = (req, res, next) => {
  const {
    user,
    // params: { messagesThreadId },
  } = req;
  var { messagesThreadId } = req.params;
  var { studentId } = req.body;
  // console.log(req);
  console.log(req);
  console.log(req.body);
  console.log(messagesThreadId);
  // const document_thread = await Documentthread.findById(
  //   messagesThreadId
  // ).populate("student_id application_id messages.user_id");

  // if (!document_thread)
  //   throw new ErrorResponse(400, "Invalid message thread id");

  // console.log(messagesThreadId);

  next();
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.body);
    console.log(file);
    cb(null, "upload/");
  },
  filename: function (req, file, cb) {
    console.log(req.body);
    console.log(file);
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });
module.exports = {
  fileUpload: upload_program_specific_s3.single("file"),
  ProfilefileUpload: upload_profile_s3.single("file"),
  TranscriptExcelUpload: upload_transcript_s3.single("file"),
  EditGeneralDocsUpload: editor_generaldoc_s3.single("file"),
  MessagesThreadUpload: upload_messagesthread_file_s3.single("file"),
  test_file_json,
  upload: upload.single("file"),
};
