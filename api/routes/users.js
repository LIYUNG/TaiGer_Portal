const { Router } = require('express');
const {
  GeneralPUTRequestRateLimiter,
  GeneralPOSTRequestRateLimiter,
  GeneralDELETERequestRateLimiter,
  GeneralGETRequestRateLimiter
} = require('../middlewares/rate_limiter');
const { protect, permit } = require('../middlewares/auth');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const { Role } = require('../constants');

const {
  getUsers,
  updateUserArchivStatus,
  addUser,
  updateUser,
  deleteUser,
  getUser
} = require('../controllers/users');

const router = Router();

router.use(protect, permit(Role.Admin, Role.Agent, Role.Editor));

router
  .route('/')
  .get(
    filter_archiv_user,
    permit(Role.Admin),
    GeneralGETRequestRateLimiter,
    getUsers
  )
  .post(
    filter_archiv_user,
    permit(Role.Admin),
    GeneralPOSTRequestRateLimiter,
    addUser
  );

router
  .route('/:user_id')
  .post(
    filter_archiv_user,
    permit(Role.Admin),
    GeneralPOSTRequestRateLimiter,
    updateUser
  )
  .get(filter_archiv_user, GeneralGETRequestRateLimiter, getUser)
  .delete(
    filter_archiv_user,
    permit(Role.Admin),
    GeneralDELETERequestRateLimiter,
    deleteUser
  );
router.route('/archiv/:user_id').post(
  filter_archiv_user,
  permit(Role.Admin),
  GeneralPOSTRequestRateLimiter,
  updateUserArchivStatus
);

module.exports = router;
