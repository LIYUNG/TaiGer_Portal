const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { Program } = require("../models/Program");
const { Student, User } = require("../models/User");

const { ErrorResponse } = require("../common/errors");
const { UPLOAD_PATH } = require("../config");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpg",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/**
 * currently used by route
 *   /account/files/:applicationId/:docName (student upload)
 *   /students/:studentId/applications/:applicationId/:docName (admin/agent upload)
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let { studentId, applicationId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId and applicationId exist
    const directory = path.join(UPLOAD_PATH, studentId, applicationId);
    if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

    return cb(null, directory);
  },
  filename: (req, file, cb) => {
    // TODO: check docName exist
    let { studentId, applicationId, fileCategory } = req.params;

    Student.findOne({ _id: studentId })
      .populate("applications.programId")
      .lean()
      .exec()
      .then(function (student) {
        if (student) {
          console.log(`${file.originalname}${path.extname(file.originalname)}`); //document.pdf.pdf
          console.log(path.extname(file.originalname)); //.pdf
          // console.log(student.applications);
          // console.log(student.lastname);
          // console.log(
          //   student.applications.find(
          //     ({ programId }) => programId._id == applicationId
          //   )
          // );
          let application = student.applications.find(
            ({ programId }) => programId._id == applicationId
          );
          // console.log(application.programId);
          let temp_name =
            student.lastname +
            "_" +
            student.firstname +
            "_" +
            application.programId.University_ +
            "_" +
            application.programId.Program_ +
            "_" +
            fileCategory +
            `${path.extname(file.originalname)}`;
          temp_name = temp_name.replace(/ /g, "_");
          const filePath = path.join(
            UPLOAD_PATH,
            studentId,
            applicationId,
            temp_name
          );

          if (fs.existsSync(filePath))
            return cb(new ErrorResponse(400, "Document already existed!22222"));
          return {
            fileName: temp_name,
          };
        }
      })
      .then(function (resp) {
        console.log(resp.fileName);
        cb(null, resp.fileName);
      });

    // cb(null, `${req.params.docName}${path.extname(file.originalname)}`);
  },
});

//TODO: upload pdf/docx/image
const upload = multer({
  storage,
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
 * currently used by route
 *   /account/files/:studentId/:docName (student upload)
 */
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    let { studentId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId exist
    const directory = path.join(UPLOAD_PATH, studentId);
    console.log(directory);
    if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

    return cb(null, directory);
  },
  filename: (req, file, cb) => {
    // TODO: check category exist
    let { studentId, applicationId } = req.params;

    Student.findOne({ _id: studentId })
      .populate("applications.programId")
      .lean()
      .exec()
      .then(function (student) {
        if (student) {
          let temp_name =
            student.lastname +
            "_" +
            student.firstname +
            "_" +
            req.params.category +
            path.extname(file.originalname);
          const filePath = path.join(UPLOAD_PATH, studentId, temp_name);
          if (fs.existsSync(filePath))
            return cb(new ErrorResponse(400, "Document already existed!22222"));

          return {
            fileName: temp_name,
          };
        }
      })
      .then(function (resp) {
        cb(null, resp.fileName);
      });

    // cb(null, `${req.params.category}${path.extname(file.originalname)}`);
  },
});

//TODO: upload pdf/docx/image
const upload2 = multer({
  storage: storage2,
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

const storage3 = multer.diskStorage({
  destination: (req, file, cb) => {
    let { studentId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId exist
    const directory = path.join(UPLOAD_PATH, studentId);
    console.log(directory);
    if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

    return cb(null, directory);
  },
  filename: (req, file, cb) => {
    // TODO: check category exist
    let { studentId } = req.params;
    try {
      User.findOne({ _id: studentId })
        .then(function (student) {
          if (student) {
            let temp_name =
              student.lastname +
              "_" +
              student.firstname +
              "_" +
              "TaiGerTranscriptAI" +
              path.extname(file.originalname);
            console.log(temp_name);
            const filePath = path.join(UPLOAD_PATH, studentId, temp_name);
            if (fs.existsSync(filePath))
              return cb(
                new ErrorResponse(400, "Document already existed!33333")
              );
            return {
              fileName: temp_name,
            };
          }
        })
        .then(function (resp) {
          cb(null, resp.fileName);
        });
    } catch (err) {
      console.log(err);
    }

    // cb(null, `${req.params.category}${path.extname(file.originalname)}`);
  },
});

//TODO: upload pdf/docx/image
const upload3 = multer({
  storage: storage3,
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

const storage4 = multer.diskStorage({
  destination: (req, file, cb) => {
    let { studentId } = req.params;
    if (!studentId) studentId = String(req.user._id);

    // TODO: check studentId and applicationId exist
    const directory = path.join(UPLOAD_PATH, studentId, "GeneralDocsEdit");
    if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

    return cb(null, directory);
  },
  filename: (req, file, cb) => {
    // TODO: check docName exist
    let { studentId, fileCategory } = req.params;

    Student.findOne({ _id: studentId })
      .then(function (student) {
        if (student) {
          console.log(`${file.originalname}${path.extname(file.originalname)}`); //document.pdf.pdf
          console.log(path.extname(file.originalname)); //.pdf
          let temp_name =
            student.lastname +
            "_" +
            student.firstname +
            "_" +
            fileCategory +
            `${path.extname(file.originalname)}`;
          temp_name = temp_name.replace(/ /g, "_");
          const filePath = path.join(
            UPLOAD_PATH,
            studentId,
            "GeneralDocsEdit",
            temp_name
          );
          if (fs.existsSync(filePath))
            return cb(new ErrorResponse(400, "Document already existed!4444"));
          return {
            fileName: temp_name,
          };
        }
      })
      .then(function (resp) {
        console.log(resp.fileName);
        cb(null, resp.fileName);
      });

    // cb(null, `${req.params.docName}${path.extname(file.originalname)}`);
  },
});

//TODO: upload pdf/docx/image
const upload4 = multer({
  storage: storage4,
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

module.exports = {
  fileUpload: upload.single("file"),
  ProfilefileUpload: upload2.single("file"),
  TranscriptExcelUpload: upload3.single("file"),
  EditGeneralDocsUpload: upload4.single("file"),
};
