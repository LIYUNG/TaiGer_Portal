const { Schema } = require('mongoose');
const { coursesSchema } = require('@taiger-common/model');

const courses = new Schema(coursesSchema);

module.exports = { coursesSchema: courses };
