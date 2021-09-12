const { Router } = require("express");

const { protect, permit, prohibit } = require("../middlewares/auth");
const { Role } = require('../models/User')

const {
  getDocumentations,
  createDocumentation,
  updateDocumentation,
  deleteDocumentation,
} = require("../controllers/documentations");

const router = Router();

router.use(protect);

router.route("/").post(permit(Role.Admin, Role.Agent), createDocumentation);

router.route("/:category").get(prohibit(Role.Guest), getDocumentations);

router
  .route("/:id")
  .post(permit(Role.Admin, Role.Agent), updateDocumentation)
  .delete(permit(Role.Admin, Role.Agent), deleteDocumentation);

module.exports = router;
