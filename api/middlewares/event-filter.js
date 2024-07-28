const { ErrorResponse } = require('../common/errors');
const { Role } = require('../constants');

const event_multitenant_filter = async (req, res, next) => {
  const {
    user,
    params: { event_id }
  } = req;
  if (user.role === Role.Student) {
    const event = await req.db.model('Event').findById(event_id).lean();
    const containsObjectId = event?.requester_id.some((objectId) =>
      objectId.equals(user._id)
    );
    if (!containsObjectId) {
      return next(
        new ErrorResponse(403, 'Permission denied: Please contact TaiGer.')
      );
    }
  }

  if (user.role === Role.Agent || user.role === Role.Editor) {
    const event = await req.db.model('Event').findById(event_id).lean();
    const containsObjectId = event?.receiver_id.some((objectId) =>
      objectId.equals(user._id)
    );
    if (!containsObjectId) {
      return next(
        new ErrorResponse(403, 'Permission denied: Please contact TaiGer.')
      );
    }
  }

  next();
};

module.exports = {
  event_multitenant_filter
};
