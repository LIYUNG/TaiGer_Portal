const { ErrorResponse } = require('../common/errors');
const { Role } = require('../models/User');
const Permission = require('../models/Permission');

const permission_canAssignEditor_filter = async (req, res, next) => {
  const { user } = req;
  if (user.role === Role.Editor) {
    const permissions = await Permission.findOne({ user_id: user._id });
    if (permissions && permissions.canAssignEditors) {
      next();
    } else {
      return next(
        new ErrorResponse(403, 'Not allowed to access other resource.')
      );
    }
  } else {
    next();
  }
};

const permission_canAssignAgent_filter = async (req, res, next) => {
  const { user } = req;
  if (user.role === Role.Agent) {
    const permissions = await Permission.findOne({ user_id: user._id });
    if (permissions && permissions.canAssignAgents) {
      next();
    } else {
      return next(
        new ErrorResponse(403, 'Not allowed to access other resource.')
      );
    }
  } else {
    next();
  }
};

module.exports = {
  permission_canAssignEditor_filter,
  permission_canAssignAgent_filter
};
