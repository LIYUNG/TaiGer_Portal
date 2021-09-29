const { Router } = require("express");

const { protect, permit } = require("../middlewares/auth");
const { Role } = require('../models/User')

const {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
} = require("../controllers/programs");

const router = Router();

router.use(protect, permit(Role.Admin, Role.Agent));

router.route("/").get(getPrograms).post(createProgram);

router
  .route("/:id")
  .get(getProgram)
  .put(updateProgram)
  .delete(deleteProgram);

module.exports = router;
