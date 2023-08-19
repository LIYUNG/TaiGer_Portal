const { Router } = require('express');
const { GeneralGETRequestRateLimiter } = require('../middlewares/rate_limiter');
const { protect, permit } = require('../middlewares/auth');
const { multitenant_filter } = require('../middlewares/multitenant-filter');

const { filter_archiv_user } = require('../middlewares/limit_archiv_user');

const { Role } = require('../models/User');

const {
  getApplicationStudent
} = require('../controllers/student_applications');

const {
  permission_canAccessStudentDatabase_filter
} = require('../middlewares/permission-filter');

const router = Router();

router.use(protect);

router
  .route('/:studentId')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    getApplicationStudent
  );

module.exports = router;
