const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const mongoose = require('mongoose');
const internaldocsSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  title: { type: String, default: '' },
  category: { type: String, default: '' },
  internal: { type: Boolean, default: true },
  author: { type: String, default: '' },
  text: { type: String, default: '' },
  country: { type: String, default: '' },
  updatedAt: Date
});

internaldocsSchema.index({ title: 'text', text: 'text' });

const Internaldoc = mongoose.model('Internaldoc', internaldocsSchema);
module.exports = Internaldoc;
