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

const permission_canModifyDocs_filter = async (req, res, next) => {
  const { user } = req;
  if (user.role === Role.Agent || user.role === Role.Editor) {
    const permission = await Permission.findOne({ user_id: user._id });
    if (!permission) {
      return next(
        new ErrorResponse(403, 'Permission denied: Operation forbidden.')
      );
    }
    if (!permission.canModifyDocumentation) {
      return next(
        new ErrorResponse(403, 'Permission denied: Operation forbidden.')
      );
    }
    next();
  } else {
    next();
  }
};

const permission_canAccessStudentDatabase_filter = async (req, res, next) => {
  const { user } = req;
  if (user.role === Role.Agent || user.role === Role.Editor) {
    const permission = await Permission.findOne({ user_id: user._id });
    if (!permission) {
      return next(
        new ErrorResponse(403, 'Permission denied: Operation forbidden.')
      );
    }
    if (!permission.canAccessStudentDatabase) {
      return next(
        new ErrorResponse(403, 'Permission denied: Operation forbidden.')
      );
    }
    next();
  } else {
    next();
  }
};

const permission_TaiGerAIRatelimiter = async (req, res, next) => {
  const { user } = req;
  const permission = await Permission.findOne({ user_id: user._id });
  if (!permission) {
    return next(
      new ErrorResponse(403, 'Permission denied: Operation forbidden.')
    );
  }
  if (!permission.taigerAiQuota) {
    return next(new ErrorResponse(403, 'Permission denied: No enough Quota.'));
  }
  // Make sure not abuse the api call.
  if (permission.taigerAiQuota === 0) {
    return next(
      new ErrorResponse(
        403,
        'Permission denied: Quota exhausted. Please top up'
      )
    );
  }
  next();
};

const permission_canUseTaiGerAI_filter = async (req, res, next) => {
  const { user } = req;
  const permission = await Permission.findOne({ user_id: user._id });
  if (!permission) {
    return next(
      new ErrorResponse(403, 'Permission denied: Operation forbidden.')
    );
  }
  if (!permission.canUseTaiGerAI) {
    return next(
      new ErrorResponse(403, 'Permission denied: Operation forbidden.')
    );
  }
  next();
};

const permission_canModifyProgramList_filter = async (req, res, next) => {
  const { user } = req;
  // TODO: logic
  if (user.role === Role.Agent) {
    const permission = await Permission.findOne({ user_id: user._id });
    if (!permission) {
      return next(
        new ErrorResponse(403, 'Permission denied: Operation forbidden.')
      );
    }
    if (!permission.canModifyProgramList) {
      return next(
        new ErrorResponse(403, 'Permission denied: Operation forbidden.')
      );
    }
    next();
  } else {
    next();
  }
};

const permission_canModifyTicketList_filter = async (req, res, next) => {
  const { user } = req;
  if (user.role === Role.Agent) {
    const permission = await Permission.findOne({ user_id: user._id });
    if (!permission) {
      return next(
        new ErrorResponse(403, 'Permission denied: Operation forbidden.')
      );
    }
    if (!permission.canModifyTicketList) {
      return next(
        new ErrorResponse(403, 'Permission denied: Operation forbidden.')
      );
    }
    next();
  } else {
    next();
  }
};

module.exports = {
  permission_canAssignEditor_filter,
  permission_canAssignAgent_filter,
  permission_canModifyDocs_filter,
  permission_canAccessStudentDatabase_filter,
  permission_TaiGerAIRatelimiter,
  permission_canUseTaiGerAI_filter,
  permission_canModifyProgramList_filter,
  permission_canModifyTicketList_filter
};
