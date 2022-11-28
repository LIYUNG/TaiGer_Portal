const { Router } = require('express');
const {
  GeneralPUTRequestRateLimiter,
  GeneralPOSTRequestRateLimiter,
  GeneralGETRequestRateLimiter,
  GeneralDELETERequestRateLimiter
} = require('../middlewares/rate_limiter');
const {
  imageUpload,
  documentationDocsUpload
} = require('../middlewares/file-upload');

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
  getDocFile,
  uploadDocDocs,
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
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent),
    createInternalDocumentation
  );
router
  .route('/internal/all')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent),
    getAllInternalDocumentations
  );
router
  .route('/internal/search/:doc_id')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent),
    getInternalDocumentation
  );
router
  .route('/internal/:id')
  .put(
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent),
    updateInternalDocumentation
  )
  .delete(
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent),
    deleteInternalDocumentation
  );

router
  .route('/taiger/internal/confidential')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent),
    getInternalDocumentationsPage
  )
  .put(
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Editor, Role.Agent),
    updateInternalDocumentationPage
  );

router
  .route('/upload/image')
  .post(
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Agent),
    imageUpload,
    uploadDocImage
  );
router
  .route('/file/:object_key')
  .get(
    GeneralGETRequestRateLimiter,
    permit(Role.Admin, Role.Agent, Role.Editor, Role.Student),
    getDocFile
  );

router
  .route('/upload/docs')
  .post(
    GeneralPOSTRequestRateLimiter,
    permit(Role.Admin, Role.Agent),
    documentationDocsUpload,
    uploadDocDocs
  );

router
  .route('/pages/:category')
  .get(
    GeneralGETRequestRateLimiter,
    prohibit(Role.Guest),
    getCategoryDocumentationsPage
  )
  .put(
    GeneralPUTRequestRateLimiter,
    prohibit(Role.Guest),
    updateDocumentationPage
  );

router
  .route('/all')
  .get(
    GeneralGETRequestRateLimiter,
    prohibit(Role.Guest),
    getAllDocumentations
  );
router
  .route('/:category')
  .get(
    GeneralGETRequestRateLimiter,
    prohibit(Role.Guest),
    getCategoryDocumentations
  );
router
  .route('/search/:doc_id')
  .get(GeneralGETRequestRateLimiter, prohibit(Role.Guest), getDocumentation);

router
  .route('/:id')
  .put(
    GeneralPUTRequestRateLimiter,
    permit(Role.Admin, Role.Agent),
    updateDocumentation
  )
  .delete(
    GeneralDELETERequestRateLimiter,
    permit(Role.Admin, Role.Agent),
    deleteDocumentation
  );

module.exports = router;
