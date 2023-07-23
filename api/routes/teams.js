const { Router } = require('express');
const { GeneralGETRequestRateLimiter } = require('../middlewares/rate_limiter');
const { protect, permit } = require('../middlewares/auth');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const { Role } = require('../models/User');
const {
  getTeamMembers,
  getStatistics,
  getArchivStudents,
  getSingleAgent,
  getSingleEditor
} = require('../controllers/teams');
const {
  permission_canAccessStudentDatabase_filter
} = require('../middlewares/permission-filter');

const router = Router();

router.use(protect, permit(Role.Admin, Role.Agent, Role.Editor));

router
  .route('/')
  .get(filter_archiv_user, GeneralGETRequestRateLimiter, getTeamMembers);
router
  .route('/statistics')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permission_canAccessStudentDatabase_filter,
    getStatistics
  );

router
  .route('/archiv/:TaiGerStaffId')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor),
    permission_canAccessStudentDatabase_filter,
    getArchivStudents
  );

router
  .route('/agents/:agent_id')
  .get(filter_archiv_user, GeneralGETRequestRateLimiter, getSingleAgent);

router
  .route('/editors/:editor_id')
  .get(filter_archiv_user, GeneralGETRequestRateLimiter, getSingleEditor);

module.exports = router;
