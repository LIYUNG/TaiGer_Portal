const mongoose = require('mongoose');
const {
  Types: { ObjectId }
} = require('mongoose');
const { STUDENT_INPUT_STATUS_E } = require('./Documentthread');
const contentType = ['sentence', 'paragraph', 'essay'];

const surveyInputSchema = new mongoose.Schema({
  studentId: { type: ObjectId, immutable: true, required: true, ref: 'User' },
  programId: { type: ObjectId, immutable: true, ref: 'Program' },
  fileType: {
    type: String,
    immutable: true,
    required: true
  },
  isFinalVersion: {
    type: Boolean,
    default: false
  },
  surveyContent: [
    {
      _id: false,
      questionId: String,
      question: String,
      answer: String,
      type: {
        type: String,
        enum: ['word', 'sentence', 'paragraph', 'essay']
      },
      contentType: { type: String, enum: contentType }
    }
  ],
  surveyStatus: {
    type: String,
    enum: Object.values(STUDENT_INPUT_STATUS_E),
    default: STUDENT_INPUT_STATUS_E.EMPTY
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now()
  },
  updatedAt: {
    type: Date,
    default: () => Date.now()
  }
});

const surveyInput = mongoose.model('surveyInput', surveyInputSchema);
module.exports = { surveyInput, surveyInputSchema };
