const NodeCache = require('node-cache');
// https://www.npmjs.com/package/node-cache

const ten_minutes_cache = new NodeCache({
  checkperiod: 300,
  stdTTL: 60 * 10
}); // cache 1 month

// if checkperiod = 0 => no periodic check.
const two_month_cache = new NodeCache({
  checkperiod: 86400,
  stdTTL: 86400 * 62
}); // cache 1 month

const one_month_cache = new NodeCache({
  checkperiod: 86400,
  stdTTL: 86400 * 31
}); // cache 1 month

const two_weeks_cache = new NodeCache({
  checkperiod: 86400,
  stdTTL: 86400 * 14
}); // cache 2 weeks

module.exports = {
  ten_minutes_cache,
  two_month_cache,
  one_month_cache,
  two_weeks_cache
};
