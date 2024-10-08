const { model, Schema } = require('mongoose');

const ResponseTimeSchema = new Schema({
  thread_id: {
    type: Schema.Types.ObjectId,
    ref: 'Documentthread'
  },
  student_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  interval_type: {
    type: String,
    required: true
  },
  intervalAvg: {
    type: Number,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    expires: 93312000 // 3 years
  }
});

ResponseTimeSchema.index(
  { student_id: 1, thread_id: 1, interval_type: 1 },
  { unique: true }
);

const ResponseTime = model('ResponseTime', ResponseTimeSchema);
module.exports = {
  ResponseTime,
  ResponseTimeSchema
};
