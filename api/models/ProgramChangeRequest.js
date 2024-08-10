const { Schema } = require('mongoose');

const { programModule } = require('./Program');
const stripModel = require('../utils/modelHelper/stripModel');

// program keys -> string values (URLs)
const changeSources = Object.keys(programModule).reduce(
  (obj, key) => ({ ...obj, [key]: Schema.Types.String }),
  {}
);

// Remove `required` and `default` properties from programModule
const cleanProgramModule = stripModel(programModule);
const programChangeRequestSchema = new Schema(
  {
    programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
    programChanges: cleanProgramModule,
    sources: changeSources,
    comment: Schema.Types.String,
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

// Assume it's requested by AI/External if requestedBy is null or undefined
programChangeRequestSchema.virtual('isRequestedByExternal').get(function () {
  return !this.requestedBy;
});

// Returns true if reviewedBy is populated, false otherwise
programChangeRequestSchema.virtual('isReviewed').get(function () {
  return !!this.reviewedBy;
});

module.exports = { programChangeRequestSchema };
