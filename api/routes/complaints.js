const { Router } = require('express');
const {
  GetComplaintListRateLimiter,
  GetComplaintRateLimiter,
  UpdateComplaintRateLimiter,
  DeleteComplaintRateLimiter,
  PostComplaintRateLimiter
} = require('../middlewares/rate_limiter');
const { protect, permit } = require('../middlewares/auth');
const { Role } = require('../constants');

const {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaint,
  deleteComplaint,
  deleteAMessageInComplaint
} = require('../controllers/complaints');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
// const {
//   permission_canModifyComplaintList_filter
// } = require('../middlewares/permission-filter');

const router = Router();

router.use(protect);

router
  .route('/')
  .get(
    filter_archiv_user,
    GetComplaintListRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    getComplaints
  )
  .post(
    filter_archiv_user,
    PostComplaintRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Student),
    // permission_canModifyComplaintList_filter,
    createComplaint
  );

router
  .route('/:ticketId')
  .get(
    filter_archiv_user,
    GetComplaintRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    getComplaint
  )
  .put(
    filter_archiv_user,
    UpdateComplaintRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
    // permission_canModifyComplaintList_filter,
    updateComplaint
  )
  .delete(
    filter_archiv_user,
    DeleteComplaintRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
    // permission_canModifyComplaintList_filter,
    deleteComplaint
  );

router
  .route('/:ticketId/:messageId')
  .put(
    filter_archiv_user,
    UpdateComplaintRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
    // permission_canModifyComplaintList_filter,
    updateComplaint
  )
  .delete(
    filter_archiv_user,
    DeleteComplaintRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
    // permission_canModifyComplaintList_filter,
    deleteAMessageInComplaint
  );

module.exports = router;
