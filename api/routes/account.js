const { Router } = require('express');
const {
  GeneralGETRequestRateLimiter,
  GeneralPUTRequestRateLimiter,
  DownloadTemplateRateLimiter,
  RemoveNotificationRateLimiter,
  updateCredentialRateLimiter,
  updatePersonalInformationRateLimiter,
  TranscriptAnalyserRateLimiter
} = require('../middlewares/rate_limiter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const { multitenant_filter } = require('../middlewares/multitenant-filter');
const {
  InnerTaigerMultitenantFilter
} = require('../middlewares/InnerTaigerMultitenantFilter');
const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');
const { TemplatefileUpload } = require('../middlewares/file-upload');

const {
  processTranscript_test,
  downloadXLSX
} = require('../controllers/course');

const {
  getMyfiles,
  getTemplates,
  deleteTemplate,
  uploadTemplate,
  downloadTemplateFile,
  UpdateStudentApplications,
  removeNotification,
  removeAgentNotification,
  getMyAcademicBackground,
  updateAcademicBackground,
  updateLanguageSkill,
  updateApplicationPreferenceSkill,
  updatePersonalData
} = require('../controllers/files');

const { updateCredentials, updateOfficehours } = require('../controllers/account');
const { localAuth } = require('../middlewares/auth');

const router = Router();

router.use(protect);

router
  .route('/files')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    getMyfiles
  );

router
  .route('/files/template')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    getTemplates
  );

router
  .route('/files/template/:category_name')
  .post(
    filter_archiv_user,
    permit(Role.Admin),
    TemplatefileUpload,
    uploadTemplate
  )
  .delete(filter_archiv_user, permit(Role.Admin, Role.Manager), deleteTemplate)
  .get(
    filter_archiv_user,
    DownloadTemplateRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    downloadTemplateFile
  );

router
  .route('/applications/:studentId')
  .put(
    filter_archiv_user,
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Student),
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    UpdateStudentApplications
  );

// TaiGer Transcript Analyser:
router
  .route('/transcript/:studentId/:category/:language')
  .post(
    filter_archiv_user,
    TranscriptAnalyserRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    processTranscript_test
  );

router
  .route('/transcript/:studentId')
  .get(
    filter_archiv_user,
    DownloadTemplateRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    downloadXLSX
  );

// Close notification for Studen
router
  .route('/student/notifications')
  .post(
    RemoveNotificationRateLimiter,
    permit(
      Role.Admin,
      Role.Manager,
      Role.Agent,
      Role.Editor,
      Role.Student,
      Role.Guest
    ),
    removeNotification
  );

// Close notification for Agent
router
  .route('/agent/notifications')
  .post(
    filter_archiv_user,
    RemoveNotificationRateLimiter,
    permit(Role.Agent),
    removeAgentNotification
  );

// My Survey for Students
router
  .route('/survey')
  .get(
    updatePersonalInformationRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    getMyAcademicBackground
  );

router
  .route('/survey/university/:studentId')
  .post(
    filter_archiv_user,
    updatePersonalInformationRateLimiter,
    permit(
      Role.Admin,
      Role.Manager,
      Role.Agent,
      Role.Editor,
      Role.Student,
      Role.Guest
    ),
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    updateAcademicBackground
  );

router
  .route('/survey/language/:studentId')
  .post(
    filter_archiv_user,
    updatePersonalInformationRateLimiter,
    permit(
      Role.Admin,
      Role.Manager,
      Role.Agent,
      Role.Editor,
      Role.Student,
      Role.Guest
    ),
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    updateLanguageSkill
  );

router
  .route('/survey/preferences/:studentId')
  .post(
    filter_archiv_user,
    updatePersonalInformationRateLimiter,
    permit(
      Role.Admin,
      Role.Manager,
      Role.Agent,
      Role.Editor,
      Role.Student,
      Role.Guest
    ),
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    updateApplicationPreferenceSkill
  );

router
  .route('/profile/officehours/:user_id')
  .put(
    filter_archiv_user,
    updatePersonalInformationRateLimiter,
    permit(Role.Admin, Role.Agent),
    updateOfficehours
  );

router
  .route('/profile/:user_id')
  .post(
    filter_archiv_user,
    updatePersonalInformationRateLimiter,
    permit(
      Role.Admin,
      Role.Manager,
      Role.Agent,
      Role.Editor,
      Role.Student,
      Role.Guest
    ),
    updatePersonalData
  );

router
  .route('/credentials')
  .post(
    updateCredentialRateLimiter,
    permit(
      Role.Admin,
      Role.Manager,
      Role.Agent,
      Role.Editor,
      Role.Student,
      Role.Guest
    ),
    localAuth,
    updateCredentials
  );

module.exports = router;
