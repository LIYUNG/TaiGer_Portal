const { Router } = require('express');

const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');
const {
  // fileUpload,
  MessagesThreadUpload,
  // upload,
  // TranscriptExcelUpload,
} = require('../middlewares/file-upload');

const {
  getCVMLRLOverview,
  initGeneralMessagesThread,
  initApplicationMessagesThread,
  getMessages,
  getMessageFile,
  SetStatusMessagesThread,
  deleteMessagesThread,
  deleteProgramSpecificMessagesThread,
  postMessages
} = require('../controllers/documents_modification');

const router = Router();

router.use(protect);

router
  .route('/overview')
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getCVMLRLOverview
  );

router
  .route('/init/general/:studentId/:document_catgory')
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    initGeneralMessagesThread
  );

router
  .route('/init/application/:studentId/:program_id/:document_catgory')
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    initApplicationMessagesThread
  );

router
  .route('/:studentId/:messagesThreadId')
  .put(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    SetStatusMessagesThread
  )
  .delete(permit(Role.Admin, Role.Agent, Role.Editor), deleteMessagesThread);

router
  .route('/:messagesThreadId')
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), getMessages);

router
  .route('/:messagesThreadId/:messageId/:fileId')
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getMessageFile
  );

router
  .route('/:messagesThreadId/:program_id/:studentId')
  .delete(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    deleteProgramSpecificMessagesThread
  );

router.route('/:studentId/:messagesThreadId').post(
  permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
  MessagesThreadUpload,
  // upload,
  postMessages
);

module.exports = router;
