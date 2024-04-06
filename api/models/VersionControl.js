const mongoose = require('mongoose');

const changesSchema = new mongoose.Schema(
  {
    originalValues: Object,
    updatedValues: { type: Object, required: true },
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
  docId: {
    type: mongoose.ObjectId,
    refPath: 'collectionName'
  },
  collectionName: {
    type: String,
    required: true
  },
  changes: [changesSchema]
});

versionControlSchema.statics.getVersion = async function (
  docId,
  collectionName
) {
  return await this.findOne({ docId, collectionName });
};

versionControlSchema.index({ docId: 1, collectionName: 1 });
const VC = mongoose.model('VC', versionControlSchema);
module.exports = VC;
