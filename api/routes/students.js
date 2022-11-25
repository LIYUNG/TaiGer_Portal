const { Router } = require('express');
const {
  GeneralPUTRequestRateLimiter,
  GeneralPOSTRequestRateLimiter,
  GeneralDELETERequestRateLimiter,
  GeneralGETRequestRateLimiter
} = require('../middlewares/rate_limiter');
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
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    getStudents
  );

router
  .route('/all')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getAllStudents
  );
router
  .route('/doc-links')
  .post(
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Agent),
    updateBaseDocsDocumentationLink
  );

router
  .route('/doc-links')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getStudentsAndDocLinks
  );

router
  .route('/doc-links/:studentId')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getStudentAndDocLinks
  );

router
  .route('/archiv')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getArchivStudents
  );

router
  .route('/archiv/:studentId')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor),
    getArchivStudent
  )
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    updateStudentsArchivStatus
  );
router
  .route('/:studentId')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getStudent
  );

router
  .route('/:studentId/agents')
  .post(
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin),
    assignAgentToStudent
  );

router
  .route('/:studentId/editors')
  .post(
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin),
    assignEditorToStudent
  );

router
  .route('/:studentId/applications')
  .post(
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Student),
    createApplication
  );

router
  .route('/:studentId/:program_id')
  .put(
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Student),
    ToggleProgramStatus
  );

router
  .route('/:studentId/vpd/:program_id')
  .put(
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent, Role.Student),
    updateVPDFileNecessity
  )
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent, Role.Student),
    downloadVPDFile
  )
  .post(
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent, Role.Student),
    VPDfileUpload,
    saveVPDFilePath
  )
  .delete(
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Student),
    deleteVPDFile
  );

router
  .route('/:studentId/applications/:program_id')
  .delete(permit(Role.Admin, Role.Agent), deleteApplication);

router
  .route('/:studentId/files/:category')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent, Role.Student),
    downloadProfileFile
  )
  .post(
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent, Role.Student),
    ProfilefileUpload,
    saveProfileFilePath
  )
  .delete(
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Student),
    deleteProfileFile
  );

router
  .route('/:studentId/:category/status')
  .post(
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Agent),
    updateProfileDocumentStatus
  );
module.exports = router;
