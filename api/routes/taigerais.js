const { Router } = require('express');
const { GeneralGETRequestRateLimiter } = require('../middlewares/rate_limiter');
const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');
const { processProgramListAi } = require('../controllers/taigerais');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const {
  permission_canModifyProgramList_filter
} = require('../middlewares/permission-filter');

const router = Router();
router.use(protect);

router
  .route('/:programId')
  .get(
    filter_archiv_user,
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor),
    permission_canModifyProgramList_filter,
    processProgramListAi
  );

router.use(protect);
module.exports = router;
