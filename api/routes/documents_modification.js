const { Router } = require('express');
const {
  getMessagesRateLimiter,
  postMessagesRateLimiter,
  postMessagesImageRateLimiter,
  GeneralPOSTRequestRateLimiter,
  SetStatusMessagesThreadRateLimiter,
  GeneralPUTRequestRateLimiter,
  GeneralDELETERequestRateLimiter,
  getMessageFileRateLimiter
} = require('../middlewares/rate_limiter');
const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');
const {
  MessagesThreadUpload,
  MessagesImageThreadUpload
} = require('../middlewares/file-upload');

const {
  getCVMLRLOverview,
  initGeneralMessagesThread,
  initApplicationMessagesThread,
  getMessages,
  getMessageFile,
  SetStatusMessagesThread,
  deleteGeneralMessagesThread,
  deleteProgramSpecificMessagesThread,
  postImageInThread,
  postMessages
} = require('../controllers/documents_modification');

const router = Router();

router.use(protect);

router
  .route('/overview')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getCVMLRLOverview
  );

router
  .route('/init/general/:studentId/:document_category')
  .post(
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    initGeneralMessagesThread
  );

router
  .route('/init/application/:studentId/:program_id/:document_category')
  .post(
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    initApplicationMessagesThread
  );

router
  .route('/:messagesThreadId/:studentId')
  .put(
    SetStatusMessagesThreadRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    SetStatusMessagesThread
  );

router
  .route('/:messagesThreadId/:studentId')
  .post(
    postMessagesRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    MessagesThreadUpload,
    postMessages
  );

router
  .route('/image/:messagesThreadId/:studentId')
  .post(
    postMessagesImageRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    MessagesImageThreadUpload,
    postImageInThread
  );

router
  .route('/:messagesThreadId')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getMessages
  );

router
  .route('/:messagesThreadId/:studentId')
  .delete(
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor),
    deleteGeneralMessagesThread
  );

// WARNING: strict ratelimiter for S3 file download
router
  .route('/:messagesThreadId/:messageId/:fileId')
  .get(
    getMessageFileRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getMessageFile
  );

router
  .route('/:messagesThreadId/:program_id/:studentId')
  .delete(
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    deleteProgramSpecificMessagesThread
  );

module.exports = router;
