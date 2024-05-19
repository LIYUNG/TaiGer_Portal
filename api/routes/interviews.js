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
  addInterviewTrainingDateTime
} = require('../controllers/interviews');
const { multitenant_filter } = require('../middlewares/multitenant-filter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const {
  InterviewPUTRateLimiter,
  InterviewGETRateLimiter
} = require('../middlewares/rate_limiter');
const {
  interviewMultitenantFilter
} = require('../middlewares/interviewMultitenantFilter');

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
  .route('/:interview_id')
  .get(
    filter_archiv_user,
    InterviewGETRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    interviewMultitenantFilter,
    getInterview
  )
  .put(
    filter_archiv_user,
    InterviewPUTRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    interviewMultitenantFilter,
    updateInterview
  )
  .delete(
    filter_archiv_user,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    interviewMultitenantFilter,
    deleteInterview
  );

router
  .route('/time/:interview_id')
  .post(
    filter_archiv_user,
    InterviewPUTRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    addInterviewTrainingDateTime
  );

router
  .route('/create/:program_id/:studentId')
  .post(
    filter_archiv_user,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    createInterview
  );
module.exports = router;
