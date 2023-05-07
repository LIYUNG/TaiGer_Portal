const { Router } = require('express');
const {
  GeneralPOSTRequestRateLimiter,
  GeneralGETRequestRateLimiter
} = require('../middlewares/rate_limiter');
const { protect, permit } = require('../middlewares/auth');
const { Role } = require('../models/User');

const {
  WidgetProcessTranscript,
  WidgetdownloadXLSX
} = require('../controllers/widget');

const router = Router();

router.use(protect);

router
  .route('/transcript/:category/:language')
  .post(
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent),
    WidgetProcessTranscript
  );
router
  .route('/transcript/:adminId')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Manager, Role.Agent),
    WidgetdownloadXLSX
  );

module.exports = router;
