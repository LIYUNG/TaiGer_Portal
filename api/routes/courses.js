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
  getCourse,
  createCourse
  //   updateCourses,
} = require('../controllers/course');

const router = Router();

router.use(protect);

router
  .route('/:studentId')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Student, Role.Guest),
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    createCourse
  );

router
  .route('/:studentId')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    prohibit(Role.Guest),
    multitenant_filter,
    getCourse
  );

// router
//   .route('/:id')
//   .put(permit(Role.Admin, Role.Agent), updateCourses)
//   .delete(permit(Role.Admin, Role.Agent), deleteCourse);

module.exports = router;
