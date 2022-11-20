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
  text: { type: String, default: '' },
  country: { type: String, default: '' },
  updatedAt: Date
});
const Internaldoc = mongoose.model('Internaldoc', internaldocsSchema);
module.exports = Internaldoc;
