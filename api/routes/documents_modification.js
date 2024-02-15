const { Router } = require('express');
const {
  getMessagesRateLimiter,
  postMessagesRateLimiter,
  postMessagesImageRateLimiter,
  GeneralPOSTRequestRateLimiter,
  SetStatusMessagesThreadRateLimiter,
  GeneralPUTRequestRateLimiter,
  GeneralDELETERequestRateLimiter,
  getMessageFileRateLimiter,
  putThreadInputRateLimiter,
  resetThreadInputRateLimiter
} = require('../middlewares/rate_limiter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const { multitenant_filter } = require('../middlewares/multitenant-filter');
const {
  InnerTaigerMultitenantFilter
} = require('../middlewares/InnerTaigerMultitenantFilter');
const {
  doc_thread_ops_validator
} = require('../middlewares/docs_thread_operation_validation');

const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');
const {
  MessagesThreadUpload,
  MessagesImageThreadUpload
} = require('../middlewares/file-upload');

const {
  getAllCVMLRLOverview,
  getCVMLRLOverview,
  initGeneralMessagesThread,
  initApplicationMessagesThread,
  getMessages,
  getMessageImageDownload,
  getMessageFileDownload,
  SetStatusMessagesThread,
  deleteGeneralMessagesThread,
  deleteProgramSpecificMessagesThread,
  deleteAMessageInThread,
  postImageInThread,
  postMessages,
  getStudentInput,
  putStudentInput,
  resetStudentInput,
  getSurveyInputs,
  getSurveyInputsByThreadId,
  postSurveyInput,
  putSurveyInput,
  resetSurveyInput
} = require('../controllers/documents_modification');
const {
  docThreadMultitenant_filter,
  surveyMultitenantFilter
} = require('../middlewares/documentThreadMultitenantFilter');

const router = Router();

router.use(protect);

router
  .route('/overview/all')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getAllCVMLRLOverview
  );
// TODO: multitenant
router
  .route('/student-input/:messagesThreadId')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    docThreadMultitenant_filter,
    getStudentInput
  )
  .put(
    putThreadInputRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    docThreadMultitenant_filter,
    putStudentInput
  )
  .delete(
    resetThreadInputRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    docThreadMultitenant_filter,
    resetStudentInput
  );

// Survey input
router
  .route('/survey-input/threads/:messagesThreadId')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    surveyMultitenantFilter,
    getSurveyInputsByThreadId
  );

router
  .route('/survey-input/:surveyInputId')
  .put(
    putThreadInputRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    surveyMultitenantFilter,
    putSurveyInput
  )
  .delete(
    resetThreadInputRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    surveyMultitenantFilter,
    resetSurveyInput
  );

router
  .route('/survey-input/:studentId/:programId?/:fileType?')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    surveyMultitenantFilter,
    getSurveyInputs
  );

router
  .route('/survey-input')
  .post(
    putThreadInputRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    surveyMultitenantFilter,
    postSurveyInput
  );

router
  .route('/overview')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    getCVMLRLOverview
  );

router
  .route('/init/general/:studentId/:document_category')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    initGeneralMessagesThread
  );

router
  .route('/init/application/:studentId/:program_id/:document_category')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    initApplicationMessagesThread
  );

router
  .route('/:messagesThreadId/:studentId')
  .put(
    filter_archiv_user,
    SetStatusMessagesThreadRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    SetStatusMessagesThread
  )
  .post(
    filter_archiv_user,
    postMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    doc_thread_ops_validator,
    MessagesThreadUpload,
    postMessages
  )
  .delete(
    filter_archiv_user,
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    multitenant_filter,
    doc_thread_ops_validator,
    InnerTaigerMultitenantFilter,
    deleteGeneralMessagesThread
  );
// TODO: multitenancy: check user id match user_id in message
router
  .route('/delete/:messagesThreadId/:messageId')
  .delete(
    filter_archiv_user,
    postMessagesImageRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    docThreadMultitenant_filter,
    deleteAMessageInThread
  );
// Get image in thread
router
  .route('/image/:messagesThreadId/:studentId/:file_name')
  .get(
    filter_archiv_user,
    postMessagesImageRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    getMessageImageDownload
  );
router
  .route('/image/:messagesThreadId/:studentId')
  .post(
    filter_archiv_user,
    postMessagesImageRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    doc_thread_ops_validator,
    MessagesImageThreadUpload,
    postImageInThread
  );

// Multitenant-filter in call-back function
router
  .route('/:messagesThreadId')
  .get(
    getMessagesRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    docThreadMultitenant_filter,
    getMessages
  );

router
  .route('/:messagesThreadId/:messageId/:file_key')
  .get(
    filter_archiv_user,
    getMessageFileRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    docThreadMultitenant_filter,
    getMessageFileDownload
  );

router
  .route('/:messagesThreadId/:program_id/:studentId')
  .delete(
    filter_archiv_user,
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    doc_thread_ops_validator,
    deleteProgramSpecificMessagesThread
  );

module.exports = router;
