const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const mongoose = require('mongoose');
const checklistsSchema = new mongoose.Schema({
  student_id: { type: ObjectId, ref: 'User' },
  file_type: { type: String, default: '' },
  program_id: { type: ObjectId, ref: 'Program' },
  isFinalVersion: {
    type: Boolean,
    default: false
  },
  updatedAt: Date
});
const Checklist = mongoose.model('Checklist', checklistsSchema);
module.exports = Checklist;
