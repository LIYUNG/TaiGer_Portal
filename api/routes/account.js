const { Router } = require("express");

const { Role } = require("../models/User");
const { protect, permit } = require("../middlewares/auth");
const {
  fileUpload,
  ProfilefileUpload,
  TranscriptExcelUpload,
  EditGeneralDocsUpload,
} = require("../middlewares/file-upload");

const {
  getMyfiles,
  saveFilePath,
  saveGeneralFilePath,
  saveProfileFilePath,
  downloadProfileFile,
  downloadTemplateFile,
  downloadFile,
  downloadGeneralFile,
  deleteProfileFile,
  deleteFile,
  deleteGeneralFile,
  processTranscript,
  downloadXLSX,
  getMyAcademicBackground,
  updateAcademicBackground,
  updateLanguageSkill,
} = require("../controllers/files");

const router = Router();

router.use(protect);

// TODO: get document status
router
  .route("/:studentId/files")
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), getMyfiles);

router
  .route(
    "/files/programspecific/upload/:studentId/:applicationId/:fileCategory"
  )
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    fileUpload,
    saveFilePath
  );

router
  .route(
    "/files/programspecific/:studentId/:applicationId/:docName/:student_inputs"
  )
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), downloadFile)
  .delete(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    deleteFile
  );

router
  .route("/files/general/upload/:studentId/:fileCategory")
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    EditGeneralDocsUpload,
    saveGeneralFilePath
  );

router
  .route("/files/general/:student_inputs/:studentId/:docName")
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    downloadGeneralFile
    // (req, res, next) => {
    //   res.status(200);
    // }
  )
  .delete(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    deleteGeneralFile
  );

router
  .route("/files/:studentId/:category")
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    downloadProfileFile
  )
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    ProfilefileUpload,
    saveProfileFilePath
  )
  .delete(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    deleteProfileFile
  );
// TODO: check the exact usage
router
  .route("/transcript/:studentId/:category")
  // .post((req, res, next) =>
  //   res.status(400).send({ success: false, message: "Not implemented yet" })
  // );
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    TranscriptExcelUpload,
    processTranscript
  );
router
  .route("/transcript/:studentId/:filename")
  // .post((req, res, next) =>
  //   res.status(400).send({ success: false, message: "Not implemented yet" })
  // );
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), downloadXLSX);
// .post(fileUpload, processTranscript);
router
  .route("/survey")
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    getMyAcademicBackground
  );
router
  .route("/survey/university")
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    updateAcademicBackground
  );
router
  .route("/survey/language")
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    updateLanguageSkill
  );
router
  .route("/download/template/:category")
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    downloadTemplateFile
  );
// .get(downloadXLSX);

module.exports = router;
