const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');

const documentThreadsSchema = new Schema({
  student_id: { type: ObjectId, require: true, ref: 'User' },
  program_id: { type: ObjectId, ref: 'Program' },
  outsourced_user_id: [{ type: ObjectId, ref: 'User' }],
  pin_by_user_id: [{ type: ObjectId, ref: 'User' }],
  flag_by_user_id: [{ type: ObjectId, ref: 'User' }],
  file_type: { type: String, require: true }, // Change to threadType
  isFinalVersion: {
    type: Boolean,
    default: false
  },
  isOriginAuthorDeclarationConfirmedByStudent: {
    type: Boolean,
    default: false
  },
  isOriginAuthorDeclarationConfirmedByStudentTimestamp: Date,
  messages: [
    {
      user_id: { type: ObjectId, ref: 'User' },
      message: {
        type: String,
        default: ''
      },
      createdAt: Date,
      file: [
        {
          name: {
            type: String,
            required: true
          },
          path: {
            type: String,
            required: true
          }
        }
      ],
      ignore_message: Boolean
    }
  ],
  updatedAt: Date
});

const STUDENT_INPUT_STATUS_E = {
  EMPTY: 'empty',
  PRODIVDED: 'provided',
  GENERATED: 'generated',
  BLOCKED: 'blocked'
};

documentThreadsSchema.index(
  { student_id: 1, program_id: 1, file_type: 1 },
  { unique: true }
);
const Documentthread = model('Documentthread', documentThreadsSchema);
module.exports = {
  Documentthread,
  documentThreadsSchema,
  STUDENT_INPUT_STATUS_E
};
