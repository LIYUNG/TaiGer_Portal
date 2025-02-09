const { Schema } = require('mongoose');
const { auditSchema } = require('@taiger-common/model');

const audit = new Schema(auditSchema, { timestamps: true });

audit.index({ performedBy: 1, targetUserId: 1, targetDocumentId: 1 });
module.exports = {
  auditSchema: audit
};
