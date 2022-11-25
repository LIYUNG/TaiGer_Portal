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

const router = Router();

router.use(protect);

router
  .route('/')
  .get(GetProgramListRateLimiter, permit(Role.Admin, Role.Agent), getPrograms)
  .post(permit(Role.Admin, Role.Agent), createProgram);

router
  .route('/:programId')
  .get(
    GetProgramRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getProgram
  )
  .put(
    UpdateProgramRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent),
    updateProgram
  );
// .delete(DeleteProgramRateLimiter, permit(Role.Admin), deleteProgram);

module.exports = router;
