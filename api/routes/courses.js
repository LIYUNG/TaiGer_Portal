const { Router } = require('express');
const {
  GeneralPOSTRequestRateLimiter,
  GeneralGETRequestRateLimiter
} = require('../middlewares/rate_limiter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const { protect, permit, prohibit } = require('../middlewares/auth');
const { Role } = require('../models/User');

const {
  getCourse,
  createCourse
  //   updateCourses,
  //   deleteCourse
} = require('../controllers/course');

const router = Router();

router.use(protect);

router
  .route('/:student_id')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Student, Role.Guest),
    createCourse
  );

router
  .route('/:student_id')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    prohibit(Role.Guest),
    getCourse
  );

// router
//   .route('/:id')
//   .put(permit(Role.Admin, Role.Agent), updateCourses)
//   .delete(permit(Role.Admin, Role.Agent), deleteCourse);

module.exports = router;
