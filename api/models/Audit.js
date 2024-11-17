const { Schema } = require('mongoose');

const auditSchema = new Schema(
  {
    performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    targetUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    targetDocumentThreadId: { type: Schema.Types.ObjectId, ref: 'User' },
    action: String, // 'create', 'update', etc.
    field: String, // Field that was updated
    changes: {
      before: Schema.Types.Mixed,
      after: Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

auditSchema.index({ performedBy: 1, targetUserId: 1, targetDocumentId: 1 });
module.exports = {
  auditSchema
};
