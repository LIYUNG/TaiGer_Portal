const { Router } = require('express');
const { protect, permit, prohibit } = require('../middlewares/auth');
const {
  GeneralDELETERequestRateLimiter,
  GeneralPUTRequestRateLimiter,
  GeneralPOSTRequestRateLimiter,
  GeneralGETRequestRateLimiter
} = require('../middlewares/rate_limiter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const { Role } = require('../models/User');

const {
  createChecklists,
  getChecklists,
  updateChecklistStatus,
  deleteChecklist
} = require('../controllers/checklists');

const router = Router();

router.use(protect);

router
  .route('/')
  .post(
    filter_archiv_user,
    permit(Role.Admin, Role.Agent),
    GeneralPOSTRequestRateLimiter,
    createChecklists
  )
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getChecklists
  );
router
  .route('/:student_id/:item')
  .put(
    filter_archiv_user,
    permit(Role.Admin, Role.Agent, Role.Student),
    GeneralPUTRequestRateLimiter,
    updateChecklistStatus
  );

router
  .route('/:id')
  .delete(
    filter_archiv_user,
    permit(Role.Admin, Role.Agent),
    GeneralDELETERequestRateLimiter,
    deleteChecklist
  );

module.exports = router;
