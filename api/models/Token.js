const { model, Schema } = require('mongoose');

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  value: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '20m'
  }
});

const Token = model('Token', tokenSchema);

module.exports = { Token, tokenSchema };
