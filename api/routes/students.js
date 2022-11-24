const { Router } = require('express');

const { ErrorResponse } = require('../common/errors');
const { protect, permit } = require('../middlewares/auth');
const {
  ProfilefileUpload,
  VPDfileUpload
} = require('../middlewares/file-upload');
const { Role, Student } = require('../models/User');

const {
  getStudent,
  getStudentAndDocLinks,
  updateBaseDocsDocumentationLink,
  getStudentsAndDocLinks,
  getStudents,
  getAllStudents,
  getArchivStudent,
  getArchivStudents,
  updateStudentsArchivStatus,
  assignAgentToStudent,
  assignEditorToStudent,
  createApplication,
  ToggleProgramStatus,
  deleteApplication
} = require('../controllers/students');
const {
  saveProfileFilePath,
  updateVPDFileNecessity,
  saveVPDFilePath,
  downloadVPDFile,
  downloadProfileFile,
  updateProfileDocumentStatus,
  deleteProfileFile,
  deleteVPDFile
} = require('../controllers/files');

const router = Router();

router.use(protect);

router
  .route('/')
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    getStudents
  );

router
  .route('/all')
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getAllStudents
  );
router
  .route('/doc-links')
  .post(permit(Role.Admin, Role.Agent), updateBaseDocsDocumentationLink);

router
  .route('/doc-links')
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getStudentsAndDocLinks
  );

router
  .route('/doc-links/:studentId')
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getStudentAndDocLinks
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
  .route('/:studentId/:program_id')
  .put(permit(Role.Admin, Role.Agent, Role.Student), ToggleProgramStatus);

router
  .route('/:studentId/vpd/:program_id')
  .put(
    permit(Role.Admin, Role.Editor, Role.Agent, Role.Student),
    updateVPDFileNecessity
  )
  .get(
    permit(Role.Admin, Role.Editor, Role.Agent, Role.Student),
    downloadVPDFile
  )
  .post(
    permit(Role.Admin, Role.Editor, Role.Agent, Role.Student),
    VPDfileUpload,
    saveVPDFilePath
  )
  .delete(permit(Role.Admin, Role.Agent, Role.Student), deleteVPDFile);

router
  .route('/:studentId/applications/:program_id')
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
