const { Router } = require('express');
const {
  getMessagesRateLimiter,
  postMessagesRateLimiter,
  postMessagesImageRateLimiter
} = require('../middlewares/rate_limiter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const { multitenant_filter } = require('../middlewares/multitenant-filter');

const {
  doc_thread_ops_validator
} = require('../middlewares/docs_thread_operation_validation');

const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');

const {
  getMessages,
  updateAMessageInThread,
  deleteAMessageInThread,
  postMessages
} = require('../controllers/communications');

const router = Router();

router.use(protect);

router
  .route('/:communicationThreadId/:studentId')
  .post(
    filter_archiv_user,
    postMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    doc_thread_ops_validator,
    postMessages
  );
// TODO: multitenancy: check user id match user_id in message
router
  .route('/:communicationThreadId/:messageId')
  .put(
    filter_archiv_user,
    postMessagesImageRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    updateAMessageInThread
  );
router
  .route('/delete/:communicationThreadId/:messageId')
  .delete(
    filter_archiv_user,
    postMessagesImageRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    deleteAMessageInThread
  );

// Multitenant-filter in call-back function
router
  .route('/:studentId')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    getMessages
  );

module.exports = router;
