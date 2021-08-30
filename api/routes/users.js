const { Router } = require("express");

const { auth, permit } = require("../middlewares/auth");
const { Role } = require("../models/User");
const { getUsers, updateUser, deleteUser } = require("../controllers/users");

const router = Router();

router.use(auth, permit(Role.Admin));

router.route("/").get(getUsers);

router.route("/:id").post(updateUser).delete(deleteUser);

module.exports = router;
