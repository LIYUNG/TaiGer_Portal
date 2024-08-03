// const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { updateCredentialsEmail } = require('../services/email');
const logger = require('../services/logger');

// (O) email : self notification
const updateCredentials = asyncHandler(async (req, res, next) => {
  const {
    user,
    body: { credentials }
  } = req;
  const userExisted = await req.db.model('User').findById(user._id.toString());
  if (!userExisted) {
    logger.error('updateCredentials: Invalid user');
    throw new ErrorResponse(400, 'Invalid user');
  }

  userExisted.password = credentials.new_password;
  await userExisted.save();
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
  next();
});

const updateOfficehours = asyncHandler(async (req, res, next) => {
  const {
    user,
    body: { officehours, timezone }
  } = req;
  await req.db
    .model('Agent')
    .findByIdAndUpdate(user._id.toString(), { officehours, timezone }, {});

  res.status(200).send({
    success: true
  });
  next();
});

module.exports = {
  updateOfficehours,
  updateCredentials
};
