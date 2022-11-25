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
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getMyfiles
  );

router
  .route('/files/template')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getTemplates
  );

router
  .route('/files/template/:category_name')
  .post(permit(Role.Admin), TemplatefileUpload, uploadTemplate)
  .delete(permit(Role.Admin), deleteTemplate)
  .get(
    DownloadTemplateRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    downloadTemplateFile
  );

router
  .route('/applications/:studentId')
  .put(
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Student),
    UpdateStudentApplications
  );

// TaiGer Transcript Analyser:
router
  .route('/transcript/:studentId/:category')
  .post(
    TranscriptAnalyserRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor),
    processTranscript_test
  );

router
  .route('/transcript/:studentId')
  .get(
    DownloadTemplateRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    downloadXLSX
  );

// Academic Survey for Students
router
  .route('/notifications')
  .post(
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
    updatePersonalInformationRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    updateAcademicBackground
  );

router
  .route('/survey/language/:studentId')
  .post(
    updatePersonalInformationRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    updateLanguageSkill
  );

router
  .route('/survey/preferences/:studentId')
  .post(
    updatePersonalInformationRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    updateApplicationPreferenceSkill
  );

router
  .route('/profile')
  .post(
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
