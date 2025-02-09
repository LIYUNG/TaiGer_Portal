const { Schema } = require('mongoose');
const { documentationsSchema } = require('@taiger-common/model');

const documentations = new Schema(documentationsSchema);

documentations.index({ title: 'text', text: 'text' });

module.exports = { documentationsSchema: documentations };
