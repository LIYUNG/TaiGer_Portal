// const moment = require('moment');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  student_id: [{ type: ObjectId, ref: 'User' }],
  taiger_user_id: [{ type: ObjectId, ref: 'User' }],
  title: {
    type: String,
    required: [true, 'Please write a title for your event']
  },
  description: {
    type: String,
    required: [true, 'Please write a description for your event']
  },
  start: {
    type: Date,
    required: [true, 'Please Insert The Start of your event'],
    min: [new Date(), "can't be before now!!"]
  },
  end: {
    type: Date,
    //setting a min function to accept any date one hour ahead of start
    min: [
      function () {
        const date = new Date(this.start);
        const validDate = new Date(date.getTime() + 60000);
        return validDate;
      },
      'Event End must be at least one minute a head of event time'
    ],
    default: function () {
      const date = new Date(this.start);
      const validDate = new Date(date.getTime() + 60000 * 30);
      return validDate;
    }
  },
  describe: { type: String }
});

module.exports = mongoose.model('Event', EventSchema);
