const { model, Schema } = require('mongoose');

const templatesSchema = new Schema({
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
const Template = model('Template', templatesSchema);
module.exports = {
  Template,
  templatesSchema
};
