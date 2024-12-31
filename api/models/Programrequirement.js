const {
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const { PROGRAM_SUBJECT_KEYS } = require('../constants');

const programRequirementSchema = new Schema(
  {
    programId: [{ type: ObjectId, ref: 'Program' }],
    program_categories: [
      {
        program_category: {
          type: String,
          default: ''
        },
        category_description: {
          type: String,
          default: ''
        },
        requiredECTS: {
          type: Number,
          default: 0
        },
        keywordSets: [{ type: ObjectId, ref: 'KeywordSet' }],
        maxScore: {
          type: Number,
          default: 0
        }
      }
    ],
    attributes: [
      {
        type: String,
        enum: PROGRAM_SUBJECT_KEYS
      }
    ],
    fpso: {
      type: String
    },
    admissionDescription: {
      type: String,
      default: ''
    },
    gpaScoreBoundaryGPA: {
      type: Number,
      default: 0
    },
    // max.
    gpaScore: {
      type: Number,
      default: 0
    },
    // min. score at gpaScoreBoundaryGPA. Some program has offset instead of 0
    gpaMinScore: {
      type: Number,
      default: 0
    },
    coursesScore: {
      type: Number,
      default: 0
    },
    cvScore: {
      type: Number,
      default: 0
    },
    mlScore: {
      type: Number,
      default: 0
    },
    rlScore: {
      type: Number,
      default: 0
    },
    essayScore: {
      type: Number,
      default: 0
    },
    gmatScore: {
      type: Number,
      default: 0
    },
    greScore: {
      type: Number,
      default: 0
    },
    interviewScore: {
      type: Number,
      default: 0
    },
    testScore: {
      type: Number,
      default: 0
    },
    firstRoundConsidered: [
      {
        type: String
      }
    ],
    secondRoundConsidered: [
      {
        type: String
      }
    ],
    directRejectionScore: {
      type: Number,
      default: 0
    },
    directAdmissionScore: {
      type: Number,
      default: 0
    },
    directRejectionSecondScore: {
      type: Number,
      default: 0
    },
    directAdmissionSecondScore: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

programRequirementSchema.index({ programId: 1 });

module.exports = { programRequirementSchema };
