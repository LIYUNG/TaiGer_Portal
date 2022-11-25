const { Router } = require('express');
const {
  loginRateLimiter,
  registerRateLimiter,
  GeneralGETRequestRateLimiter
} = require('../middlewares/rate_limiter');

const { localAuth, protect } = require('../middlewares/auth');
const {
  signup,
  login,
  logout,
  verify,
  activateAccount,
  resendActivation,
  forgotPassword,
  resetPassword
} = require('../controllers/auth');

const router = Router();

router.post('/signup', registerRateLimiter, signup);

router.post('/login', loginRateLimiter, localAuth, login);

router.get('/logout', GeneralGETRequestRateLimiter, logout);

router.get('/verify', GeneralGETRequestRateLimiter, protect, verify); // check current user

router.post('/activation', loginRateLimiter, activateAccount);

router.post('/resend-activation', loginRateLimiter, resendActivation);

router.post('/forgot-password', loginRateLimiter, forgotPassword);

router.post('/reset-password', loginRateLimiter, resetPassword);

module.exports = router;
