const { Router } = require('express');
const {
  GetUserlogListRateLimiter,
  GetUserlogRateLimiter
} = require('../middlewares/rate_limiter');
const { protect, permit } = require('../middlewares/auth');
const { Role } = require('../models/User');

const { getUserslog, getUserlog } = require('../controllers/userlogs');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');

const router = Router();

router.use(protect);

router
  .route('/')
  .get(
    filter_archiv_user,
    GetUserlogListRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    getUserslog
  );

router
  .route('/:user_id')
  .get(
    filter_archiv_user,
    GetUserlogRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.Editor, Role.Student),
    getUserlog
  );

module.exports = router;
