const { Router } = require('express');
const { protect, permit, prohibit } = require('../middlewares/auth');
const { Role } = require('../models/User');

const {
  createChecklists,
  getChecklists,
  updateChecklistStatus,
  deleteChecklist
} = require('../controllers/checklists');

const router = Router();

router.use(protect);

router
  .route('/')
  .post(permit(Role.Admin, Role.Agent), createChecklists)
  .get(
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getChecklists
  );
router
  .route('/:student_id/:item')
  .put(permit(Role.Admin, Role.Agent, Role.Student), updateChecklistStatus);

router.route('/:id').delete(permit(Role.Admin, Role.Agent), deleteChecklist);

module.exports = router;
