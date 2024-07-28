const mongoose = require('mongoose');
const {
  Types: { ObjectId }
} = require('mongoose');

const interviewSurveyResponseSchema = new mongoose.Schema(
  {
    student_id: { type: ObjectId, ref: 'User' },
    interview_id: { type: ObjectId, ref: 'Interview' },
    program_id: { type: ObjectId, ref: 'Program' },
    responses: [
      {
        questionId: String,
        answer: Number
      }
    ],
    isFinal: {
      type: Boolean
    },
    interviewQuestions: {
      type: String
    },
    interviewFeedback: {
      type: String
    }
  },
  { timestamps: true }
);

const InterviewSurveyResponse = mongoose.model(
  'InterviewSurveyResponse',
  interviewSurveyResponseSchema
);

module.exports = { InterviewSurveyResponse, interviewSurveyResponseSchema };
