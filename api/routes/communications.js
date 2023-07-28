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
    updateAMessageInThread
  )
  .delete(
    filter_archiv_user,
    postMessagesImageRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    deleteAMessageInCommunicationThread
  );

router
  .route('/:studentId')
  .post(
    filter_archiv_user,
    postMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    postMessages
  )
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    getMessages
  );
router
  .route('/:studentId/pages/:pageNumber')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    loadMessages
  );

module.exports = router;
