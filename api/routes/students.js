const { Router } = require('express');
const {
  GeneralPUTRequestRateLimiter,
  GeneralPOSTRequestRateLimiter,
  GeneralDELETERequestRateLimiter,
  GeneralGETRequestRateLimiter
} = require('../middlewares/rate_limiter');
const { protect, permit } = require('../middlewares/auth');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
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
  downloadProfileFileURL,
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
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getAllStudents
  );
router
  .route('/doc-links')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Agent),
    updateBaseDocsDocumentationLink
  );

// Let student still see their uploaded file status
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
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getStudentAndDocLinks
  );

router
  .route('/archiv')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor),
    getArchivStudents
  );

router
  .route('/archiv/:studentId')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor),
    getArchivStudent
  )
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    updateStudentsArchivStatus
  );
router
  .route('/:studentId')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getStudent
  );

router
  .route('/:studentId/agents')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin),
    assignAgentToStudent
  );

router
  .route('/:studentId/editors')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin),
    assignEditorToStudent
  );

router
  .route('/:studentId/applications')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Student),
    createApplication
  );

router
  .route('/:studentId/:program_id')
  .put(
    filter_archiv_user,
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Student),
    ToggleProgramStatus
  );

router
  .route('/:studentId/vpd/:program_id')
  .put(
    filter_archiv_user,
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent, Role.Student),
    updateVPDFileNecessity
  )
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent, Role.Student),
    downloadVPDFile
  )
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent, Role.Student),
    VPDfileUpload,
    saveVPDFilePath
  )
  .delete(
    filter_archiv_user,
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Student),
    deleteVPDFile
  );

router
  .route('/:studentId/applications/:program_id')
  .delete(
    filter_archiv_user,
    permit(Role.Admin, Role.Agent),
    deleteApplication
  );

router
  .route('/:studentId/files/:file_key')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent, Role.Student),
    downloadProfileFileURL
  );

router
  .route('/:studentId/files/:category')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent, Role.Student),
    ProfilefileUpload,
    saveProfileFilePath
  )
  .delete(
    filter_archiv_user,
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Student),
    deleteProfileFile
  );

router
  .route('/:studentId/:category/status')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Agent),
    updateProfileDocumentStatus
  );
module.exports = router;
