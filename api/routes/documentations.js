const { Router } = require('express');
const { imageUpload } = require('../middlewares/file-upload');

const { protect, permit, prohibit } = require('../middlewares/auth');
const { Role } = require('../models/User');

const {
  updateDocumentationPage,
  getCategoryDocumentationsPage,
  getCategoryDocumentations,
  getAllDocumentations,
  getDocumentation,
  createDocumentation,
  uploadDocImage,
  updateDocumentation,
  deleteDocumentation
} = require('../controllers/documentations');

const router = Router();

router.use(protect);

router.route('/').post(permit(Role.Admin, Role.Agent), createDocumentation);
router
  .route('/upload/image')
  .post(permit(Role.Admin, Role.Agent), imageUpload, uploadDocImage);
router
  .route('/pages/:category')
  .get(prohibit(Role.Guest), getCategoryDocumentationsPage)
  .put(prohibit(Role.Guest), updateDocumentationPage);

router.route('/all').get(prohibit(Role.Guest), getAllDocumentations);
router.route('/:category').get(prohibit(Role.Guest), getCategoryDocumentations);
router.route('/search/:doc_id').get(prohibit(Role.Guest), getDocumentation);

router
  .route('/:id')
  .put(permit(Role.Admin, Role.Agent), updateDocumentation)
  .delete(permit(Role.Admin, Role.Agent), deleteDocumentation);

module.exports = router;
