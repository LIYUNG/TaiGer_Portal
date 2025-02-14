const { EventSchema } = require('@taiger-common/model');

EventSchema.index({ receiver_id: 1 });
EventSchema.index({ requester_id: 1 });
EventSchema.index({ start: 1 });

module.exports = { EventSchema };
