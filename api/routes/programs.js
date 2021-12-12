const { Router } = require("express");

const { protect, permit } = require("../middlewares/auth");
const { Role } = require("../models/User");

const {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
} = require("../controllers/programs");

const router = Router();

router.use(protect);

router
  .route("/")
  .get(permit(Role.Admin, Role.Agent, Role.Student), getPrograms)
  .post(permit(Role.Admin, Role.Agent), createProgram);

router
  .route("/:id")
  .get(permit(Role.Admin, Role.Agent, Role.Student), getProgram)
  .put(permit(Role.Admin, Role.Agent), updateProgram)
  .delete(permit(Role.Admin, Role.Agent), deleteProgram);

module.exports = router;
