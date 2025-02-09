const { Schema } = require('mongoose');
const { basedocumentationslinksSchema } = require('@taiger-common/model');

const basedocumentationslinks = new Schema(basedocumentationslinksSchema);

module.exports = {
  basedocumentationslinksSchema: basedocumentationslinks
};
