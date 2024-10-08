const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');

const permissionSchema = new Schema(
  {
    user_id: { type: ObjectId, ref: 'User' },
    taigerAiQuota: {
      type: Number,
      default: 0
    },
    canAssignEditors: {
      type: Boolean,
      default: false
    },
    canUseTaiGerAI: {
      type: Boolean,
      default: false
    },
    canModifyProgramList: {
      type: Boolean,
      default: false
    },
    canModifyAllBaseDocuments: {
      type: Boolean,
      default: false
    },
    canAccessAllChat: {
      type: Boolean,
      default: false
    },
    canAssignAgents: {
      type: Boolean,
      default: false
    },
    canModifyDocumentation: {
      type: Boolean,
      default: false
    },
    canAccessStudentDatabase: {
      type: Boolean,
      default: false
    },
    isEssayWriters: {
      type: Boolean,
      default: false
    },
    updatedAt: Date
  },
  { timestamps: true }
);

const Permission = model('Permission', permissionSchema);

module.exports = { Permission, permissionSchema };
