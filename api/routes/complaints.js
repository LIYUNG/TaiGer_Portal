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
  deleteAMessageInComplaint,
  postMessageInTicket,
  getMessageFileInTicket,
  updateAMessageInComplaint
} = require('../controllers/complaints');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const { multitenant_filter } = require('../middlewares/multitenant-filter');
const {
  doc_thread_ops_validator
} = require('../middlewares/docs_thread_operation_validation');
const { MessagesTicketUpload } = require('../middlewares/file-upload');
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
    updateAMessageInComplaint
  )
  .delete(
    filter_archiv_user,
    DeleteComplaintRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
    // permission_canModifyComplaintList_filter,
    deleteAMessageInComplaint
  );

router.route('/:studentId/:ticketId/:fileKey').get(
  filter_archiv_user,
  UpdateComplaintRateLimiter,
  permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
  // permission_canModifyComplaintList_filter,
  // multitenant_filter,
  // doc_thread_ops_validator,
  MessagesTicketUpload,
  getMessageFileInTicket
);

router.route('/new-message/:ticketId/:studentId').post(
  filter_archiv_user,
  UpdateComplaintRateLimiter,
  permit(Role.Admin, Role.Manager, Role.Editor, Role.Agent, Role.Student),
  // permission_canModifyComplaintList_filter,
  // multitenant_filter,
  // doc_thread_ops_validator,
  MessagesTicketUpload,
  postMessageInTicket
);

module.exports = router;
