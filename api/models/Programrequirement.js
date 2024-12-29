const {
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const { programRequirementAttributeSchema } = require('./common');
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
    gpaScore: {
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
    directRejectionScore: {
      type: Number,
      default: 0
    },
    directAdmissionScore: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

programRequirementSchema.index({ programId: 1 });

module.exports = { programRequirementSchema };
