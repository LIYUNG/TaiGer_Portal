const { Schema } = require('mongoose');
const { documentationsSchema } = require('@taiger-common/model');

const internaldocsSchema = new Schema({
  ...documentationsSchema,
  internal: { type: Boolean, default: true }
});

internaldocsSchema.index({ title: 'text', text: 'text' });

module.exports = { internaldocsSchema };
