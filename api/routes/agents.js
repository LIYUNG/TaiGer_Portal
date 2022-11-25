const { Router } = require('express');
const { GeneralGETRequestRateLimiter } = require('../middlewares/rate_limiter');

const { protect, permit } = require('../middlewares/auth');
const { Role } = require('../models/User');

const { getAgents } = require('../controllers/users');

const router = Router();

router.use(protect, permit(Role.Admin));

router.route('/').get(GeneralGETRequestRateLimiter, getAgents);

module.exports = router;
