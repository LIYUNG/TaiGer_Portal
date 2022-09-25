const { Router } = require('express');

const { Role } = require('../models/User');
const { protect, permit } = require('../middlewares/auth');
const { getAdmissions, getAdmissionsYear } = require('../controllers/admissions');

const router = Router();
router.use(protect);

router
  .route('/')
  .get(permit(Role.Admin, Role.Agent, Role.Editor), getAdmissions);

router
  .route('/:applications_year')
  .get(permit(Role.Admin, Role.Agent, Role.Editor), getAdmissionsYear);

router.use(protect);
module.exports = router;
