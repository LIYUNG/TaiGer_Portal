const { model, Schema } = require('mongoose');

const basedocumentationslinksSchema = new Schema({
  key: { type: String, default: '' },
  category: { type: String, default: 'general' },
  link: { type: String, default: '' },
  updatedAt: Date
});

const Basedocumentationslink = model(
  'Basedocumentationslink',
  basedocumentationslinksSchema
);
module.exports = { Basedocumentationslink, basedocumentationslinksSchema };
