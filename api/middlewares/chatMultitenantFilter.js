const { ten_minutes_cache } = require('../cache/node-cache');
const { ErrorResponse } = require('../common/errors');
const { Role } = require('../constants');

const logger = require('../services/logger');
const { getPermission } = require('../utils/queryFunctions');

const chatMultitenantFilter = async (req, res, next) => {
  const {
    user,
    params: { studentId }
  } = req;
  if (user.role === Role.Editor || user.role === Role.Agent) {
    let cachedStudent = ten_minutes_cache.get(
      `/chatMultitenantFilter/students/${studentId}`
    );
    if (cachedStudent === undefined) {
      const student = await req.db
        .model('Student')
        .findById(studentId)
        .select('agents editors')
        .lean();

      const success = ten_minutes_cache.set(
        `/chatMultitenantFilter/students/${studentId}`,
        student
      );
      if (success) {
        cachedStudent = student;
        logger.info('students agents editos cache set successfully');
      }
    }

    const cachedPermission = await getPermission(user);

    if (
      !cachedStudent.agents?.some(
        (agent_id) => agent_id.toString() === user._id.toString()
      ) &&
      !cachedStudent.editors?.some(
        (editor_id) => editor_id.toString() === user._id.toString()
      ) &&
      !cachedPermission?.canAccessAllChat
    ) {
      return next(
        new ErrorResponse(403, 'Not allowed to access other students.')
      );
    }
  }
  next();
};

module.exports = {
  chatMultitenantFilter
};
