const { Router } = require("express");

const { Role } = require("../models/User");
const { protect, permit } = require("../middlewares/auth");
const {
  fileUpload,
  MessagesThreadUpload,
  test_file_json,
  upload,
  TranscriptExcelUpload,
  EditGeneralDocsUpload,
} = require("../middlewares/file-upload");

const {
  initGeneralMessagesThread,
  initApplicationMessagesThread,
  getMessages,
  deleteMessagesThread,
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
  .route("/:messagesThreadId/:studentId")
  .delete(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    deleteMessagesThread
  );

router
  .route("/:messagesThreadId")
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), getMessages);

router
  .route("/:messagesThreadId")
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    // MessagesThreadUpload,
    // test_file_json,
    upload,
    postMessages
  );

// router
//   .route("/:messagesThreadId")
//   .post(
//     permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
//     EditGeneralDocsUpload,
//     postMessages
//   );

module.exports = router;
