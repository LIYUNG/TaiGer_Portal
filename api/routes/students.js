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
  updateFileStatus,
  deleteFile,
} = require("../controllers/files");

const router = Router();

router.use(protect);

router.route("/").get(permit(Role.Admin), getStudents);

router.route("/:id/agents").post(permit(Role.Admin), assignAgentToStudent);
router
  .route("/:studentId/agents/:agentId")
  .delete(permit(Role.Admin), removeAgentFromStudent);

router.route("/:id/editors").post(permit(Role.Admin), assignEditorToStudent);
router
  .route("/:studentId/editors/:editorId")
  .delete(permit(Role.Admin), removeEditorFromStudent);

router
  .route("/:id/applications")
  .post(permit(Role.Admin, Role.Agent), createApplication);

router
  .route("/:studentId/applications/:applicationId")
  .delete(permit(Role.Admin, Role.Agent), deleteApplication);

router
  .route("/:id/files/:category")
  .get(
    permit(Role.Admin, Role.Agent),
    async (req, res, next) => {
      const student = await Student.findById(req.params.studentId);
      if (!student) throw new ErrorResponse(400, "Invalid student Id");

      req.user = student;
      next();
    },
    downloadFile
  )
  .post(
    permit(Role.Admin, Role.Agent),
    async (req, res, next) => {
      const student = await Student.findById(req.params.studentId);
      if (!student) throw new ErrorResponse(400, "Invalid student Id");

      req.user = student;
      next();
    },
    fileUpload,
    saveFilePath
  )
  .delete(permit(Role.Admin, Role.Agent), deleteFile);

router
  .route("/:studentId/files/:category/status")
  .post(permit(Role.Admin, Role.Agent), updateFileStatus);

module.exports = router;
