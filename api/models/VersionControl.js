const mongoose = require('mongoose');

const changesSchema = new mongoose.Schema(
  {
    changeFrom: Object,
    chnageTo: { type: Object, required: true },
    changedAt: {
      type: Date,
      default: () => Date.now()
    },
    changedBy: {
      type: String
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'User'
    }
  },
  { _id: false }
);

const versionControlSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.ObjectId,
    refPath: 'collectionName'
  },
  collectionName: {
    type: String,
    required: true,
    enum: ['Program']
  },
  changes: [changesSchema]
});

versionControlSchema.index({ itemId: 1, collectionName: 1 });
const VC = mongoose.model('VC', versionControlSchema);
exports.default = VC;
module.exports = { VC };
