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

const userFolder = (user) => `${user.firstname_}_${user.lastname_}_${user._id}`;

const fullUploadPath = (user, category) =>
  path.join(UPLOAD_PATH, userFolder(user), category);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = fullUploadPath(req.user, req.params.category);
    if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

    return cb(null, directory);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
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

module.exports = {
  fileUpload: upload.single("file"),
};
