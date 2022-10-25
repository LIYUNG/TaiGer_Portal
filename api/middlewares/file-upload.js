const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { Program } = require('../models/Program');
const { Documentthread } = require('../models/Documentthread');
const { Role, Student, User } = require('../models/User');
const { asyncHandler } = require('../middlewares/error-handler');
const uuid = require('uuid');
const { ErrorResponse } = require('../common/errors');
const {
  UPLOAD_PATH,
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME
} = require('../config');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpg',
  'image/jpeg',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const ALLOWED_PDF_MIME_TYPES = ['application/pdf'];

const ALLOWED_MIME_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

var aws = require('aws-sdk');
var multerS3 = require('multer-s3');

var s3 = new aws.S3({
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY
});

const some_str = () => {
  return 'GeneralDocsEdit';
};

// Template file upload
const template_storage_s3 = multerS3({
  s3,
  bucket: function (req, file, cb) {
    var { category_name } = req.params;

    var directory = path.join(AWS_S3_BUCKET_NAME, 'taiger_template');
    directory = directory.replace(/\\/, '/');
    cb(null, directory);
  },
  metadata: function (req, file, cb) {
    var { category_name } = req.params;
    var directory = 'taiger_template';
    cb(null, { fieldName: file.fieldname, path: directory });
  },
  key: function (req, file, cb) {
    var { category_name } = req.params;
    var temp_name =
      category_name + '_TaiGer_Template' + path.extname(file.originalname);
    cb(null, temp_name);
  }
});
// upload template pdf/docx/image
const upload_template_s3 = multer({
  storage: template_storage_s3,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype))
      return cb(
        new ErrorResponse(
          400,
          'Only .pdf .png, .jpg and .jpeg .docx format are allowed'
        )
      );
    const fileSize = parseInt(req.headers['content-length']);
    if (fileSize > MAX_FILE_SIZE) {
      return cb(new ErrorResponse(400, 'File size is limited to 5 MB!'));
    }
    cb(null, true);
  }
});

// VPD file upload
const storage_vpd_s3 = multerS3({
  s3,
  bucket: function (req, file, cb) {
    var { studentId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId exist
    let directory = path.join(AWS_S3_BUCKET_NAME, studentId, 'vpd');
    // var directory = path.join(AWS_S3_BUCKET_NAME, studentId);
    directory = directory.replace(/\\/g, '/');
    cb(null, directory);
  },
  metadata: function (req, file, cb) {
    var { studentId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId exist
    let directory = path.join(studentId, 'vpd');
    directory = directory.replace(/\\/g, '/'); // g>> replace all!
    // var directory = studentId;
    cb(null, { fieldName: file.fieldname, path: directory });
  },
  key: function (req, file, cb) {
    var { studentId, program_id } = req.params;

    Student.findById(studentId).then(function (student) {
      if (student) {
        Program.findById(program_id).then((program) => {
          let program_name = program.school + ' ' + program.program_name;
          var temp_name =
            student.lastname +
            '_' +
            student.firstname +
            '_' +
            program_name +
            '_' +
            'VPD' +
            path.extname(file.originalname);
          temp_name = temp_name.replace(/ /g, '_');
          cb(null, temp_name);
        });
      }
    });
  }
});

// Profile file upload
const storage_s3 = multerS3({
  s3,
  bucket: function (req, file, cb) {
    var { studentId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId exist
    var directory = path.join(AWS_S3_BUCKET_NAME, studentId);
    directory = directory.replace(/\\/, '/');
    cb(null, directory);
  },
  metadata: function (req, file, cb) {
    var { studentId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId exist
    var directory = studentId;
    cb(null, { fieldName: file.fieldname, path: directory });
  },
  key: function (req, file, cb) {
    // cb(null, file.originalname + "-" + Date.now().toString());
    // cb(null, file.originalname);
    var { studentId } = req.params;

    Student.findOne({ _id: studentId })
      .populate('applications.programId')
      .lean()
      .exec()
      .then(function (student) {
        if (student) {
          var temp_name =
            student.lastname +
            '_' +
            student.firstname +
            '_' +
            req.params.category +
            path.extname(file.originalname);

          return {
            fileName: temp_name
          };
        }
      })
      .then(function (resp) {
        cb(null, resp.fileName);
      });
  }
});

const doc_image_s3 = multerS3({
  s3,
  bucket: function (req, file, cb) {
    var directory = AWS_S3_BUCKET_NAME;
    cb(null, directory);
  },
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname, path: '' });
  },
  key: function (req, file, cb) {
    var id = uuid.v4();
    const fileName = id + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const upload_doc_image_s3 = multer({
  storage: doc_image_s3,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_IMAGE_TYPES.includes(file.mimetype))
      return cb(
        new ErrorResponse(400, 'Only .png, .jpg and .jpeg format are allowed')
      );
    const fileSize = parseInt(req.headers['content-length']);
    if (fileSize > MAX_FILE_SIZE) {
      return cb(new ErrorResponse(400, 'File size is limited to 5 MB!'));
    }
    cb(null, true);
  }
});

const upload_vpd_s3 = multer({
  storage: storage_vpd_s3,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_PDF_MIME_TYPES.includes(file.mimetype))
      return cb(new ErrorResponse(400, 'Only .pdf format is allowed'));
    const fileSize = parseInt(req.headers['content-length']);
    if (fileSize > MAX_FILE_SIZE) {
      return cb(new ErrorResponse(400, 'File size is limited to 5 MB!'));
    }
    cb(null, true);
  }
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
          'Only .pdf .png, .jpg and .jpeg .docx format are allowed'
        )
      );
    const fileSize = parseInt(req.headers['content-length']);
    if (fileSize > MAX_FILE_SIZE) {
      return cb(new ErrorResponse(400, 'File size is limited to 5 MB!'));
    }
    cb(null, true);
  }
});

// Message thread file upload (general)
const storage_messagesthread_file_s3 = multerS3({
  s3,
  bucket: function (req, file, cb) {
    const { messagesThreadId, studentId } = req.params;
    // TODO: check studentId and messagesThreadId exist
    let directory = path.join(AWS_S3_BUCKET_NAME, studentId, messagesThreadId);
    directory = directory.replace(/\\/g, '/');
    cb(null, directory);
  },
  metadata: function (req, file, cb) {
    const { messagesThreadId, studentId } = req.params;

    // TODO: check studentId and messagesThreadId exist
    let directory = path.join(studentId, messagesThreadId);
    directory = directory.replace(/\\/g, '/'); // g>> replace all!
    cb(null, { fieldName: file.fieldname, path: directory });
  },
  key: function (req, file, cb) {
    // cb(null, file.originalname + "-" + Date.now().toString());
    // cb(null, file.originalname);
    var { messagesThreadId, studentId } = req.params;
    Documentthread.findById(messagesThreadId)
      .populate('student_id')
      .then(function (thread) {
        if (!thread) {
          throw new ErrorResponse(400, 'Invalid message thread id');
        }
        let program_name = '';
        if (thread.program_id) {
          Program.findById(thread.program_id).then((program) => {
            program_name = program.school + '_' + program.program_name;
            console.log(program_name);
            var r2 = /[^\d]/;
            var version_number_max = 0;

            thread.messages.forEach((message) => {
              message.file.forEach((file) => {
                var fileversion = 0;
                fileversion = parseInt(file.name.replace(/[^\d]/g, ''));

                if (fileversion > version_number_max) {
                  version_number_max = fileversion; // get the max version number
                }
              });
            });

            var version_number = parseInt(version_number_max) + 1;
            var same_file_name = true;
            var temp_name =
              thread.student_id.lastname +
              '_' +
              thread.student_id.firstname +
              '_' +
              program_name +
              '_' +
              thread.file_type +
              '_v' +
              version_number.toString() +
              `${path.extname(file.originalname)}`;
            temp_name = temp_name.replace(/ /g, '_');

            cb(null, temp_name);
          });
        } else {
          var r2 = /[^\d]/;
          var version_number_max = 0;

          thread.messages.forEach((message) => {
            message.file.forEach((file) => {
              var fileversion = 0;
              fileversion = parseInt(file.name.replace(/[^\d]/g, ''));

              if (fileversion > version_number_max) {
                version_number_max = fileversion; // get the max version number
              }
            });
          });

          var version_number = parseInt(version_number_max) + 1;
          var same_file_name = true;
          var temp_name =
            thread.student_id.lastname +
            '_' +
            thread.student_id.firstname +
            '_' +
            program_name +
            '_' +
            thread.file_type +
            '_v' +
            version_number.toString() +
            `${path.extname(file.originalname)}`;
          temp_name = temp_name.replace(/ /g, '_');
          cb(null, temp_name);
        }
      });
  }
});

const upload_messagesthread_file_s3 = multer({
  storage: storage_messagesthread_file_s3,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new ErrorResponse(
          400,
          'Only .pdf .png, .jpg and .jpeg .docx format are allowed'
        )
      );
    }
    const fileSize = parseInt(req.headers['content-length']);
    if (fileSize > MAX_FILE_SIZE) {
      return cb(new ErrorResponse(400, 'File size is limited to 5 MB!'));
    }
    cb(null, true);
  }
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
//
//     }

//     // cb(null, `${req.params.category}${path.extname(file.originalname)}`);
//   },
// });

// TODO: upload pdf/docx/image
// TranscriptExcelUpload

const transcript_excel_storage3 = multerS3({
  s3,
  bucket: function (req, _file, cb) {
    var { studentId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId and applicationId exist
    var directory = path.join(AWS_S3_BUCKET_NAME, studentId);
    directory = directory.replace(/\\/g, '/');
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
            '_' +
            student.firstname +
            '_' +
            'TaiGerTranscriptAI' +
            path.extname(file.originalname);
          const filePath = path.join(UPLOAD_PATH, studentId, temp_name);
          // if (fs.existsSync(filePath))
          //   return cb(
          //     new ErrorResponse(400, "Document already existed!33333")
          //   );
          return {
            fileName: temp_name
          };
        }
      })
      .then(function (resp) {
        cb(null, resp.fileName);
      });
  }
});

const upload_transcript_s3 = multer({
  storage: transcript_excel_storage3,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new ErrorResponse(
          400,
          'Only .pdf .png, .jpg and .jpeg .docx format are allowed'
        )
      );
    }
    const fileSize = parseInt(req.headers['content-length']);
    if (fileSize > MAX_FILE_SIZE) {
      return cb(new ErrorResponse(400, 'File size is limited to 5 MB!'));
    }
    cb(null, true);
  }
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

module.exports = {
  imageUpload: upload_doc_image_s3.single('file'),
  VPDfileUpload: upload_vpd_s3.single('file'),
  ProfilefileUpload: upload_profile_s3.single('file'),
  TemplatefileUpload: upload_template_s3.single('file'),
  TranscriptExcelUpload: upload_transcript_s3.single('file'),
  MessagesThreadUpload: upload_messagesthread_file_s3.single('file'),
  upload: upload.single('file')
};
