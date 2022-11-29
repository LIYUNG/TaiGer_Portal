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
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
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
  getMessageFileDownload,
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
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    initGeneralMessagesThread
  );

router
  .route('/init/application/:studentId/:program_id/:document_category')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    initApplicationMessagesThread
  );

router
  .route('/:messagesThreadId/:studentId')
  .put(
    filter_archiv_user,
    SetStatusMessagesThreadRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    SetStatusMessagesThread
  );

router
  .route('/:messagesThreadId/:studentId')
  .post(
    filter_archiv_user,
    postMessagesRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    MessagesThreadUpload,
    postMessages
  );

router
  .route('/image/:messagesThreadId/:studentId')
  .post(
    filter_archiv_user,
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
    filter_archiv_user,
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor),
    deleteGeneralMessagesThread
  );

// WARNING: strict ratelimiter for S3 file download
router
  .route('/:messagesThreadId/:messageId/:file_key')
  .get(
    filter_archiv_user,
    getMessageFileRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getMessageFileDownload
  );

router
  .route('/:messagesThreadId/:program_id/:studentId')
  .delete(
    filter_archiv_user,
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    deleteProgramSpecificMessagesThread
  );

module.exports = router;
