const { Router } = require('express');
const {
  GeneralGETSearchRequestRateLimiter
} = require('../middlewares/rate_limiter');
const { protect, permit } = require('../middlewares/auth');
const { Role } = require('../models/User');

const {
  getQueryResults,
  getQueryPublicResults
} = require('../controllers/search');

const router = Router();

router.use(protect);

// TODO: when public documents ready, then enable
// router
//   .route('/public')
//   .get(
//     GeneralGETSearchRequestRateLimiter,
//     permit(Role.Student),
//     getQueryPublicResults
//   );

router
  .route('/')
  .get(
    GeneralGETSearchRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getQueryResults
  );

module.exports = router;
