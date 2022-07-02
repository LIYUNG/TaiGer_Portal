const { Router } = require("express");

const { Role } = require("../models/User");
const { protect, permit } = require("../middlewares/auth");
const {
  fileUpload,
  TranscriptExcelUpload,
  EditGeneralDocsUpload,
} = require("../middlewares/file-upload");

const {
  initGeneralMessagesThread,
  initApplicationMessagesThread,
  getMessages,
  postMessages,
} = require("../controllers/documents_modification");

const router = Router();

router.use(protect);

router
  .route("/init/general/:studentId/:document_catgory")
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    initGeneralMessagesThread
  );

router
  .route("/init/application/:studentId/:applicationId/:document_catgory")
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    initApplicationMessagesThread
  );

router
  .route("/:messagesThreadId")
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), getMessages)
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    postMessages
  );

module.exports = router;
