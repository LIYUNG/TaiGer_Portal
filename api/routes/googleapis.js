const { Router } = require('express');
const { Role } = require('@taiger-common/core');

const { GeneralGETRequestRateLimiter } = require('../middlewares/rate_limiter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');

const { protect, permit } = require('../middlewares/auth');

const {
  googleCalendarAPI,
  googleRedirectAPI,
  googleScheduleEvent,
  awsSendEmail
} = require('../controllers/googleapis');
const {
  permission_canAssignAgent_filter
} = require('../middlewares/permission-filter');

const router = Router();

router.use(protect, permit(Role.Admin, Role.Manager, Role.Agent, Role.Student));

// router
//   .route('/')
//   .get(
//     filter_archiv_user,
//     GeneralGETRequestRateLimiter,
//     googleCalendarAPI
//   );

// router
//   .route('/redirect')
//   .get(
//     filter_archiv_user,
//     GeneralGETRequestRateLimiter,
//     googleRedirectAPI
//   );
// router
//   .route('/schedule-event')
//   .get(filter_archiv_user, GeneralGETRequestRateLimiter, googleScheduleEvent);
module.exports = router;
