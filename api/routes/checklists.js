const { Router } = require('express');
const { protect, permit, prohibit } = require('../middlewares/auth');
const { Role } = require('../models/User');

const {
  createChecklists,
  getChecklists,
  updateChecklist,
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
  .route('/:id')
  .post(permit(Role.Admin, Role.Agent), updateChecklist)
  .delete(permit(Role.Admin, Role.Agent), deleteChecklist);

module.exports = router;
