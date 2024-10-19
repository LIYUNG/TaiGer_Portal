const {
  Schema,
  Types: { ObjectId }
} = require('mongoose');

const programRequirementSchema = new Schema(
  {
    programId: { type: ObjectId, ref: 'Program' },
    program_category: [
      {
        Program_Category: {
          type: String,
          default: ''
        },
        requiredECTS: {
          type: Number,
          default: 0
        },
        keywordSets: [{ type: ObjectId, ref: 'Keywordset' }],
        maxScore: {
          type: Number,
          default: 0
        }
      }
    ],
    fpso: {
      type: String
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

programRequirementSchema.index({ categoryName: 1 });

module.exports = { programRequirementSchema };
