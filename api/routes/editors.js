const { Router } = require("express");

const { auth, permit } = require("../middlewares/auth");
const { Role } = require("../models/User")
const { getEditors } = require("../controllers/users");

const router = Router();

router.use(auth, permit(Role.Admin));

router.route("/").get(getEditors);

module.exports = router;
