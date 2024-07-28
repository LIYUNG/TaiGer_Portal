const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');

const interviewsSchema = new Schema(
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
      type: Date
    },
    isClosed: {
      type: Boolean,
      default: false
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

interviewsSchema.index(
  { student_id: 1, program_id: 1, thread_id: 1 },
  { unique: true }
);

const Interview = model('Interview', interviewsSchema);
module.exports = {
  Interview,
  interviewsSchema
};
