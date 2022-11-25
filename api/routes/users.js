const { Router } = require('express');
const {
  GeneralPUTRequestRateLimiter,
  GeneralPOSTRequestRateLimiter,
  GeneralDELETERequestRateLimiter,
  GeneralGETRequestRateLimiter
} = require('../middlewares/rate_limiter');
const { protect, permit } = require('../middlewares/auth');
const { Role } = require('../models/User');
const { getUsers, updateUser, deleteUser } = require('../controllers/users');

const router = Router();

router.use(protect, permit(Role.Admin));

router.route('/').get(GeneralGETRequestRateLimiter, getUsers);

router
  .route('/:id')
  .post(GeneralPOSTRequestRateLimiter, updateUser)
  .delete(GeneralDELETERequestRateLimiter, deleteUser);

module.exports = router;
