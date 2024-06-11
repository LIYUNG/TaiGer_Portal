// const moment = require('moment');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    requester_id: [{ type: ObjectId, ref: 'User' }],
    receiver_id: [{ type: ObjectId, ref: 'User' }],
    isConfirmedRequester: {
      type: Boolean,
      default: false
    },
    isConfirmedReceiver: {
      type: Boolean,
      default: false
    },
    meetingLink: {
      type: String,
      default: false
    },
    event_type: {
      type: String
    },
    title: {
      type: String
      // required: [true, 'Please write a title for your event']
    },
    description: {
      type: String,
      required: [true, 'Please write a description for your event'],
      validate: {
        validator: function (value) {
          return value.length <= 2000; // Maximum allowed length
        },
        message:
          'Description exceeds the maximum allowed length of 500 characters'
      }
    },
    start: {
      type: Date,
      required: [true, 'Please Insert The Start of your event'],
      min: [new Date(), "time can't be before now!!"]
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
    }
  },
  { timestamps: true }
);

EventSchema.index({ requester_id: 1, receiver_id: 1, start: 1 });

module.exports = mongoose.model('Event', EventSchema);
