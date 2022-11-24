const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const mongoose = require('mongoose');
const basedocumentationslinksSchema = new mongoose.Schema({
  key: { type: String, default: '' },
  link: { type: String, default: '' },
  updatedAt: Date
});
const Basedocumentationslink = mongoose.model(
  'Basedocumentationslink',
  basedocumentationslinksSchema
);
module.exports = { Basedocumentationslink };
