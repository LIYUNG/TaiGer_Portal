const { Router } = require("express");

const { auth, permit, prohibit } = require("../middlewares/auth");

const {
  getDocumentations,
  createDocumentation,
  updateDocumentation,
  deleteDocumentation,
} = require("../controllers/documentations");

const router = Router();

router.use(auth);

router.route("/").post(permit("Admin", "Agent"), createDocumentation);

router.route("/:category").get(prohibit("Guest"), getDocumentations);

router
  .route("/:id")
  .post(permit("Admin", "Agent"), updateDocumentation)
  .delete(permit("Admin", "Agent"), deleteDocumentation);

module.exports = router;
