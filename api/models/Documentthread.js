const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const mongoose = require('mongoose');
const documentthreadsSchema = new mongoose.Schema({
  student_id: { type: ObjectId, ref: 'User' },
  file_type: { type: String, default: '' },
  program_id: { type: ObjectId, ref: 'Program' },
  isFinalVersion: {
    type: Boolean,
    default: false
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
const Documentthread = mongoose.model('Documentthread', documentthreadsSchema);
module.exports = {
  Documentthread
};
