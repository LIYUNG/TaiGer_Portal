const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');

const intervalSchema = new Schema({
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
});

intervalSchema.index(
  {
    student_id: 1,
    thread_id: 1,
    interval_type: 1,
    message_1_id: 1,
    message_2_id: 1
  },
  { unique: true }
);

const Interval = model('Interval', intervalSchema);
module.exports = {
  Interval,
  intervalSchema
};
