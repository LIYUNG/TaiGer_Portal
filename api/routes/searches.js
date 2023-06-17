const { Router } = require('express');
const {
  GeneralGETSearchRequestRateLimiter
} = require('../middlewares/rate_limiter');
const { protect, permit } = require('../middlewares/auth');
const { Role } = require('../models/User');

const { getQueryResults } = require('../controllers/search');

const router = Router();

router.use(protect);

router
  .route('/')
  .get(
    GeneralGETSearchRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getQueryResults
  );

module.exports = router;
