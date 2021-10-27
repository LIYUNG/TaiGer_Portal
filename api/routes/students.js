const { Router } = require("express");

const { ErrorResponse } = require("../common/errors");
const { protect, permit } = require("../middlewares/auth");
const { fileUpload } = require("../middlewares/file-upload");
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
  downloadFile,
  updateDocumentStatus,
  deleteFile,
} = require("../controllers/files");

const router = Router();

router.use(protect);

router
  .route("/:studentId")
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
  .post(permit(Role.Admin, Role.Agent), createApplication);

router
  .route("/:studentId/applications/:applicationId")
  .delete(permit(Role.Admin, Role.Agent), deleteApplication);

router
  .route("/:studentId/applications/:applicationId/:docName")
  .get(permit(Role.Admin, Role.Agent), downloadFile)
  .post(permit(Role.Admin, Role.Agent), fileUpload, saveFilePath)
  .delete(permit(Role.Admin, Role.Agent), deleteFile);

router
  .route("/:studentId/applications/:applicationId/:docName/status")
  .post(permit(Role.Admin, Role.Agent), updateDocumentStatus);

module.exports = router;
