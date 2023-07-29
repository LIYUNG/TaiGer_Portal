const { Router } = require('express');
const {
  getMessagesRateLimiter,
  postMessagesRateLimiter,
  postMessagesImageRateLimiter,
  GeneralGETSearchRequestRateLimiter,
  getNumberUnreadMessagesRateLimiter
} = require('../middlewares/rate_limiter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const { multitenant_filter } = require('../middlewares/multitenant-filter');

const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');

const {
  getMessages,
  updateAMessageInThread,
  deleteAMessageInCommunicationThread,
  postMessages,
  getMyMessages,
  loadMessages,
  getSearchUserMessages,
  getUnreadNumberMessages
} = require('../controllers/communications');
const {
  chatMultitenantFilter
} = require('../middlewares/chatMultitenantFilter');

const router = Router();

router.use(protect);
router
  .route('/')
  .get(
    GeneralGETSearchRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getSearchUserMessages
  );

router
  .route('/ping/all')
  .get(
    getNumberUnreadMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getUnreadNumberMessages
  );

router
  .route('/all')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getMyMessages
  );

router
  .route('/:studentId/:messageId')
  .put(
    filter_archiv_user,
    postMessagesImageRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    chatMultitenantFilter,
    updateAMessageInThread
  )
  .delete(
    filter_archiv_user,
    postMessagesImageRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    chatMultitenantFilter,
    deleteAMessageInCommunicationThread
  );

router
  .route('/:studentId')
  .post(
    filter_archiv_user,
    postMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    chatMultitenantFilter,
    postMessages
  )
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    chatMultitenantFilter,
    getMessages
  );
router
  .route('/:studentId/pages/:pageNumber')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    chatMultitenantFilter,
    loadMessages
  );

module.exports = router;
