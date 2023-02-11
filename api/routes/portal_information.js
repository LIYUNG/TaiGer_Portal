const { Router } = require('express');
const {
  GeneralPOSTRequestRateLimiter,
  GeneralGETRequestRateLimiter
} = require('../middlewares/rate_limiter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const { multitenant_filter } = require('../middlewares/multitenant-filter');
const {
  InnerTaigerMultitenantFilter
} = require('../middlewares/InnerTaigerMultitenantFilter');
const { protect, permit, prohibit } = require('../middlewares/auth');
const { Role } = require('../models/User');

const {
  createPortalCredentials,
  getPortalCredentials
  //   updateCourses,
} = require('../controllers/portal_informations');

const router = Router();

router.use(protect);

router
  .route('/:studentId/:programId')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Student, Role.Guest),
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    createPortalCredentials
  );

router
  .route('/:studentId')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    prohibit(Role.Guest),
    multitenant_filter,
    getPortalCredentials
  );

module.exports = router;
