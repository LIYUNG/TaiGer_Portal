const NodeCache = require('node-cache');
// https://www.npmjs.com/package/node-cache

// if checkperiod = 0 => no periodic check.
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 0 });
module.exports = { myCache };
