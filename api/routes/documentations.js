const { Router } = require('express');
const { imageUpload } = require('../middlewares/file-upload');

const { protect, permit, prohibit } = require('../middlewares/auth');
const { Role } = require('../models/User');

const {
  getInternalDocumentationsPage,
  updateInternalDocumentationPage,
  updateDocumentationPage,
  getCategoryDocumentationsPage,
  getCategoryDocumentations,
  getAllDocumentations,
  getAllInternalDocumentations,
  getDocumentation,
  getInternalDocumentation,
  createDocumentation,
  createInternalDocumentation,
  uploadDocImage,
  updateDocumentation,
  updateInternalDocumentation,
  deleteDocumentation,
  deleteInternalDocumentation
} = require('../controllers/documentations');

const router = Router();

router.use(protect);

router.route('/').post(permit(Role.Admin, Role.Agent), createDocumentation);

// Internal Docs
router
  .route('/internal')
  .post(
    permit(Role.Admin, Role.Editor, Role.Agent),
    createInternalDocumentation
  );
router
  .route('/internal/all')
  .get(
    permit(Role.Admin, Role.Editor, Role.Agent),
    getAllInternalDocumentations
  );
router
  .route('/internal/search/:doc_id')
  .get(permit(Role.Admin, Role.Editor, Role.Agent), getInternalDocumentation);
router
  .route('/internal/:id')
  .put(permit(Role.Admin, Role.Editor, Role.Agent), updateInternalDocumentation)
  .delete(
    permit(Role.Admin, Role.Editor, Role.Agent),
    deleteInternalDocumentation
  );

router
  .route('/taiger/internal/confidential')
  .get(
    permit(Role.Admin, Role.Editor, Role.Agent),
    getInternalDocumentationsPage
  )
  .put(
    permit(Role.Admin, Role.Editor, Role.Agent),
    updateInternalDocumentationPage
  );

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
