const { Schema } = require('mongoose');
const { allCourseSchema } = require('@taiger-common/model');

const allCourse = new Schema(allCourseSchema, { timestamps: true });

allCourse.index({ updatedBy: 1 });
module.exports = {
  allCourseSchema: allCourse
};
