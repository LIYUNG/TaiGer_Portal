const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const mongoose = require('mongoose');
const documentthreadsSchema = new mongoose.Schema({
  student_id: { type: ObjectId, ref: 'User' },
  outsourced_user_id: { type: ObjectId, ref: 'User' },
  file_type: { type: String, default: '' },
  program_id: { type: ObjectId, ref: 'Program' },
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

const Documentthread = mongoose.model('Documentthread', documentthreadsSchema);
module.exports = {
  Documentthread,
  STUDENT_INPUT_STATUS_E
};
