const { Router } = require('express');
const { protect, permit, prohibit } = require('../middlewares/auth');
const {
  GeneralDELETERequestRateLimiter,
  GeneralPUTRequestRateLimiter,
  GeneralGETRequestRateLimiter
} = require('../middlewares/rate_limiter');
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
  .post(permit(Role.Admin, Role.Agent), createChecklists)
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getChecklists
  );
router
  .route('/:student_id/:item')
  .put(
    permit(Role.Admin, Role.Agent, Role.Student),
    GeneralPUTRequestRateLimiter,
    updateChecklistStatus
  );

router
  .route('/:id')
  .delete(
    permit(Role.Admin, Role.Agent),
    GeneralDELETERequestRateLimiter,
    deleteChecklist
  );

module.exports = router;
