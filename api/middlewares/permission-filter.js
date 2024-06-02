const { ErrorResponse } = require('../common/errors');
const { Role } = require('../models/User');
const logger = require('../services/logger');
const { getPermission } = require('../utils/queryFunctions');

const permission_canAssignEditor_filter = async (req, res, next) => {
  const { user } = req;
  const cachedPermission = await getPermission(user);

  if (user.role === Role.Admin || cachedPermission?.canAssignEditors) {
    next();
  } else {
    logger.warn('permissions denied: permission_canAssignEditor_filter');
    return next(
      new ErrorResponse(403, 'Not allowed to access other resource.')
    );
  }
};

const permission_canAssignAgent_filter = async (req, res, next) => {
  const { user } = req;
  const cachedPermission = await getPermission(user);
  if (user.role === Role.Admin || cachedPermission?.canAssignAgents) {
    next();
  } else {
    logger.warn('permissions denied: permission_canAssignAgent_filter');
    return next(
      new ErrorResponse(403, 'Not allowed to access other resource.')
    );
  }
};

const permission_canModifyDocs_filter = async (req, res, next) => {
  const { user } = req;
  if (user.role === Role.Agent || user.role === Role.Editor) {
    const cachedPermission = await getPermission(user);
    if (!cachedPermission?.canModifyDocumentation) {
      logger.warn('permissions denied: permission_canModifyDocs_filter');
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
    const cachedPermission = await getPermission(user);
    if (!cachedPermission?.canAccessStudentDatabase) {
      logger.warn(
        'permissions denied: permission_canAccessStudentDatabase_filter'
      );
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
  const permission = await getPermission(user);
  if (!permission) {
    logger.warn('permissions denied: permission_TaiGerAIRatelimiter');
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
  const permission = await getPermission(user);
  if (!permission) {
    logger.warn('permissions denied: permission_canUseTaiGerAI_filter');
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
    const permission = await getPermission(user);
    if (!permission) {
      logger.warn('permissions denied: permission_canModifyProgramList_filter');
      return next(
        new ErrorResponse(403, 'Permission denied: Operation forbidden.')
      );
    }
    if (!permission.canModifyProgramList) {
      logger.warn('permissions denied: permission_canModifyProgramList_filter');
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
    const permission = await getPermission(user);
    if (!permission) {
      logger.warn('permissions denied: permission_canModifyTicketList_filter');
      return next(
        new ErrorResponse(403, 'Permission denied: Operation forbidden.')
      );
    }
    if (!permission.canModifyTicketList) {
      logger.warn('permissions denied: permission_canModifyTicketList_filter');
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
