const { Router } = require('express');
const Event = require('../models/Event');
const { protect, permit } = require('../middlewares/auth');
const {
  getEvents,
  showEvent,
  updateEvent,
  postEvent,
  deleteEvent,
  confirmEvent
} = require('../controllers/events');
const { Role } = require('../models/User');
const {
  GeneralGETRequestRateLimiter,
  GeneralPUTRequestRateLimiter,
  GeneralDELETERequestRateLimiter,
  GeneralPOSTRequestRateLimiter
} = require('../middlewares/rate_limiter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const { event_multitenant_filter } = require('../middlewares/event-filter');
// const handleError = require('../utils/eventErrors');
const router = Router();

router.use(protect);

router
  .route('/')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    getEvents
  )
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    postEvent
  );

router
  .route('/:studentId/show')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    showEvent
  );

router
  .route('/:event_id/confirm')
  .put(
    filter_archiv_user,
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    event_multitenant_filter,
    confirmEvent
  );

router
  .route('/:event_id')
  .put(
    filter_archiv_user,
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    event_multitenant_filter,
    updateEvent
  )
  .delete(
    filter_archiv_user,
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    event_multitenant_filter,
    deleteEvent
  );

module.exports = router;
