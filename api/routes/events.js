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
// const handleError = require('../utils/eventErrors');
const router = Router();

router.use(protect);

router
  .route('/')
  .get(
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    getEvents
  )
  .post(
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    postEvent
  );

router
  .route('/:student_id/show')
  .get(permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor), showEvent);
router
  .route('/:event_id/confirm')
  .put(
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    confirmEvent
  );

router
  .route('/:event_id')
  .put(
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    updateEvent
  )
  .delete(
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    deleteEvent
  );

module.exports = router;
