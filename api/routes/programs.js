const { Router } = require('express');
const {
  GetProgramListRateLimiter,
  GetProgramRateLimiter,
  UpdateProgramRateLimiter,
  DeleteProgramRateLimiter,
  PostProgramRateLimiter
} = require('../middlewares/rate_limiter');
const { protect, permit } = require('../middlewares/auth');
const { Role } = require('../constants');

const {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
  getDistinctSchoolsAttributes
} = require('../controllers/programs');
const {
  getProgramChangeRequests,
  submitProgramChangeRequests,
  reviewProgramChangeRequest
} = require('../controllers/programChangeRequests');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const {
  permission_canModifyProgramList_filter
} = require('../middlewares/permission-filter');

const router = Router();

router.use(protect);

router
  .route('/')
  .get(
    filter_archiv_user,
    GetProgramListRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getPrograms
  )
  .post(
    filter_archiv_user,
    PostProgramRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent),
    permission_canModifyProgramList_filter,
    createProgram
  );

router
  .route('/schools')
  .get(
    filter_archiv_user,
    GetProgramListRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getDistinctSchoolsAttributes
  );

router
  .route('/:programId')
  .get(
    filter_archiv_user,
    GetProgramRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    getProgram
  )
  .put(
    filter_archiv_user,
    UpdateProgramRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent),
    permission_canModifyProgramList_filter,
    updateProgram
  )
  .delete(
    DeleteProgramRateLimiter,
    permit(Role.Admin),
    permission_canModifyProgramList_filter,
    deleteProgram
  );

router
  .route('/:programId/change-requests')
  .get(
    filter_archiv_user,
    GetProgramRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    getProgramChangeRequests
  )
  .post(
    filter_archiv_user,
    PostProgramRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    submitProgramChangeRequests
  );

router
  .route('/review-changes/:requestId')
  .post(
    filter_archiv_user,
    UpdateProgramRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    reviewProgramChangeRequest
  );

module.exports = router;
