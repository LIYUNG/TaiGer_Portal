const { Schema } = require('mongoose');
const { communicationsSchema } = require('@taiger-common/model');

const communications = new Schema(communicationsSchema, {
  timestamps: true
});

communications.index({ student_id: 1 });

module.exports = {
  communicationsSchema: communications
};
