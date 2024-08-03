const { Router } = require('express');
const { GeneralGETRequestRateLimiter } = require('../middlewares/rate_limiter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');

const { protect, permit } = require('../middlewares/auth');
const { Role } = require('../constants');

const {
  getAgents,
  getAgentProfile,
  putAgentProfile
} = require('../controllers/teams');
const {
  permission_canAssignAgent_filter
} = require('../middlewares/permission-filter');

const router = Router();

router.use(protect);

router
  .route('/')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    permission_canAssignAgent_filter,
    getAgents
  );
router
  .route('/profile/:agent_id')
  .put(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent),
    putAgentProfile
  )
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
    getAgentProfile
  );

module.exports = router;
