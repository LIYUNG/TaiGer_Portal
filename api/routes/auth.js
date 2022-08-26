const { Router } = require('express');

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

router.post('/signup', signup);

router.post('/login', localAuth, login);

router.get('/logout', logout);

router.get('/verify', protect, verify); // check current user

router.post('/activation', activateAccount);

router.post('/resend-activation', resendActivation);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

module.exports = router;
