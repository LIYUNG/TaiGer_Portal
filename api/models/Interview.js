const {
  Types: { ObjectId }
} = require('mongoose');
const mongoose = require('mongoose');

const interviewsSchema = new mongoose.Schema(
  {
    student_id: { type: ObjectId, ref: 'User' },
    trainer_id: [{ type: ObjectId, ref: 'User' }],
    thread_id: { type: ObjectId, ref: 'Documentthread' },
    program_id: { type: ObjectId, ref: 'Program' },
    event_id: { type: ObjectId, ref: 'Event' },
    interview_description: {
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
