const { model, Schema } = require('mongoose');
const { TicketStatus } = require('../constants');

const TicketSchema = new Schema(
  {
    requester_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    resolver_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    program_id: { type: Schema.Types.ObjectId, ref: 'Program' },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: 'open'
    },
    description: {
      type: String,
      default: ''
    },
    feedback: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 // TODO: expireAfterSeconds. 1 year: 60*60*24*365*2
    }
  },
  { timestamps: true }
);

module.exports = model('Ticket', TicketSchema);
