const { Router } = require('express');
const { GeneralGETRequestRateLimiter } = require('../middlewares/rate_limiter');
const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');
const {
  getAdmissions,
  getAdmissionsYear
} = require('../controllers/admissions');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');

const router = Router();
router.use(protect);

router
  .route('/')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getAdmissions
  );

// TODO
router
  .route('/:applications_year')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getAdmissionsYear
  );

router.use(protect);
module.exports = router;
