const { Router } = require('express');
const {
  GeneralPUTRequestRateLimiter,
  GeneralPOSTRequestRateLimiter,
  GeneralDELETERequestRateLimiter,
  GeneralGETRequestRateLimiter
} = require('../middlewares/rate_limiter');
const { protect, permit } = require('../middlewares/auth');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const { Role } = require('../models/User');
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

const router = Router();

router.use(protect, permit(Role.Admin));

router
  .route('/')
  .get(filter_archiv_user, GeneralGETRequestRateLimiter, getUsers)
  .post(filter_archiv_user, GeneralPOSTRequestRateLimiter, addUser);

router
  .route('/:user_id')
  .post(filter_archiv_user, GeneralPOSTRequestRateLimiter, updateUser)
  .delete(filter_archiv_user, GeneralDELETERequestRateLimiter, deleteUser);

module.exports = router;
