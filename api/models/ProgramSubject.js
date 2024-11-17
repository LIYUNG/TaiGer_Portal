const { Schema } = require('mongoose');

const programSubjectSchema = new Schema({
  _id: {
    // coded representation (abbreviated) of the subject/label
    type: String,
    required: true,
    unique: true // must be distinct -> Ensures no duplicate codes
  },
  subjectName: {
    // full name of the subject/label
    type: String,
    required: true
  }
});

programSubjectSchema.index({ _id: 1 }, { unique: true });
module.exports = programSubjectSchema;
