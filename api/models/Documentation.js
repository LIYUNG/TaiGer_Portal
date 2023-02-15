const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const mongoose = require('mongoose');
const documentationsSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  title: { type: String, default: '' },
  category: { type: String, default: '' },
  author: { type: String, default: '' },
  prop: { type: String, default: '' },
  text: { type: String, default: '' },
  country: { type: String, default: '' },
  updatedAt: Date
});
const Documentation = mongoose.model('Documentation', documentationsSchema);
module.exports = Documentation;
