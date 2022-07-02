const { Router } = require("express");

const { Role } = require("../models/User");
const { protect, permit } = require("../middlewares/auth");
const {
  fileUpload,
  TranscriptExcelUpload,
  EditGeneralDocsUpload,
} = require("../middlewares/file-upload");
const { getTasks, initTasks, updateTasks } = require("../controllers/tasks");

const router = Router();


router
  .route("/")
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), getTasks);
router.route("/:studentId").post(initTasks);
router
  .route("/:studentId")
  .put(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), updateTasks);

router.use(protect);
module.exports = router;
