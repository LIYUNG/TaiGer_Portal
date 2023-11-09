const { model, Schema } = require('mongoose');

const UserlogSchema = new Schema({
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
    expires: 7776000 // 3 month
  }
});

module.exports = model('Userlog', UserlogSchema);
