const { model, Schema } = require('mongoose');

const documentationsSchema = new Schema({
  name: { type: String, default: '' },
  title: { type: String, default: '' },
  category: { type: String, default: '' },
  author: { type: String, default: '' },
  prop: { type: String, default: '' },
  text: { type: String, default: '' },
  country: { type: String, default: '' },
  updatedAt: Date
});

documentationsSchema.index({ title: 'text', text: 'text' });

const Documentation = model('Documentation', documentationsSchema);
module.exports = { Documentation, documentationsSchema };
