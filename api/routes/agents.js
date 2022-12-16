const { Router } = require('express');
const { GeneralGETRequestRateLimiter } = require('../middlewares/rate_limiter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');

const { protect, permit } = require('../middlewares/auth');
const { Role } = require('../models/User');

const { getAgents } = require('../controllers/teams');

const router = Router();

router.use(protect, permit(Role.Admin));

router
  .route('/')
  .get(filter_archiv_user, GeneralGETRequestRateLimiter, getAgents);

module.exports = router;
