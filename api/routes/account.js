const { Router } = require('express');

const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');
const {
  fileUpload,
  TranscriptExcelUpload
} = require('../middlewares/file-upload');

const {
  getMyfiles,
  downloadTemplateFile,
  UpdateStudentApplications,
  processTranscript,
  downloadXLSX,
  getMyAcademicBackground,
  updateAcademicBackground,
  updateLanguageSkill,
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
  .route('/applications/:studentId')
  .put(permit(Role.Admin, Role.Agent, Role.Student), UpdateStudentApplications);

// TaiGer Transcript Analyser:
router
  .route('/transcript/:studentId/:category')
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    TranscriptExcelUpload,
    processTranscript
  );
router
  .route('/transcript/:studentId/:filename')
  .get(permit(Role.Admin, Role.Agent, Role.Editor, Role.Student), downloadXLSX);

// Academic Survey for Students
router
  .route('/survey')
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    getMyAcademicBackground
  );
router
  .route('/survey/university')
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    updateAcademicBackground
  );
router
  .route('/survey/language')
  .post(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student, Role.Guest),
    updateLanguageSkill
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
router
  .route('/download/template/:category')
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    downloadTemplateFile
  );

module.exports = router;
