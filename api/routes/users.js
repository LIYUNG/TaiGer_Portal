const { Router } = require('express');

const { protect, permit } = require('../middlewares/auth');
const { Role } = require('../models/User');
const { getUsers, updateUser, deleteUser } = require('../controllers/users');

const router = Router();

router.use(protect, permit(Role.Admin));

router.route('/').get(getUsers);

router.route('/:id').put(updateUser).delete(deleteUser);

module.exports = router;
