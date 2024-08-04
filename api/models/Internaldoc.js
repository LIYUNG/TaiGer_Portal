const { model, Schema } = require('mongoose');

const internaldocsSchema = new Schema({
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

const Internaldoc = model('Internaldoc', internaldocsSchema);
module.exports = { Internaldoc, internaldocsSchema };
