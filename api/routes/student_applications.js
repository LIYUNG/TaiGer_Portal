const { Router } = require('express');
const {
  GeneralGETRequestRateLimiter,
  getMessagesRateLimiter
} = require('../middlewares/rate_limiter');
const { protect, permit } = require('../middlewares/auth');
const { multitenant_filter } = require('../middlewares/multitenant-filter');

const { filter_archiv_user } = require('../middlewares/limit_archiv_user');

const { Role } = require('../constants');


const {
  getApplicationStudent,
  getApplicationConflicts
} = require('../controllers/student_applications');

const {
  permission_canAccessStudentDatabase_filter
} = require('../middlewares/permission-filter');

const { getApplicationDeltas } = require('../controllers/teams');

const router = Router();

router.use(protect);

router
  .route('/conflicts')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getApplicationConflicts
  );

router
  .route('/deltas')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getApplicationDeltas
  );

router
  .route('/:studentId')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    getApplicationStudent
  );

module.exports = router;
