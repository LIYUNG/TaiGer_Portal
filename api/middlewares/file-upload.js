const fs = require("fs");
const path = require("path");
const multer = require("multer");

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
    console.log(`${file.originalname}${path.extname(file.originalname)}`);
    // console.log(file.originalname);
    cb(null, file.originalname);
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
    cb(null, `${req.params.category}${path.extname(file.originalname)}`);
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

    cb(null, true);
  },
});

module.exports = {
  fileUpload: upload.single("file"),
  ProfilefileUpload: upload2.single("file"),
};
