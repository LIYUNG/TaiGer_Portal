const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const mongoose = require('mongoose');

const templatesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category_name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  updatedAt: Date
});
const Template = mongoose.model('Template', templatesSchema);
module.exports = {
  Template,
  templatesSchema
};
