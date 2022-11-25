const { Router } = require('express');
const { GeneralGETRequestRateLimiter } = require('../middlewares/rate_limiter');
const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');
const {
  getAdmissions,
  getAdmissionsYear
} = require('../controllers/admissions');

const router = Router();
router.use(protect);

router
  .route('/')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor),
    getAdmissions
  );

// TODO
router
  .route('/:applications_year')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor),
    getAdmissionsYear
  );

router.use(protect);
module.exports = router;
