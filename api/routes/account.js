const { Router } = require('express');

const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');
const {
  TemplatefileUpload,
  TranscriptExcelUpload
} = require('../middlewares/file-upload');

const {
  getMyfiles,
  getTemplates,
  deleteTemplate,
  uploadTemplate,
  downloadTemplateFile,
  UpdateStudentApplications,
  processTranscript_test,
  processTranscript,
  downloadXLSX,
  removeNotification,
  getMyAcademicBackground,
  updateAcademicBackground,
  updateLanguageSkill,
  updateApplicationPreferenceSkill,
  updatePersonalData,
  updateCredentials
} = require('../controllers/files');

const { localAuth } = require('../middlewares/auth');

const router = Router();

router.use(protect);

router
  .route('/files')
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), getMyfiles);

router
  .route('/files/template')
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), getTemplates);

router
  .route('/files/template/:category_name')
  .post(permit(Role.Admin), TemplatefileUpload, uploadTemplate)
  .delete(permit(Role.Admin), deleteTemplate)
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    downloadTemplateFile
  );

router
  .route('/applications/:studentId')
  .put(permit(Role.Admin, Role.Agent, Role.Student), UpdateStudentApplications);

// TaiGer Transcript Analyser:
router
  .route('/transcript/:studentId/:category')
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor),
    processTranscript_test
  );

// router
//   .route('/transcript/:studentId/:category')
//   .post(
//     permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
//     TranscriptExcelUpload,
//     processTranscript
//   );
router
  .route('/transcript/:studentId')
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), downloadXLSX);

// Academic Survey for Students
router
  .route('/notifications')
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    removeNotification
  );

// Academic Survey for Students
router
  .route('/survey')
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    getMyAcademicBackground
  );

router
  .route('/survey/university/:studentId')
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    updateAcademicBackground
  );

router
  .route('/survey/language/:studentId')
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    updateLanguageSkill
  );

router
  .route('/survey/preferences/:studentId')
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    updateApplicationPreferenceSkill
  );

router
  .route('/profile')
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    updatePersonalData
  );
router
  .route('/credentials')
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    localAuth,
    updateCredentials
  );

module.exports = router;
