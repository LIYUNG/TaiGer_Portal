const { Router } = require('express');
const { Role } = require('@taiger-common/core');

const {
  getMessagesRateLimiter,
  postMessagesRateLimiter,
  postMessagesImageRateLimiter,
  GeneralGETSearchRequestRateLimiter,
  getNumberUnreadMessagesRateLimiter
} = require('../middlewares/rate_limiter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const { multitenant_filter } = require('../middlewares/multitenant-filter');
const { protect, permit } = require('../middlewares/auth');
const {
  getMessages,
  updateAMessageInThread,
  deleteAMessageInCommunicationThread,
  postMessages,
  getMyMessages,
  loadMessages,
  getSearchUserMessages,
  getUnreadNumberMessages,
  IgnoreMessage,
  getChatFile
} = require('../controllers/communications');
const {
  chatMultitenantFilter
} = require('../middlewares/chatMultitenantFilter');
const { logAccess } = require('../utils/log/log');
const { MessagesChatUpload } = require('../middlewares/file-upload');

const router = Router();

router.use(protect);
router
  .route('/')
  .get(
    GeneralGETSearchRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getSearchUserMessages,
    logAccess
  );

router
  .route('/ping/all')
  .get(
    getNumberUnreadMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    getUnreadNumberMessages
  );

router
  .route('/all')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getMyMessages,
    logAccess
  );

router
  .route('/:studentId/:communication_messageId/:ignoreMessageState/ignore')
  .put(
    filter_archiv_user,
    postMessagesImageRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    multitenant_filter,
    chatMultitenantFilter,
    IgnoreMessage,
    logAccess
  );

router
  .route('/:studentId/:messageId')
  .put(
    filter_archiv_user,
    postMessagesImageRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    chatMultitenantFilter,
    updateAMessageInThread,
    logAccess
  )
  .delete(
    filter_archiv_user,
    postMessagesImageRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    chatMultitenantFilter,
    deleteAMessageInCommunicationThread,
    logAccess
  );

router
  .route('/:studentId')
  .post(
    filter_archiv_user,
    postMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    chatMultitenantFilter,
    MessagesChatUpload,
    postMessages,
    logAccess
  )
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    chatMultitenantFilter,
    getMessages,
    logAccess
  );

router
  .route('/:studentId/chat/:fileName')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    chatMultitenantFilter,
    getChatFile,
    logAccess
  );

router
  .route('/:studentId/pages/:pageNumber')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    chatMultitenantFilter,
    loadMessages,
    logAccess
  );

module.exports = router;
