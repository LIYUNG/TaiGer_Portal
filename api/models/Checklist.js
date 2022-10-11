const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const mongoose = require('mongoose');
const checklistsSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  prop: { type: String, default: '' },
  text: { type: String, default: '' },
  updatedAt: Date
});
const Checklist = mongoose.model('Checklist', checklistsSchema);
module.exports = Checklist;
