const { Router } = require('express');

const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');

const {
  getAllInterviews,
  getInterview,
  getMyInterview,
  createInterview
} = require('../controllers/interviews');
const { multitenant_filter } = require('../middlewares/multitenant-filter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');

const router = Router();

router.use(protect);

router
  .route('/')
  .get(
    filter_archiv_user,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getAllInterviews
  );
router
  .route('/my-interviews')
  .get(
    filter_archiv_user,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getMyInterview
  );

router
  .route('/:interview_id')
  .get(
    filter_archiv_user,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getInterview
  );

router
  .route('/students/:studentId')
  .get(
    filter_archiv_user,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    createInterview
  );

router
  .route('/:program_id/:studentId')
  .post(
    filter_archiv_user,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    createInterview
  );
module.exports = router;
