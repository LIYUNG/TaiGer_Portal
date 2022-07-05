const { Router } = require('express');

const { ErrorResponse } = require('../common/errors');
const { protect, permit } = require('../middlewares/auth');
const { fileUpload, ProfilefileUpload } = require('../middlewares/file-upload');
const { Role, Student } = require('../models/User');

const {
  getStudent,
  getStudents,
  getAllStudents,
  getArchivStudent,
  getArchivStudents,
  updateStudentsArchivStatus,
  assignAgentToStudent,
  assignEditorToStudent,
  createApplication,
  deleteApplication
} = require('../controllers/students');
const {
  saveProfileFilePath,
  downloadProfileFile,
  updateProfileDocumentStatus,
  deleteProfileFile
} = require('../controllers/files');

const router = Router();

router.use(protect);

router
  .route('/')
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), getStudents);

router
  .route('/all')
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getAllStudents
  );

router
  .route('/archiv')
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getArchivStudents
  );

router
  .route('/archiv/:studentId')
  .get(permit(Role.Admin, Role.Agent, Role.Editor), getArchivStudent)
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    updateStudentsArchivStatus
  );
router
  .route('/:studentId')
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), getStudent);

router
  .route('/:studentId/agents')
  .post(permit(Role.Admin), assignAgentToStudent);

router
  .route('/:studentId/editors')
  .post(permit(Role.Admin), assignEditorToStudent);

router
  .route('/:studentId/applications')
  .post(permit(Role.Admin, Role.Agent, Role.Student), createApplication);

router
  .route('/:studentId/applications/:applicationId')
  .delete(permit(Role.Admin, Role.Agent), deleteApplication);

router
  .route('/:studentId/files/:category')
  .get(
    permit(Role.Admin, Role.Editor, Role.Agent, Role.Student),
    downloadProfileFile
  )
  .post(
    permit(Role.Admin, Role.Editor, Role.Agent, Role.Student),
    ProfilefileUpload,
    saveProfileFilePath
  )
  .delete(permit(Role.Admin, Role.Agent, Role.Student), deleteProfileFile);

router
  .route('/:studentId/:category/status')
  .post(permit(Role.Admin, Role.Agent), updateProfileDocumentStatus);
module.exports = router;
