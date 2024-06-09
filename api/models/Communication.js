const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');

const communicationsSchema = new Schema(
  {
    student_id: { type: ObjectId, ref: 'User' },
    user_id: { type: ObjectId, ref: 'User' },
    message: {
      type: String,
      default: ''
    },
    readBy: [{ type: ObjectId, ref: 'User' }],
    files: [
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
    createdAt: Date,
    ignore_message: Boolean
  },
  { timestamps: true }
);

communicationsSchema.index({ student_id: 1 });
const Communication = model('Communication', communicationsSchema);
module.exports = {
  Communication
};
