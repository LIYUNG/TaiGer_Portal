const { model, Schema } = require('mongoose');

const docspagesSchema = new Schema({
  name: { type: String, default: '' },
  title: { type: String, default: '' },
  category: { type: String, default: '' },
  prop: { type: String, default: '' },
  author: { type: String, default: '' },
  text: { type: String, default: '' },
  country: { type: String, default: '' },
  updatedAt: Date
});

const Docspage = model('Docspage', docspagesSchema);

module.exports = { Docspage, docspagesSchema };
