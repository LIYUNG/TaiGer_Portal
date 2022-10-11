const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const mongoose = require('mongoose');
const checklistsSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  props: { type: String, default: '' },
  text: { type: String, default: '' },
  isFinalVersion: {
    type: Boolean,
    default: false
  },
  updatedAt: Date
});
const Checklist = mongoose.model('Checklist', checklistsSchema);
module.exports = Checklist;
