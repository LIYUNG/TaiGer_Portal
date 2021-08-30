const { Router } = require("express");

const { auth, permit } = require("../middlewares/auth");
const { Role } = require('../models/User')

const {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} = require("../controllers/programs");

const router = Router();

router.use(auth);

// TODO: permission middleware
router.route("/").get(getPrograms).post(createProgram);

router
  .route("/:id")
  .post(updateProgram)
  .delete(permit(Role.Admin, Role.Agent), deleteProgram);

module.exports = router;
