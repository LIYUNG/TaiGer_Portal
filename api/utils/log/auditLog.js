const { asyncHandler } = require('../../middlewares/error-handler');
const logger = require('../../services/logger');

const auditLog = asyncHandler(async (req) => {
  try {
    const { user, audit } = req;

    const newAuditLog = {
      performedBy: user._id,
      targetUserId: audit.targetUserId, // Change this if you have a different target user ID
      targetDocumentThreadId: audit.targetDocumentThreadId, // Change this if relevant
      action: audit.action, // Action performed
      field: audit.field, // Field that was updated (if applicable)
      changes: {
        before: audit.changes.before, // Before state
        after: audit.changes.after // After state
      }
    };

    await req.db.model('Audit').create(newAuditLog);
  } catch (e) {
    logger.error(e);
  }
});

module.exports = {
  auditLog
};
