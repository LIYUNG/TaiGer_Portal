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
  saveProgramSpecificFilePath,
  updateCommentsGeneralFile,
  StudentGiveFeedbackGeneralFile,
  updateCommentsProgramSpecificFile,
  StudentGiveFeedbackProgramSpecificFile,
  saveGeneralFilePath,
  downloadTemplateFile,
  downloadProgramSpecificFile,
  downloadGeneralFile,
  SetAsDecidedProgram,
  SetAsCloseProgram,
  SetAsGetAdmissionProgram,
  SetAsFinalProgramSpecificFile,
  deleteProgramSpecificFile,
  SetAsFinalGeneralFile,
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
  .route("/files")
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), getMyfiles);

router
  .route("/program/close/:studentId/:applicationId")
  .put(permit(Role.Admin, Role.Agent), SetAsCloseProgram);
router
  .route("/program/decided/:studentId/:applicationId")
  .put(permit(Role.Admin, Role.Agent), SetAsDecidedProgram);
router
  .route("/program/admission/:studentId/:applicationId")
  .put(permit(Role.Admin, Role.Agent), SetAsGetAdmissionProgram);

router
  .route(
    "/files/programspecific/comments/:studentId/:applicationId/:docName/:whoupdate"
  )
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    updateCommentsProgramSpecificFile
  );

router
  .route(
    "/files/programspecific/studentfeedback/:studentId/:applicationId/:docName/:whoupdate"
  )
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    StudentGiveFeedbackProgramSpecificFile
  );

router
  .route(
    "/files/programspecific/upload/:studentId/:applicationId/:fileCategory"
  )
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    fileUpload,
    saveProgramSpecificFilePath
  );

router
  .route("/files/programspecific/:studentId/:applicationId/:whoupdate/:docName")
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    downloadProgramSpecificFile
  )
  .put(
    permit(Role.Admin, Role.Agent, Role.Editor),
    SetAsFinalProgramSpecificFile
  ) //set as final
  .delete(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    deleteProgramSpecificFile
  );

router
  .route("/files/general/comments/:studentId/:whoupdate/:docName")
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    updateCommentsGeneralFile
  );
router
  .route("/files/general/studentfeedback/:studentId/:whoupdate/:docName")
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    StudentGiveFeedbackGeneralFile
  );
router
  .route("/files/general/upload/:studentId/:fileCategory")
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    EditGeneralDocsUpload,
    saveGeneralFilePath
  );

router
  .route("/files/general/:studentId/:docName/:whoupdate")
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    downloadGeneralFile
  )
  .put(
    permit(Role.Admin, Role.Agent, Role.Editor), //set as final
    SetAsFinalGeneralFile
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
