const { Router } = require('express');
const {
  GetProgramListRateLimiter,
  GetProgramRateLimiter,
  UpdateProgramRateLimiter,
  DeleteProgramRateLimiter
} = require('../middlewares/rate_limiter');
const { protect, permit } = require('../middlewares/auth');
const { Role } = require('../models/User');

const {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram
  // deleteProgram
} = require('../controllers/programs');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');

const router = Router();

router.use(protect);

router
  .route('/')
  .get(
    filter_archiv_user,
    GetProgramListRateLimiter,
    permit(Role.Admin, Role.Agent),
    getPrograms
  )
  .post(filter_archiv_user, permit(Role.Admin, Role.Agent), createProgram);

router
  .route('/:programId')
  .get(
    filter_archiv_user,
    GetProgramRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getProgram
  )
  .put(
    filter_archiv_user,
    UpdateProgramRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent),
    updateProgram
  );
// .delete(DeleteProgramRateLimiter, permit(Role.Admin), deleteProgram);

module.exports = router;
