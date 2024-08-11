const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const { TicketStatus } = require('../constants');

const complaintSchema = new Schema(
  {
    requester_id: {
      type: ObjectId,
      required: true,
      ref: 'User'
    },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: 'open'
    },
    title: {
      type: String,
      default: '',
      validate: {
        validator: function (value) {
          // Maximum allowed length
          return value.length <= 200;
        },
        message:
          'Description exceeds the maximum allowed length of 3000 characters'
      }
    },
    description: {
      type: String,
      default: '',
      validate: {
        validator: function (value) {
          // Maximum allowed length
          return value.length <= 3000;
        },
        message:
          'Description exceeds the maximum allowed length of 3000 characters'
      }
    },
    messages: [
      {
        user_id: { type: ObjectId, ref: 'User' },
        message: {
          type: String,
          default: ''
        },
        createdAt: Date,
        file: [
          {
            name: {
              type: String,
              required: true
            },
            path: {
              type: String,
              required: true
            }
          }
        ],
        ignore_message: Boolean
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Complaint = model('Complaint', complaintSchema);

module.exports = { Complaint, complaintSchema };
