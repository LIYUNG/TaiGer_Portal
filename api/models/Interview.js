const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const mongoose = require('mongoose');
const interviewsSchema = new mongoose.Schema(
  {
    student_id: { type: ObjectId, ref: 'User' },
    trainer_id: { type: ObjectId, ref: 'User' },
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
    interview_date: {
      type: String,
      default: ''
    },
    interview_time: {
      type: String,
      default: ''
    },
    start: {
      type: Date
    },
    end: {
      type: Date
    }
  },
  { timestamps: true }
);
const Interview = mongoose.model('Interview', interviewsSchema);
module.exports = {
  Interview
};
