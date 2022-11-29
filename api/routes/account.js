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
const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');
const { TemplatefileUpload } = require('../middlewares/file-upload');

const {
  getMyfiles,
  getTemplates,
  deleteTemplate,
  uploadTemplate,
  downloadTemplateFile,
  UpdateStudentApplications,
  processTranscript_test,
  downloadXLSX,
  removeNotification,
  getMyAcademicBackground,
  updateAcademicBackground,
  updateLanguageSkill,
  updateApplicationPreferenceSkill,
  updatePersonalData
} = require('../controllers/files');

const { updateCredentials } = require('../controllers/account');
const { localAuth } = require('../middlewares/auth');

const router = Router();

router.use(protect);

router
  .route('/files')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getMyfiles
  );

router
  .route('/files/template')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
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
  .delete(filter_archiv_user, permit(Role.Admin), deleteTemplate)
  .get(
    filter_archiv_user,
    DownloadTemplateRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    downloadTemplateFile
  );

router
  .route('/applications/:studentId')
  .put(
    filter_archiv_user,
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Student),
    UpdateStudentApplications
  );

// TaiGer Transcript Analyser:
router
  .route('/transcript/:studentId/:category')
  .post(
    filter_archiv_user,
    TranscriptAnalyserRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor),
    processTranscript_test
  );

router
  .route('/transcript/:studentId')
  .get(
    filter_archiv_user,
    DownloadTemplateRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    downloadXLSX
  );

// Academic Survey for Students
router
  .route('/notifications')
  .post(
    filter_archiv_user,
    RemoveNotificationRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    removeNotification
  );

// Academic Survey for Students
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
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    updateAcademicBackground
  );

router
  .route('/survey/language/:studentId')
  .post(
    filter_archiv_user,
    updatePersonalInformationRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    updateLanguageSkill
  );

router
  .route('/survey/preferences/:studentId')
  .post(
    filter_archiv_user,
    updatePersonalInformationRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    updateApplicationPreferenceSkill
  );

router
  .route('/profile')
  .post(
    filter_archiv_user,
    updatePersonalInformationRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    updatePersonalData
  );
router
  .route('/credentials')
  .post(
    updateCredentialRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    localAuth,
    updateCredentials
  );

module.exports = router;
