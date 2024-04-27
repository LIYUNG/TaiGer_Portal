const { ObjectId } = require('mongodb');
const { model, Schema } = require('mongoose');

const IntervalSchema = new Schema({
  thread_id: {
    type: Schema.Types.ObjectId,
    ref: 'Documentthread',
    required: function(){
        return student_id? false : true 
    }
  },
  student_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: function(){
        return thread_id? false : true 
    }
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
    type:{Number, default: 0},
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    expires: 93312000 // 3 years
  }
});

module.exports = model('Interval', IntervalSchema);