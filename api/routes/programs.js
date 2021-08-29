const { Router } = require("express");

const { auth } = require("../middlewares/auth");

const {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} = require("../controllers/programs");

const router = Router();

router.use(auth);

router.route("/").get(getPrograms).post(createProgram);

router.route("/:id").post(updateProgram);

router.route("/:program_id").delete(deleteProgram);

module.exports = router;
