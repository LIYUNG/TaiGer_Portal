const { Router } = require('express');
const {
  GeneralPOSTRequestRateLimiter,
  GeneralGETRequestRateLimiter,
  GeneralPUTRequestRateLimiter,
  GeneralDELETERequestRateLimiter
} = require('../middlewares/rate_limiter');
const { filter_archiv_user } = require('../middlewares/limit_archiv_user');
const { protect, permit } = require('../middlewares/auth');
const { Role } = require('../constants');

const {
  getKeywordSet,
  createKeywordSet,
  updateKeywordSet,
  deleteKeywordSet,
  getKeywordSets
} = require('../controllers/coursekeywords');

const router = Router();

router.use(protect);

router
  .route('/')
  .get(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.External),
    getKeywordSets
  );

router
  .route('/:keywordsSetId')
  .post(
    filter_archiv_user,
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.External),
    createKeywordSet
  )
  .put(
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.External),
    updateKeywordSet
  )
  .delete(
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.External),
    deleteKeywordSet
  )
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent, Role.External),
    getKeywordSet
  );

module.exports = router;
