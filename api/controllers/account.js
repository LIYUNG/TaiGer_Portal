// const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, User, Student } = require('../models/User');
const { Task } = require('../models/Task');
const async = require('async');
const { updateCredentialsEmail } = require('../services/email');
const logger = require('../services/logger');

// (O) email : self notification
const updateCredentials = asyncHandler(async (req, res, next) => {
  const {
    user,
    body: { credentials }
  } = req;
  const user_me = await User.findOne({ _id: user._id });
  if (!user_me) {
    logger.error('updateCredentials: Invalid user');
    throw new ErrorResponse(400, 'Invalid user');
  }

  user_me.password = credentials.new_password;
  await user_me.save();
  res.status(200).send({
    success: true
  });
  await updateCredentialsEmail(
    {
      firstname: user.firstname,
      lastname: user.lastname,
      address: user.email
    },
    {}
  );
});

module.exports = {
  updateCredentials
};