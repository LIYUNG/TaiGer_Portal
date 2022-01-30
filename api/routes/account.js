const { Router } = require("express");

const { Role } = require("../models/User");
const { protect, permit } = require("../middlewares/auth");
const {
  fileUpload,
  TranscriptExcelUpload,
  EditGeneralDocsUpload,
} = require("../middlewares/file-upload");

const {
  getMyfiles,
  saveFilePath,
  saveGeneralFilePath,
  downloadTemplateFile,
  downloadFile,
  downloadGeneralFile,
  deleteFile,
  deleteGeneralFile,
  processTranscript,
  downloadXLSX,
  getMyAcademicBackground,
  updateAcademicBackground,
  updateLanguageSkill,
  updatePersonalData,
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
  )
  .delete(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    deleteGeneralFile
  );

// TaiGer Transcript Analyser:
router
  .route("/transcript/:studentId/:category")
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    TranscriptExcelUpload,
    processTranscript
  );
router
  .route("/transcript/:studentId/:filename")
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), downloadXLSX);

//Academic Survey for Students
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
  .route("/profile")
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    updatePersonalData
  );
router
  .route("/download/template/:category")
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    downloadTemplateFile
  );

module.exports = router;
