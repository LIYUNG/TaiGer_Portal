const { Router } = require("express");

const { auth, permit } = require("../middlewares/auth");
const { Role } = require("../models/User");

const {
  getStudents,
  updateAgent,
  updateEditor,
  createProgram,
  deleteProgram,
} = require("../controllers/students");

const router = Router();

router.use(auth);

router.route("/").get(getStudents);

router.route("/:id/agents").post(permit(Role.Admin), updateAgent);

router.route("/:id/editors").post(permit(Role.Admin), updateEditor);

router
  .route("/:id/programs")
  .post(permit(Role.Admin, Role.Agent), createProgram);

router
  .route("/:studentId/programs/:programId")
  .delete(permit(Role.Admin, Role.Agent), deleteProgram);

module.exports = router;
