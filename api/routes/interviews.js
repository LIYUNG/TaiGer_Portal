const { Router } = require('express');

const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');

const {
  getAllInterviews,
  getInterview,
  getMyInterview,
  createInterview,
  deleteInterview,
  updateInterview,
  updateInterviewTrainer
} = require('../controllers/interviews');
const { multitenant_filter } = require('../middlewares/multitenant-filter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const {
  InterviewPUTRateLimiter,
  InterviewGETRateLimiter
} = require('../middlewares/rate_limiter');

const router = Router();

router.use(protect);

router
  .route('/')
  .get(
    filter_archiv_user,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getAllInterviews
  );
router
  .route('/my-interviews')
  .get(
    filter_archiv_user,
    InterviewGETRateLimiter,
    permit(Role.Student),
    getMyInterview
  );
router
  .route('/trainer/:interview_id')
  .put(
    filter_archiv_user,
    InterviewPUTRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    updateInterviewTrainer
  );

router
  .route('/:interview_id')
  .get(
    filter_archiv_user,
    InterviewGETRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    getInterview
  )
  .put(
    filter_archiv_user,
    InterviewPUTRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    updateInterview
  )
  .delete(
    filter_archiv_user,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    deleteInterview
  );

router
  .route('/:program_id/:studentId')
  .post(
    filter_archiv_user,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    createInterview
  );
module.exports = router;
