const { Router } = require("express");

const { protect, permit } = require("../middlewares/auth");
const { Role } = require("../models/User")
const { getEditors } = require("../controllers/users");

const router = Router();

router.use(protect, permit(Role.Admin));

router.route("/").get(getEditors);

module.exports = router;
