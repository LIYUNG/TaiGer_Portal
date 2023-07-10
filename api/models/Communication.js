const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');

const communicationsSchema = new Schema({
  student_id: { type: ObjectId, ref: 'User' },
  messages: [
    {
      user_id: { type: ObjectId, ref: 'User' },
      message: {
        type: String,
        default: ''
      },
      createdAt: Date
    }
  ],
  readBy: [{ type: ObjectId, ref: 'User' }],
  updatedAt: Date
});
const Communication = model('Communication', communicationsSchema);
module.exports = {
  Communication
};
