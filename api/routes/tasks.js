const { Router } = require('express');

const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');
const {
  fileUpload,
  TranscriptExcelUpload,
  EditGeneralDocsUpload
} = require('../middlewares/file-upload');
const {
  getTasks,
  getMyTask,
  getMyStudentsTasks,
  getStudentTasks,
  initTasks,
  updateTasks
} = require('../controllers/tasks');

const router = Router();
router.use(protect);

router
  .route('/')
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), getTasks);

router.route('/mytask').get(permit(Role.Student), getMyTask);

router
  .route('/my-students-tasks')
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getMyStudentsTasks
  );

router
  .route('/:studentId')
  .get(permit(Role.Admin, Role.Agent, Role.Editor), getStudentTasks);

router.route('/:studentId').post(initTasks);

router
  .route('/:studentId')
  .put(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), updateTasks);

router.use(protect);
module.exports = router;
