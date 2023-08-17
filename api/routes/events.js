const { Router } = require('express');
const Event = require('../models/Event');
const { protect, permit } = require('../middlewares/auth');
const {
  getEvents,
  showEvent,
  updateEvent,
  postEvent,
  deleteEvent
} = require('../controllers/events');
const { Role } = require('../models/User');
// const handleError = require('../utils/eventErrors');
const router = Router();

router.use(protect);

router
  .route('/')
  .get(permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor), getEvents);

router
  .route('/:id/show')
  .get(permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor), showEvent);

router
  .route('/:student_id')
  .post(
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    postEvent
  )
  .put(
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    updateEvent
  );

router
  .route('/:id/delete')
  .delete(
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    deleteEvent
  );

module.exports = router;
