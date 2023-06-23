const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const mongoose = require('mongoose');
const interviewsSchema = new mongoose.Schema(
  {
    student_id: { type: ObjectId, ref: 'User' },
    program_id: { type: ObjectId, ref: 'Program' },
    interview_notes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'Unscheduled'
    },
    interviewer: {
      type: String,
      default: ''
    },
    interview_duration: {
      type: String,
      default: ''
    },
    interview_date: Date,
    interview_time: Date,

    interview_trainig_date: Date,
    interview_trainig_time: Date
  },
  { timestamps: true }
);
const Interview = mongoose.model('Interview', interviewsSchema);
module.exports = {
  Interview
};
