const { Router } = require("express");

const { auth } = require("../middlewares/auth");
const { fileUpload } = require("../middlewares/file-upload");

const {
  getFiles,
  saveFilePath,
  downloadFile,
  processTranscript,
  downloadXLSX,
} = require("../controllers/files");

const router = Router();

router.use(auth);

router.route("/files").get(getFiles);

router
  .route("/files/:category")
  .get(downloadFile)
  .post(fileUpload, saveFilePath);

router
  .route("/transcript/:category/:group")
  .post(fileUpload, processTranscript);

router.route("/download/:category/:filename").get(downloadXLSX);

module.exports = router;
