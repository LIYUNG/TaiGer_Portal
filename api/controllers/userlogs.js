const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');
const Userlog = require('../models/Userlog');
const { ObjectId } = require('mongodb');
const { User } = require('../models/User');

const getUserslog = asyncHandler(async (req, res) => {
  const userlogs = await Userlog.find()
    .populate('user_id', 'firstname lastname role')
    .sort({ createdAt: -1 });
  res.send({ success: true, data: userlogs });
});

const getUserlog = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.user_id).select('firstname lastname');
  if (!user) {
    logger.error('getUserlog: Invalid user_id');
    throw new ErrorResponse(404, 'User not found');
  }
  const userlog = await Userlog.find({
    user_id: new ObjectId(req.params.user_id)
  })
    .populate('user_id', 'firstname lastname role')
    .sort({ createdAt: -1 });
  res.send({ success: true, data: userlog, user });
});

module.exports = {
  getUserslog,
  getUserlog
};
