const mongoose = require('mongoose');
const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');

const IntervalSchema = new mongoose.Schema(
  {
    thread_id: {
      type: Schema.Types.ObjectId,
      ref: 'Documentthread'
    },
    student_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    message_1_id: {
      type: ObjectId,
      required: true
    },
    message_2_id: {
      type: ObjectId,
      required: true
    },
    interval_type: {
      type: String,
      required: true
    },
    interval: {
      type: Number,
      required: true
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      expires: 93312000 // 3 years
    }
  }
);
const Interval = mongoose.model('Interval', IntervalSchema);
module.exports = {
  Interval
};
