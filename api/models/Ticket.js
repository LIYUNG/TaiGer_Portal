const { model, Schema } = require('mongoose');
const { TicketStatus } = require('../constants');

const ticketSchema = new Schema(
  {
    requester_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    resolver_id: {
      type: Schema.Types.ObjectId,
      // required: true,
      ref: 'User'
    },
    program_id: { type: Schema.Types.ObjectId, ref: 'Program' },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: 'open'
    },
    type: {
      type: String,
      default: 'others'
    },
    description: {
      type: String,
      default: '',
      validate: {
        validator: function (value) {
          return value.length <= 2000; // Maximum allowed length
        },
        message:
          'Description exceeds the maximum allowed length of 2000 characters'
      }
    },
    feedback: {
      type: String,
      default: '',
      validate: {
        validator: function (value) {
          return value.length <= 2000; // Maximum allowed length
        },
        message:
          'Feedback exceeds the maximum allowed length of 2000 characters'
      }
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '2y' // TODO: expireAfterSeconds. 1 year: 60*60*24*365*2
    }
  },
  { timestamps: true }
);

const Ticket = model('Ticket', ticketSchema);

module.exports = { Ticket, ticketSchema };
