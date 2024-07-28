const { Router } = require('express');
const {
  GeneralPOSTRequestRateLimiter,
  GeneralGETRequestRateLimiter,
  GeneralPUTRequestRateLimiter
} = require('../middlewares/rate_limiter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const { multitenant_filter } = require('../middlewares/multitenant-filter');
const {
  InnerTaigerMultitenantFilter
} = require('../middlewares/InnerTaigerMultitenantFilter');
const { protect, permit, prohibit } = require('../middlewares/auth');
const { Role } = require('../constants');


const {
  getCourse,
  createCourse,
  putCourse
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
  )
  .put(
    GeneralPUTRequestRateLimiter,
    prohibit(Role.Guest, Role.Editor, Role.Student),
    multitenant_filter,
    putCourse
  )
  .get(
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
