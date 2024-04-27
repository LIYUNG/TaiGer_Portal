const { ObjectId } = require('mongodb');
const { model, Schema } = require('mongoose');

const ResponseTimeSchema = new Schema({
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
  interval_type: {
    type: String,
    required: true
  },
  interval: {
    type: {Number, default: 0},
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    expires: 93312000 // 3 years
  }
});

module.exports = model('ResponseTime', ResponseTimeSchema);