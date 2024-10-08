const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');

const interviewSurveyResponseSchema = new Schema(
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

interviewSurveyResponseSchema.index(
  { student_id: 1, interview_id: 1 },
  { unique: true }
);

const InterviewSurveyResponse = model(
  'InterviewSurveyResponse',
  interviewSurveyResponseSchema
);

module.exports = { InterviewSurveyResponse, interviewSurveyResponseSchema };
