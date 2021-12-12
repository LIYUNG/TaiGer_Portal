const { Router } = require("express");

const { Role } = require("../models/User");
const { protect, permit } = require("../middlewares/auth");
const { fileUpload, ProfilefileUpload } = require("../middlewares/file-upload");

const {
  getMyfiles,
  saveFilePath,
  saveProfileFilePath,
  downloadProfileFile,
  downloadFile,
  deleteProfileFile,
  processTranscript,
  downloadXLSX,
} = require("../controllers/files");

const router = Router();

router.use(protect, permit(Role.Student));

// TODO: get document status
router.route("/:studentId/files").get(permit(Role.Student), getMyfiles);

// TODO: is delete route required?
router
  .route("/files/:studentId/:applicationId/:docName")
  .get(downloadFile)
  .post(fileUpload, saveFilePath);

router
  .route("/files/:studentId/:category")
  .get(downloadProfileFile)
  .post(ProfilefileUpload, saveProfileFilePath)
  .delete(deleteProfileFile);
// TODO: check the exact usage
router
  .route("/transcript/:category/:group")
  .post((req, res, next) =>
    res.status(400).send({ success: false, message: "Not implemented yet" })
  );
// .post(fileUpload, processTranscript);

router
  .route("/download/:category/:filename")
  .get((req, res, next) =>
    res.status(400).send({ success: false, message: "Not implemented yet" })
  );
// .get(downloadXLSX);

module.exports = router;
