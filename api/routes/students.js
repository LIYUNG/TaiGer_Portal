const { Router } = require("express");

const { ErrorResponse } = require("../common/errors");
const { auth, permit } = require("../middlewares/auth");
const { fileUpload } = require("../middlewares/file-upload");
const { Role } = require("../models/User");
const Students = require("../models/Students");

const {
  getStudents,
  updateAgent,
  updateEditor,
  createProgram,
  deleteProgram,
} = require("../controllers/students");
const {
  saveFilePath,
  downloadFile,
  updateFileStatus,
  deleteFile,
} = require("../controllers/files");

const router = Router();

router.use(auth);

router.route("/").get(getStudents);

router.route("/:id/agents").post(permit(Role.Admin), updateAgent);

router.route("/:id/editors").post(permit(Role.Admin), updateEditor);

router
  .route("/:studentId/programs")
  .post(permit(Role.Admin, Role.Agent), createProgram);

router
  .route("/:studentId/programs/:programId")
  .delete(permit(Role.Admin, Role.Agent), deleteProgram);

router
  .route("/:studentId/files/:category")
  .get(
    permit(Role.Admin, Role.Agent),
    async (req, res, next) => {
      const student = await Students.findById(req.params.studentId);
      if (!student) throw new ErrorResponse(400, "Invalid student Id");

      req.user = student;
      next();
    },
    downloadFile
  )
  .post(
    permit(Role.Admin, Role.Agent),
    async (req, res, next) => {
      const student = await Students.findById(req.params.studentId);
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
