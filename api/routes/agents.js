const { Router } = require('express');
const { GeneralGETRequestRateLimiter } = require('../middlewares/rate_limiter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');

const { protect, permit } = require('../middlewares/auth');
const { Role } = require('../models/User');

const { getAgents } = require('../controllers/teams');
const { permission_canAssignAgent_filter } = require('../middlewares/permission-filter');

const router = Router();

router.use(protect, permit(Role.Admin, Role.Manager));

router
  .route('/')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permission_canAssignAgent_filter,
    getAgents
  );

module.exports = router;
