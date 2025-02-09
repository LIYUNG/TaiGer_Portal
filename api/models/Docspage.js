const { Schema } = require('mongoose');
const { docspagesSchema } = require('@taiger-common/model');

const docspages = new Schema(docspagesSchema);

module.exports = { docspagesSchema: docspages };
