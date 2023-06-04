const _ = require('lodash');
const crypto = require('crypto');
const aws = require('aws-sdk');
const generator = require('generate-password');

const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { User, Role } = require('../models/User');
const Permission = require('../models/Permission');
const {
  updateNotificationEmail,
  updatePermissionNotificationEmail
} = require('../services/email');
const logger = require('../services/logger');

const generateRandomToken = () => crypto.randomBytes(32).toString('hex');
const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const getUserPermission = asyncHandler(async (req, res) => {
  const users = await Permission.find({}).lean();
  res.status(200).send({ success: true, data: users });
});

// (O) TODO email notify user
const updateUserPermission = asyncHandler(async (req, res) => {
  const {
    params: { user_id }
  } = req;

  const permissions = await Permission.findOneAndUpdate({ user_id }, req.body, {
    upsert: true,
    new: true
  }).lean();
  console.log(permissions);
  res.status(200).send({ success: true, data: permissions });
  // TODO: email inform user
  // Email inform user, the updated status
  //   await updatePermissionNotificationEmail(
  //     {
  //       firstname: updated_user.firstname,
  //       lastname: updated_user.lastname,
  //       address: updated_user.email
  //     },
  //     {}
  //   );
});

module.exports = {
  getUserPermission,
  updateUserPermission
};
