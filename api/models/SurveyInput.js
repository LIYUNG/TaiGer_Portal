const mongoose = require('mongoose');
const {
    Types: { ObjectId }
} = require('mongoose');
const { documentType, STUDENT_INPUT_STATUS_E } = require('./Documentthread');
const contentType = ['sentence', 'paragraph', 'essay'];

const surveyInputSchema = new mongoose.Schema({
    studentId: { type: ObjectId, required: true, ref: 'User' },
    programId: { type: ObjectId, ref: 'Program' },
    surveyType: { type: String, required: true, enum: documentType },
    isSpecific: {
        type: Boolean,
        default: true
    },
    isFinalVersion: {
        type: Boolean,
        default: false
    },
    surveyContent: [{
        questionId: String,
        question: String,
        answer: String,
        // frontend styling
        rows: String,
        width: Number,
        // more generic style -> for later
        contentType: { type: String, enum: contentType }
    }],
    surveyStatus: {
        type: String,
        enum: Object.values(STUDENT_INPUT_STATUS_E),
        default: STUDENT_INPUT_STATUS_E.EMPTY
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: Date
});

const surveyInput = mongoose.model('surveyInput', surveyInputSchema);
module.exports = surveyInput;
