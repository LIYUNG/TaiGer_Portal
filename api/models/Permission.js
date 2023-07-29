const mongoose = require('mongoose');
const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    user_id: { type: ObjectId, ref: 'User' },
    canAssignEditors: {
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
    updatedAt: Date
  },
  { timestamps: true }
);

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
