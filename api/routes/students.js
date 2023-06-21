const { Router } = require('express');
const {
  GeneralPUTRequestRateLimiter,
  GeneralPOSTRequestRateLimiter,
  GeneralDELETERequestRateLimiter,
  GeneralGETRequestRateLimiter
} = require('../middlewares/rate_limiter');
const { protect, permit } = require('../middlewares/auth');
const { multitenant_filter } = require('../middlewares/multitenant-filter');
const {
  InnerTaigerMultitenantFilter
} = require('../middlewares/InnerTaigerMultitenantFilter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const {
  ProfilefileUpload,
  VPDfileUpload
} = require('../middlewares/file-upload');
const { Role, Student } = require('../models/User');

const {
  getStudent,
  getStudentAndDocLinks,
  updateDocumentationHelperLink,
  getStudentsAndDocLinks,
  getStudents,
  getAllStudents,
  getArchivStudent,
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
  deleteVPDFile,
  updateVPDPayment
} = require('../controllers/files');
const {
  permission_canAssignEditor_filter,
  permission_canAssignAgent_filter,
  permission_canAccessStudentDatabase_filter
} = require('../middlewares/permission-filter');

const router = Router();

router.use(protect);

router
  .route('/')
  .get(
    GeneralGETRequestRateLimiter,
    permit(
      Role.Admin,
      Role.Manager,
      Role.Agent,
      Role.Editor,
      Role.Student,
      Role.Guest
    ),
    permission_canAccessStudentDatabase_filter,
    getStudents
  );

router
  .route('/all')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    permission_canAccessStudentDatabase_filter,
    getAllStudents
  );
router
  .route('/doc-links')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent),
    permission_canAccessStudentDatabase_filter,
    updateDocumentationHelperLink
  );

// Let student still see their uploaded file status
router
  .route('/doc-links')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    permission_canAccessStudentDatabase_filter,
    getStudentsAndDocLinks
  );

router
  .route('/doc-links/:studentId')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    getStudentAndDocLinks
  );

router
  .route('/archiv/:studentId')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    getArchivStudent
  )
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    updateStudentsArchivStatus
  );

router
  .route('/:studentId')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    getStudent
  );

router
  .route('/:studentId/agents')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent),
    multitenant_filter,
    permission_canAssignAgent_filter,
    assignAgentToStudent
  );

router
  .route('/:studentId/editors')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor),
    multitenant_filter,
    permission_canAssignEditor_filter,
    assignEditorToStudent
  );

router
  .route('/:studentId/applications')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    createApplication
  );

router
  .route('/:studentId/:program_id')
  .put(
    filter_archiv_user,
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    ToggleProgramStatus
  );

router
  .route('/:studentId/vpd/:program_id/payments')
  .post(
    filter_archiv_user,
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    updateVPDPayment
  );

router
  .route('/:studentId/vpd/:program_id')
  .put(
    filter_archiv_user,
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    updateVPDFileNecessity
  )
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    downloadVPDFile
  )
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    VPDfileUpload,
    saveVPDFilePath
  )
  .delete(
    filter_archiv_user,
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    deleteVPDFile
  );

router
  .route('/:studentId/applications/:program_id')
  .delete(
    filter_archiv_user,
    permit(Role.Admin, Role.Manager, Role.Agent),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    deleteApplication
  );

router
  .route('/:studentId/files/:file_key')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    downloadProfileFileURL
  );

router
  .route('/:studentId/files/:category')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    ProfilefileUpload,
    saveProfileFilePath
  )
  .delete(
    filter_archiv_user,
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    deleteProfileFile
  );

router
  .route('/:studentId/:category/status')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    updateProfileDocumentStatus
  );
module.exports = router;
