const mongoose = require('mongoose');
const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');

const ResponseTimeSchema = new mongoose.Schema({
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

const ResponseTime = mongoose.model('ResponseTime', ResponseTimeSchema);
module.exports = {
  ResponseTime
};