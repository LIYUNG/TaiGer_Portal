const { model, Schema } = require('mongoose');

const userlogSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  apiCallCount: {
    type: Number,
    required: true
  },
  apiPath: {
    type: String,
    required: true
  },
  operation: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 15552000 // 6 month
  }
});
const Userlog = model('Userlog', userlogSchema);
module.exports = { Userlog, userlogSchema };
