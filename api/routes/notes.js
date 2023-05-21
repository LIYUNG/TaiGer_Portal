const { Router } = require('express');
const {
  GeneralGETRequestRateLimiter,
  GeneralPUTRequestRateLimiter
} = require('../middlewares/rate_limiter');
const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');
const { getStudentNotes, updateStudentNotes } = require('../controllers/notes');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');

const router = Router();
router.use(protect);

router
  .route('/:student_id')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getStudentNotes
  )
  .put(
    filter_archiv_user,
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    updateStudentNotes
  );

router.use(protect);
module.exports = router;
