const { Schema } = require('mongoose');

const allCourseSchema = new Schema(
  {
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    all_course_chinese: { type: String, required: true },
    all_course_english: { type: String, required: true },
    description: { type: String, maxlength: 2000 }
  },
  { timestamps: true }
);

allCourseSchema.index({ updatedBy: 1 });
module.exports = {
  allCourseSchema
};
