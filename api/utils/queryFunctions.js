const { ten_minutes_cache } = require('../cache/node-cache');
const Permission = require('../models/Permission');
const logger = require('../services/logger');

const getPermission = async (user) => {
  let cachedPermission = ten_minutes_cache.get(
    `/permission/${user._id.toString()}`
  );
  if (cachedPermission === undefined) {
    const permissions = await Permission.findOne({
      user_id: user._id
    }).lean();

    const success = ten_minutes_cache.set(
      `/permission/${user._id.toString()}`,
      permissions
    );
    if (success) {
      cachedPermission = permissions;
      logger.info('permissions cache set successfully');
    }
  }
  return cachedPermission;
};

module.exports = {
  getPermission
};
