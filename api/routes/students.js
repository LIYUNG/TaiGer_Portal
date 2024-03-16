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
const { Role } = require('../models/User');

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
  deleteApplication,
  getAllActiveStudents,
  getAllArchivStudents,
  getStudentApplications,
  assignAttributesToStudent
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
const { logAccess } = require('../utils/log/log');

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
    getStudents,
    logAccess
  );

router
  .route('/all/archiv')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    permission_canAccessStudentDatabase_filter,
    getAllArchivStudents,
    logAccess
  );

router
  .route('/all/active')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    permission_canAccessStudentDatabase_filter,
    getAllActiveStudents,
    logAccess
  );

router
  .route('/all')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    permission_canAccessStudentDatabase_filter,
    getAllStudents,
    logAccess
  );
router
  .route('/doc-links')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent),
    permission_canAccessStudentDatabase_filter,
    updateDocumentationHelperLink,
    logAccess
  );

// Let student still see their uploaded file status
router
  .route('/doc-links')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    permission_canAccessStudentDatabase_filter,
    getStudentsAndDocLinks,
    logAccess
  );

router
  .route('/doc-links/:studentId')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    getStudentAndDocLinks,
    logAccess
  );

router
  .route('/archiv/:studentId')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    permission_canAccessStudentDatabase_filter,
    InnerTaigerMultitenantFilter,
    getArchivStudent,
    logAccess
  )
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    permission_canAccessStudentDatabase_filter,
    InnerTaigerMultitenantFilter,
    updateStudentsArchivStatus,
    logAccess
  );

router
  .route('/:studentId')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    getStudent,
    logAccess
  );

router
  .route('/:studentId/agents')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent),
    InnerTaigerMultitenantFilter,
    permission_canAssignAgent_filter,
    assignAgentToStudent,
    logAccess
  );

router
  .route('/:studentId/editors')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor),
    InnerTaigerMultitenantFilter,
    permission_canAssignEditor_filter,
    assignEditorToStudent,
    logAccess
  );

router
  .route('/:studentId/attributes')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent),
    InnerTaigerMultitenantFilter,
    assignAttributesToStudent,
    logAccess
  );

router
  .route('/:studentId/applications')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    getStudentApplications,
    logAccess
  )
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    createApplication,
    logAccess
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
    ToggleProgramStatus,
    logAccess
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
    updateVPDPayment,
    logAccess
  );

router
  .route('/:studentId/vpd/:program_id/:fileType')
  .put(
    filter_archiv_user,
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    updateVPDFileNecessity,
    logAccess
  )
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    downloadVPDFile,
    logAccess
  )
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    VPDfileUpload,
    saveVPDFilePath,
    logAccess
  )
  .delete(
    filter_archiv_user,
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    deleteVPDFile,
    logAccess
  );

router
  .route('/:studentId/applications/:program_id')
  .delete(
    filter_archiv_user,
    permit(Role.Admin, Role.Manager, Role.Agent),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    deleteApplication,
    logAccess
  );

router
  .route('/:studentId/files/:file_key')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    downloadProfileFileURL,
    logAccess
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
    saveProfileFilePath,
    logAccess
  )
  .delete(
    filter_archiv_user,
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Student),
    permission_canAccessStudentDatabase_filter,
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    deleteProfileFile,
    logAccess
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
    updateProfileDocumentStatus,
    logAccess
  );
module.exports = router;
