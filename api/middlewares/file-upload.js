const path = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid');
const { Program } = require('../models/Program');
const { Documentthread } = require('../models/Documentthread');
const { Student } = require('../models/User');
const { ErrorResponse } = require('../common/errors');
const { AWS_S3_BUCKET_NAME, AWS_S3_PUBLIC_BUCKET_NAME } = require('../config');
const { s3 } = require('../aws/index');

const MAX_FILE_SIZE_MB = 2 * 1024 * 1024; // 2 MB
const MAX_DOC_FILE_SIZE_MB = 1 * 1024 * 1024; // 1 MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpg',
  'image/jpeg',
  'application/vnd.ms-excel',
  'application/vnd.ms-excel.sheet.macroenabled.12',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const ALLOWED_MIME_PDF_TYPES = ['application/pdf'];

const ALLOWED_MIME_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

// Template file upload
const template_storage_s3 = multerS3({
  s3,
  bucket: (req, file, cb) => {
    let directory = path.join(AWS_S3_PUBLIC_BUCKET_NAME, 'taiger_template');
    directory = directory.replace(/\\/, '/');
    cb(null, directory);
  },
  metadata: (req, file, cb) => {
    const directory = 'taiger_template';
    cb(null, { fieldName: file.fieldname, path: directory });
  },
  key: (req, file, cb) => {
    const { category_name } = req.params;
    let temp_name = `${category_name}_TaiGer_Template${path.extname(
      file.originalname
    )}`;
    temp_name = temp_name.replace(/\//g, '_');

    cb(null, temp_name);
  }
});
// upload template pdf/docx/image
const upload_template_s3 = multer({
  storage: template_storage_s3,
  limits: { fileSize: MAX_FILE_SIZE_MB },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new ErrorResponse(
          415,
          'Only .xls .xlsx .xlsm .pdf .png, .jpg and .jpeg .docx format are allowed'
        )
      );
    }

    const fileSize = parseInt(req.headers['content-length'], 10);
    if (fileSize > MAX_FILE_SIZE_MB) {
      return cb(
        new ErrorResponse(
          413,
          `您的檔案不得超過 ${
            MAX_FILE_SIZE_MB / (1024 * 1024)
          } MB / File size is limited to ${
            MAX_FILE_SIZE_MB / (1024 * 1024)
          } MB!`
        )
      );
    }
    cb(null, true);
  }
});

// VPD file upload
const storage_vpd_s3 = multerS3({
  s3,
  bucket: (req, file, cb) => {
    let { studentId } = req.params;
    // eslint-disable-next-line no-underscore-dangle
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId exist
    let directory = path.join(AWS_S3_BUCKET_NAME, studentId);
    // var directory = path.join(AWS_S3_BUCKET_NAME, studentId);
    directory = directory.replace(/\\/g, '/');
    cb(null, directory);
  },
  metadata: (req, file, cb) => {
    let { studentId } = req.params;
    // eslint-disable-next-line no-underscore-dangle
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId exist
    let directory = path.join(studentId);
    directory = directory.replace(/\\/g, '/');
    cb(null, { fieldName: file.fieldname, path: directory });
  },
  key: (req, file, cb) => {
    const { studentId, program_id, fileType } = req.params;

    Student.findById(studentId).then((student) => {
      if (student) {
        Program.findById(program_id).then((program) => {
          const program_name = `${program.school} ${program.program_name}`;
          let temp_name = `${student.lastname}_${
            student.firstname
          }_${program_name}_${fileType}${path.extname(file.originalname)}`;
          temp_name = temp_name.replace(/ /g, '_');
          temp_name = temp_name.replace(/\//g, '_');
          cb(null, temp_name);
        });
      }
    });
  }
});

// Profile file upload
const storage_profile_s3 = multerS3({
  s3,
  bucket: (req, file, cb) => {
    let { studentId } = req.params;
    // eslint-disable-next-line no-underscore-dangle
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId exist
    let directory = path.join(AWS_S3_BUCKET_NAME, studentId);
    directory = directory.replace(/\\/, '/');
    cb(null, directory);
  },
  metadata: (req, file, cb) => {
    let { studentId } = req.params;
    // eslint-disable-next-line no-underscore-dangle
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId exist
    const directory = studentId;
    cb(null, { fieldName: file.fieldname, path: directory });
  },
  key: (req, file, cb) => {
    // cb(null, file.originalname + "-" + Date.now().toString());
    // cb(null, file.originalname);
    const { studentId } = req.params;

    Student.findOne({ _id: studentId })
      .populate('applications.programId')
      .lean()
      .exec()
      .then((student) => {
        if (student) {
          let temp_name = `${student.lastname}_${student.firstname}_${
            req.params.category
          }${path.extname(file.originalname).toLowerCase()}`;
          temp_name = temp_name.replace(/\//g, '_');

          return {
            fileName: temp_name
          };
        }
      })
      .then((resp) => {
        cb(null, resp.fileName);
      });
  }
});

const doc_image_s3 = multerS3({
  s3,
  bucket: (req, file, cb) => {
    let directory = path.join(AWS_S3_PUBLIC_BUCKET_NAME, 'Documentations');
    directory = directory.replace(/\\/, '/');
    cb(null, directory);
  },
  metadata: (req, file, cb) => {
    const directory = 'Documentations';
    cb(null, { fieldName: file.fieldname, path: directory });
  },
  key: (req, file, cb) => {
    const id = uuid.v4();
    const fileName = id + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const doc_docs_s3 = multerS3({
  s3,
  bucket: (req, file, cb) => {
    let directory = path.join(AWS_S3_PUBLIC_BUCKET_NAME, 'Documentations');
    directory = directory.replace(/\\/, '/');
    cb(null, directory);
  },
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname, path: '' });
  },
  key: (req, file, cb) => {
    // var id = uuid.v4();
    // const fileName = id + path.extname(file.originalname);
    const fileName = file.originalname;
    cb(null, fileName);
  }
});

const admission_letter_s3 = multerS3({
  s3,
  bucket: (req, file, cb) => {
    const { studentId } = req.params;
    let directory = path.join(AWS_S3_BUCKET_NAME, studentId, 'admission');
    directory = directory.replace(/\\/g, '/');
    cb(null, directory);
  },
  metadata: (req, file, cb) => {
    const { studentId } = req.params;
    let directory = path.join(studentId, 'admission');
    directory = directory.replace(/\\/g, '/'); // g>> replace all!
    cb(null, { fieldName: file.fieldname, path: directory });
  },
  key: (req, file, cb) => {
    const { studentId, programId, result } = req.params;
    const admission_status = result === 'O' ? 'Admission' : 'Rejection';

    Student.findById(studentId).then((student) => {
      if (student) {
        Program.findById(programId).then((program) => {
          const program_name = `${program.school} ${program.program_name} ${program.degree} ${program.semester}`;
          let temp_name = `${student.lastname}_${
            student.firstname
          }_${program_name}_${admission_status}${path.extname(
            file.originalname
          )}`;
          temp_name = temp_name.replace(/ /g, '_');
          temp_name = temp_name.replace(/\//g, '_');
          cb(null, temp_name);
        });
      }
    });
  }
});

const upload_admission_letter_s3 = multer({
  storage: admission_letter_s3,
  limits: { fileSize: MAX_FILE_SIZE_MB },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_PDF_TYPES.includes(file.mimetype)) {
      return cb(new ErrorResponse(415, 'Only .pdf format is allowed'));
    }
    const fileSize = parseInt(req.headers['content-length'], 10);
    if (fileSize > MAX_FILE_SIZE_MB) {
      return cb(
        new ErrorResponse(
          413,
          `您的檔案不得超過 ${
            MAX_FILE_SIZE_MB / (1024 * 1024)
          } MB / File size is limited to ${
            MAX_FILE_SIZE_MB / (1024 * 1024)
          } MB!`
        )
      );
    }
    cb(null, true);
  }
});

const upload_doc_image_s3 = multer({
  storage: doc_image_s3,
  limits: { fileSize: MAX_FILE_SIZE_MB },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_IMAGE_TYPES.includes(file.mimetype)) {
      return cb(
        new ErrorResponse(415, 'Only .png, .jpg and .jpeg format are allowed')
      );
    }
    const fileSize = parseInt(req.headers['content-length'], 10);
    if (fileSize > MAX_FILE_SIZE_MB) {
      return cb(
        new ErrorResponse(
          413,
          `您的檔案不得超過 ${
            MAX_FILE_SIZE_MB / (1024 * 1024)
          } MB / File size is limited to ${
            MAX_FILE_SIZE_MB / (1024 * 1024)
          } MB!`
        )
      );
    }
    cb(null, true);
  }
});

const upload_doc_docs_s3 = multer({
  storage: doc_docs_s3,
  limits: { fileSize: MAX_FILE_SIZE_MB },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new ErrorResponse(
          415,
          'Only .xls .xlsx .xlsm .pdf .png, .jpg and .jpeg .docx format are allowed'
        )
      );
    }

    const fileSize = parseInt(req.headers['content-length'], 10);
    if (fileSize > MAX_FILE_SIZE_MB) {
      return cb(
        new ErrorResponse(
          413,
          `您的檔案不得超過 ${
            MAX_FILE_SIZE_MB / (1024 * 1024)
          } MB / File size is limited to ${
            MAX_FILE_SIZE_MB / (1024 * 1024)
          } MB!`
        )
      );
    }
    cb(null, true);
  }
});

const upload_vpd_s3 = multer({
  storage: storage_vpd_s3,
  limits: { fileSize: MAX_FILE_SIZE_MB },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_PDF_TYPES.includes(file.mimetype)) {
      return cb(new ErrorResponse(415, 'Only .pdf format is allowed'));
    }
    const fileSize = parseInt(req.headers['content-length'], 10);
    if (fileSize > MAX_FILE_SIZE_MB) {
      return cb(
        new ErrorResponse(
          413,
          `您的檔案不得超過 ${
            MAX_FILE_SIZE_MB / (1024 * 1024)
          } MB / File size is limited to ${
            MAX_FILE_SIZE_MB / (1024 * 1024)
          } MB!`
        )
      );
    }
    cb(null, true);
  }
});

/**
 * currently used by route
 *   /account/files/:studentId/:docName (student upload)
 */

const upload_profile_s3 = multer({
  storage: storage_profile_s3,
  limits: { fileSize: MAX_FILE_SIZE_MB },
  fileFilter: (req, file, cb) => {
    const { category } = req.params;
    if (category === 'Passport_Photo') {
      if (!ALLOWED_MIME_IMAGE_TYPES.includes(file.mimetype)) {
        return cb(
          new ErrorResponse(415, 'Only .png, .jpg and .jpeg format are allowed')
        );
      }
    } else if (!ALLOWED_MIME_PDF_TYPES.includes(file.mimetype)) {
      return cb(new ErrorResponse(415, 'Only .pdf format are allowed'));
    }

    const fileSize = parseInt(req.headers['content-length'], 10);
    if (fileSize > MAX_FILE_SIZE_MB) {
      return cb(
        new ErrorResponse(
          413,
          `您的檔案不得超過 ${
            MAX_FILE_SIZE_MB / (1024 * 1024)
          } MB / File size is limited to ${
            MAX_FILE_SIZE_MB / (1024 * 1024)
          } MB!`
        )
      );
    }
    cb(null, true);
  }
});

// Message thread file upload (general)
const storage_messagesthread_file_s3 = multerS3({
  s3,
  bucket: (req, file, cb) => {
    const { messagesThreadId, studentId } = req.params;
    // TODO: check studentId and messagesThreadId exist
    let directory = path.join(AWS_S3_BUCKET_NAME, studentId, messagesThreadId);
    directory = directory.replace(/\\/g, '/');
    cb(null, directory);
  },
  metadata: (req, file, cb) => {
    const { messagesThreadId, studentId } = req.params;
    // TODO: check studentId and messagesThreadId exist
    let directory = path.join(studentId, messagesThreadId);
    directory = directory.replace(/\\/g, '/'); // g>> replace all!
    cb(null, { fieldName: file.fieldname, path: directory });
  },
  key: (req, file, cb) => {
    const { messagesThreadId } = req.params;
    Documentthread.findById(messagesThreadId)
      .populate('student_id')
      .then((thread) => {
        if (!thread) {
          throw new ErrorResponse(404, 'Thread not found');
        }
        let program_name = '';
        if (thread.program_id) {
          Program.findById(thread.program_id).then((program) => {
            program_name = `${program.school}_${program.program_name}`;
            let version_number_max = 0;

            thread.messages.forEach((message) => {
              message.file.forEach((file_data) => {
                let fileversion = 0;
                fileversion = parseInt(
                  file_data.name.replace(/[^\d]/g, ''),
                  10
                );

                if (fileversion > version_number_max) {
                  version_number_max = fileversion; // get the max version number
                }
              });
            });

            const version_number = parseInt(version_number_max, 10) + 1;
            let temp_name = `${thread.student_id.lastname}_${
              thread.student_id.firstname
            }_${program_name}_${
              thread.file_type
            }_v${version_number.toString()}${path
              .extname(file.originalname)
              .toLowerCase()}`;
            temp_name = temp_name.replace(/ /g, '_');
            temp_name = temp_name.replace(/\//g, '_');

            cb(null, temp_name);
          });
        } else {
          let version_number_max = 0;

          thread.messages.forEach((message) => {
            message.file.forEach((file_data) => {
              let fileversion = 0;
              fileversion = parseInt(file_data.name.replace(/[^\d]/g, ''), 10);

              if (fileversion > version_number_max) {
                version_number_max = fileversion; // get the max version number
              }
            });
          });

          const version_number = parseInt(version_number_max, 10) + 1;
          let temp_name = `${thread.student_id.lastname}_${
            thread.student_id.firstname
          }_${thread.file_type}_v${version_number.toString()}${path.extname(
            file.originalname
          )}`;
          temp_name = temp_name.replace(/ /g, '_');
          temp_name = temp_name.replace(/\//g, '_');
          cb(null, temp_name);
        }
      });
  }
});

// Message thread image upload (general)
const storage_messagesthread_image_s3 = multerS3({
  s3,
  bucket: (req, file, cb) => {
    const { messagesThreadId, studentId } = req.params;
    let directory = path.join(
      AWS_S3_BUCKET_NAME,
      studentId,
      messagesThreadId,
      'img'
    );
    directory = directory.replace(/\\/g, '/');
    cb(null, directory);
  },
  metadata: (req, file, cb) => {
    const { messagesThreadId, studentId } = req.params;
    let directory = path.join(studentId, messagesThreadId);
    directory = directory.replace(/\\/g, '/'); // g>> replace all!
    cb(null, { fieldName: file.fieldname, path: directory });
  },
  key: (req, file, cb) => {
    const id = uuid.v4();
    const fileName = id + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const upload_messagesthread_file_s3 = multer({
  storage: storage_messagesthread_file_s3,
  limits: { fileSize: MAX_DOC_FILE_SIZE_MB },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new ErrorResponse(
          415,
          'Only .xls .xlsx .xlsm .pdf .png, .jpg and .jpeg .docx format are allowed'
        )
      );
    }
    const fileSize = parseInt(req.headers['content-length'], 10);
    if (fileSize > MAX_DOC_FILE_SIZE_MB) {
      return cb(
        new ErrorResponse(
          413,
          `您的檔案不得超過 ${
            MAX_DOC_FILE_SIZE_MB / (1024 * 1024)
          } MB / File size is limited to ${
            MAX_DOC_FILE_SIZE_MB / (1024 * 1024)
          } MB!`
        )
      );
    }
    cb(null, true);
  }
});

const upload_messagesthread_image_s3 = multer({
  storage: storage_messagesthread_image_s3,
  limits: { fileSize: MAX_FILE_SIZE_MB },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_IMAGE_TYPES.includes(file.mimetype)) {
      return cb(
        new ErrorResponse(415, 'Only .png, .jpg and .jpeg format are allowed')
      );
    }
    const fileSize = parseInt(req.headers['content-length'], 10);
    if (fileSize > MAX_FILE_SIZE_MB) {
      return cb(
        new ErrorResponse(
          413,
          `您的檔案不得超過 ${
            MAX_FILE_SIZE_MB / (1024 * 1024)
          } MB / File size is limited to ${
            MAX_FILE_SIZE_MB / (1024 * 1024)
          } MB!`
        )
      );
    }
    cb(null, true);
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

module.exports = {
  imageUpload: upload_doc_image_s3.single('file'),
  admissionUpload: upload_admission_letter_s3.single('file'),
  documentationDocsUpload: upload_doc_docs_s3.single('file'),
  VPDfileUpload: upload_vpd_s3.single('file'),
  ProfilefileUpload: upload_profile_s3.single('file'),
  TemplatefileUpload: upload_template_s3.single('file'),
  MessagesThreadUpload: upload_messagesthread_file_s3.array('files'),
  MessagesImageThreadUpload: upload_messagesthread_image_s3.single('file'),
  upload: upload.single('file')
};
