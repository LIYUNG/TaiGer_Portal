const { Router } = require("express");

const { ErrorResponse } = require("../common/errors");
const { protect, permit } = require("../middlewares/auth");
const { fileUpload, ProfilefileUpload } = require("../middlewares/file-upload");
const { Role, Student } = require("../models/User");

const {
  getStudents,
  assignAgentToStudent,
  removeAgentFromStudent,
  assignEditorToStudent,
  removeEditorFromStudent,
  createApplication,
  deleteApplication,
} = require("../controllers/students");
const {
  saveFilePath,
  saveProfileFilePath,
  downloadFile,
  downloadProfileFile,
  updateDocumentStatus,
  updateProfileDocumentStatus,
  deleteFile,
  deleteProfileFile,
} = require("../controllers/files");

const router = Router();

router.use(protect);

router
  .route("/")
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), getStudents);

router.route("/:id/agents").post(permit(Role.Admin), assignAgentToStudent);

router
  .route("/:studentId/agents/:agentId")
  .delete(permit(Role.Admin), removeAgentFromStudent);

router.route("/:id/editors").post(permit(Role.Admin), assignEditorToStudent);

router
  .route("/:studentId/editors/:editorId")
  .delete(permit(Role.Admin), removeEditorFromStudent);

router
  .route("/:studentId/applications")
  .post(permit(Role.Admin, Role.Agent, Role.Student), createApplication);

router
  .route("/:studentId/applications/:applicationId")
  .delete(permit(Role.Admin, Role.Agent), deleteApplication);

router
  .route("/:studentId/applications/:applicationId/:docName")
  .get(permit(Role.Admin, Role.Agent), downloadFile)
  .post(permit(Role.Admin, Role.Agent), fileUpload, saveFilePath)
  .delete(permit(Role.Admin, Role.Agent), deleteFile);

router
  .route("/:studentId/files/:category")
  .get(permit(Role.Admin, Role.Editor, Role.Agent), downloadProfileFile)
  .post(
    permit(Role.Admin, Role.Editor, Role.Agent),
    ProfilefileUpload,
    saveProfileFilePath
  )
  .delete(permit(Role.Admin, Role.Agent), deleteProfileFile);

router
  .route("/:studentId/applications/:applicationId/:docName/status")
  .post(permit(Role.Admin, Role.Agent), updateDocumentStatus);

router
  .route("/:studentId/:category/status")
  .post(permit(Role.Admin, Role.Agent), updateProfileDocumentStatus);
module.exports = router;
