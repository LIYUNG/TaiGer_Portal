const { Router } = require("express");

const { auth, permit } = require("../middlewares/auth");
const { getUsers, updateUser, deleteUser } = require("../controllers/users");

const router = Router();

router.use(auth, permit("Admin"));

router.route("/").get(getUsers);

router.route("/:id").post(updateUser).delete(deleteUser);

module.exports = router;
