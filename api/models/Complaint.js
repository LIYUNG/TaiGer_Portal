const { Schema } = require('mongoose');
const { complaintSchema } = require('@taiger-common/model');

const complaint = new Schema(complaintSchema, { timestamps: true });

complaint.index({ requester_id: 1 });

module.exports = { complaintSchema: complaint };
