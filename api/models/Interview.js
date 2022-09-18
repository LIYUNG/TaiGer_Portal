const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const mongoose = require('mongoose');
const interviewsSchema = new mongoose.Schema({
  student_id: { type: ObjectId, ref: 'User' },
  program_id: { type: ObjectId, ref: 'Program' },
  interview_requirements_by_school: {
    type: String,
    default: ''
  },
  closed: {
    type: Boolean,
    default: false
  },
  interview_date: Date,
  interview_trainig_date: Date
});
const Interview = mongoose.model('Interview', interviewsSchema);
module.exports = {
  Interview
};
