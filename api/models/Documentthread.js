const { Schema } = require('mongoose');
const { documentThreadsSchema } = require('@taiger-common/model');

const documentThreads = new Schema(documentThreadsSchema);

const STUDENT_INPUT_STATUS_E = {
  EMPTY: 'empty',
  PRODIVDED: 'provided',
  GENERATED: 'generated',
  BLOCKED: 'blocked'
};

documentThreads.index(
  { student_id: 1, program_id: 1, file_type: 1 },
  { unique: true }
);

module.exports = {
  documentThreadsSchema: documentThreads,
  STUDENT_INPUT_STATUS_E
};
