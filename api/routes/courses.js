const { Router } = require('express');
const { imageUpload } = require('../middlewares/file-upload');

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
  .post(permit(Role.Admin, Role.Agent, Role.Student, Role.Guest), createCourse);

router.route('/:student_id').get(prohibit(Role.Guest), getCourse);

// router
//   .route('/:id')
//   .put(permit(Role.Admin, Role.Agent), updateCourses)
//   .delete(permit(Role.Admin, Role.Agent), deleteCourse);

module.exports = router;
