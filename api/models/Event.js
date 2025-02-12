const { EventSchema } = require('@taiger-common/model');

EventSchema.index({ requester_id: 1, receiver_id: 1, start: 1 });

module.exports = { EventSchema };
