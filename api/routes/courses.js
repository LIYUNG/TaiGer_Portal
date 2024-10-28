const { Router } = require('express');
const {
  GeneralPOSTRequestRateLimiter,
  GeneralGETRequestRateLimiter,
  GeneralPUTRequestRateLimiter,
  TranscriptAnalyserRateLimiter,
  DownloadTemplateRateLimiter
} = require('../middlewares/rate_limiter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const { multitenant_filter } = require('../middlewares/multitenant-filter');
const {
  InnerTaigerMultitenantFilter
} = require('../middlewares/InnerTaigerMultitenantFilter');
const { protect, permit, prohibit } = require('../middlewares/auth');
const { Role } = require('../constants');

const {
  getCourse,
  createCourse,
  putCourse,
  processTranscript_api,
  processTranscript_test,
  downloadXLSX,
  processTranscript_api_gatway
  //   updateCourses,
} = require('../controllers/course');
const { logAccess } = require('../utils/log/log');

const router = Router();

router.use(protect);

// TaiGer Transcript Analyser (Python Backend)
router.route('/transcript/test').get(
  filter_archiv_user,
  TranscriptAnalyserRateLimiter,
  permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
  multitenant_filter,
  // InnerTaigerMultitenantFilter,
  processTranscript_api_gatway,
  logAccess
);

router
  .route('/:studentId')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Student, Role.Guest),
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    createCourse
  )
  .put(
    GeneralPUTRequestRateLimiter,
    prohibit(Role.Guest, Role.Editor, Role.Student),
    multitenant_filter,
    putCourse
  )
  .get(
    GeneralGETRequestRateLimiter,
    prohibit(Role.Guest),
    multitenant_filter,
    getCourse
  );

// TaiGer Transcript Analyser (Python Backend)
router
  .route('/transcript-test/:studentId/:category/:language')
  .post(
    filter_archiv_user,
    TranscriptAnalyserRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    processTranscript_api,
    logAccess
  );

// TaiGer Transcript Analyser:
router
  .route('/transcript/v2/:studentId/:category/:language')
  .post(
    filter_archiv_user,
    TranscriptAnalyserRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    processTranscript_api_gatway,
    logAccess
  );

router
  .route('/transcript/:studentId/:category/:language')
  .post(
    filter_archiv_user,
    TranscriptAnalyserRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    multitenant_filter,
    InnerTaigerMultitenantFilter,
    processTranscript_test,
    logAccess
  );

router
  .route('/transcript/:studentId')
  .get(
    filter_archiv_user,
    DownloadTemplateRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    multitenant_filter,
    downloadXLSX,
    logAccess
  );
// router
//   .route('/:id')
//   .put(permit(Role.Admin, Role.Agent), updateCourses)
//   .delete(permit(Role.Admin, Role.Agent), deleteCourse);

module.exports = router;
