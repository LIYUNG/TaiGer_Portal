const { Schema } = require('mongoose');
const { EventSchema } = require('@taiger-common/model');

const Event = new Schema(EventSchema, { timestamps: true });

Event.pre('save', async function (next) {
  const event = this;

  try {
    // Ensure the end date is at least one minute after the start date
    if (event.end <= event.start) {
      throw new Error('Event end time must be after the start time.');
    }
    next();
  } catch (err) {
    next(err);
  }
});

Event.index({ requester_id: 1, receiver_id: 1, start: 1 });

module.exports = { EventSchema: Event };
