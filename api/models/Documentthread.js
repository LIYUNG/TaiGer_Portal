const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const mongoose = require('mongoose');

const documentType = ['CV', 'ML', 'RL', 'Essay'];

const documentThreadsSchema = new mongoose.Schema({
  student_id: { type: ObjectId, require: true, ref: 'User' },
  program_id: { type: ObjectId, ref: 'Program' },
  outsourced_user_id: [{ type: ObjectId, ref: 'User' }],
  file_type: { type: String, require: true }, // Change to threadType
  isFinalVersion: {
    type: Boolean,
    default: false
  },
  student_input: {
    input_content: {
      type: String,
      default: ''
    },
    input_status: {
      type: String,
      default: ''
    },
    updatedAt: Date,
    createdAt: Date
  },
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
      ]
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
const Documentthread = mongoose.model('Documentthread', documentThreadsSchema);
module.exports = {
  Documentthread,
  documentType,
  STUDENT_INPUT_STATUS_E
};
